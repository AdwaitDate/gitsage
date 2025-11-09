import { db } from "@/server/db";
import { Octokit } from "octokit";
import axios from "axios";
import { aiSummariseCommit, generateEmbedding, extractLineRange } from "./gemini";
import { Prisma } from "@prisma/client";
export const octokit = new Octokit({
    auth: process.env.GITHUB_TOKEN,
})

const githubUrl = 'https://github.com/AdwaitDate/scrape-flow'

type Response ={
    commitHash:string;
    commitMessage:string;
    commitAuthorName:string;
    commitAuthorAvatar:string;
    commitDate:string;

}

export const getCommitHashes = async(githubUrl:string):Promise<Response[]> =>{
    const [owner,repo] = githubUrl.split('/').slice(-2)
    if(!owner || !repo){
        throw new Error('Invalid github url')
    }
    const {data} =await octokit.rest.repos.listCommits({
        owner,
        repo,
    
    })
    const sortedCommits = data.sort((a:any,b:any)=> new Date(b.commit.author?.date || '').getTime() - new Date(a.commit.author?.date || '').getTime())

    return sortedCommits.slice(0,15).map((commit:any)=>({
        commitHash:commit.sha as string,
        commitMessage:commit.commit.message ?? " ",
        commitAuthorName:commit.commit.author?.name ?? " ",
        commitAuthorAvatar:commit.author?.avatar_url ?? " ",
        commitDate:commit.commit.author?.date ?? " ",
    }))
}
// console.log(await getCommitHashes(githubUrl))

export const pollCommits = async (projectId: string) => {
  const { project, githubUrl } = await fetchProjectGithubUrl(projectId);
  const commitHashes = await getCommitHashes(githubUrl);
  const unprocessedCommits = await filterUnprocessedCommits(projectId, commitHashes);

  const summaryResponses = await Promise.allSettled(
    unprocessedCommits.map((commit) => {
      return summariseCommit(githubUrl, commit.commitHash);
    })
  );

  const summaries = summaryResponses.map((response) => {
    if (response.status === 'fulfilled') {
      return response.value as string;
    }
    return ' ';
  });

  const commits = await db.commit.createMany({
    data: summaries.map((summary, index) => {
        console.log(`Processing commit:${index}`);
      return {
        projectId,
        commitHash: unprocessedCommits[index]!.commitHash,
        commitMessage: unprocessedCommits[index]!.commitMessage,
        commitAuthorName: unprocessedCommits[index]!.commitAuthorName,
        commitAuthorAvatar: unprocessedCommits[index]!.commitAuthorAvatar,
        commitDate: unprocessedCommits[index]!.commitDate,
        summary,
      };
    }),
  });

  // Process commit diffs and generate embeddings
  await processCommitDiffs(projectId, githubUrl, unprocessedCommits);

  return commits;
};

  
async function summariseCommit(githubUrl:string,commitHash:string){
    //get the diff and pass it to gemini
    const {data} = await axios.get(`${githubUrl}/commit/${commitHash}.diff`,{
        headers:{
            'Accept':'application/vnd.github.v3.diff',
        }
    })
    return await aiSummariseCommit(data) || " "
}

async function  fetchProjectGithubUrl(projectId:string) {
    const project = await db.project.findUnique({
        where:{id:projectId},
        select:{
            githubUrl:true
        }
    })
    if(!project?.githubUrl){
        throw new Error('Project not linked to github')
    }
    return {project,githubUrl:project?.githubUrl}
    
}

async function filterUnprocessedCommits(projectId:string,commitHashes:Response[]){
    const processedCommits = await db.commit.findMany({
        where:{projectId},
    })
    const unprocessedCommits = commitHashes.filter((commit)=> !processedCommits.some((processedCommit)=> processedCommit.commitHash === commit.commitHash))
    return unprocessedCommits
}

/**
 * Process commit diffs and generate embeddings for semantic search
 */
async function processCommitDiffs(
  projectId: string,
  githubUrl: string,
  commits: Response[]
) {
  const [owner, repo] = githubUrl.split('/').slice(-2);
  if (!owner || !repo) {
    throw new Error('Invalid github url');
  }

  for (const commit of commits) {
    try {
      // console.log(`Processing diffs for commit: ${commit.commitHash.substring(0, 7)}`);
      
      // Fetch detailed commit data with file patches
      const { data: commitData } = await octokit.rest.repos.getCommit({
        owner,
        repo,
        ref: commit.commitHash,
      });

      if (!commitData.files || commitData.files.length === 0) {
        // console.log(`No files in commit ${commit.commitHash.substring(0, 7)}`);
        continue;
      }

      // Process each file in the commit
      const diffEmbeddings = await Promise.allSettled(
        commitData.files.map(async (file) => {
          if (!file.patch) {
            return null; // Skip files without patches (binary files, etc.)
          }

          try {
            // Generate embedding for the diff content
            const embedding = await generateEmbedding(file.patch);
            const lines = extractLineRange(file.patch);

            return {
              projectId,
              commitHash: commit.commitHash,
              fileName: file.filename,
              diffContent: file.patch,
              lines: lines || undefined,
              embedding: `[${embedding.join(',')}]`,
            };
          } catch (error) {
            console.error(`Error processing file ${file.filename}:`, error instanceof Error ? error.message : 'Unknown error');
            return null;
          }
        })
      );

      // Filter out failed embeddings and null values
      const validEmbeddings = diffEmbeddings
        .filter((result) => result.status === 'fulfilled' && result.value !== null)
        .map((result) => (result as PromiseFulfilledResult<any>).value);

      if (validEmbeddings.length > 0) {
        // Store embeddings in database one by one
        for (const emb of validEmbeddings) {
          try {
            // Match the pattern from github-loader.ts - direct vector cast
            await db.$executeRaw`
              INSERT INTO "CommitDiffEmbedding" 
              ("id", "projectId", "commitHash", "fileName", "diffContent", "lines", "embedding", "createdAt", "updatedAt")
              VALUES (
                gen_random_uuid()::text,
                ${emb.projectId},
                ${emb.commitHash},
                ${emb.fileName},
                ${emb.diffContent},
                ${emb.lines},
                ${emb.embedding}::vector,
                NOW(),
                NOW()
              )
            `;
          } catch (error) {
            console.error(`Error inserting embedding for ${emb.fileName}:`, error instanceof Error ? error.message : 'Unknown error');
            // Continue with next embedding
          }
        }
        
        console.log(`Stored ${validEmbeddings.length} diff embeddings for commit ${commit.commitHash.substring(0, 7)}`);
      }
    } catch (error) {
      console.error(`Error processing commit ${commit.commitHash}:`, error instanceof Error ? error.message : 'Unknown error');
      // Continue with next commit even if this one fails
    }
  }
}

// await pollCommits('cmfd2lqgu0009uya7vo6ub9qk').then((res)=>console.log(res)).catch((err)=>console.log(err))