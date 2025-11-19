import { GithubRepoLoader } from "@langchain/community/document_loaders/web/github";
import { Document } from "@langchain/core/documents";
import { generateEmbedding, summariseCode } from "./gemini";
import { db } from "@/server/db";
import { env } from "@/env";

export const loadGithubRepo = async (githubUrl: string, githubToken?: string) => {
    const loader = new GithubRepoLoader(
        githubUrl,
        {
            branch: "main",
            ignoreFiles: ['package-lock.json', 'bun.lockb'],
            recursive: true,
            // recursive: false,
            accessToken: githubToken || env.GITHUB_TOKEN,
            unknown: "warn",
            maxConcurrency: 5, // Defaults to 2
        }
    );
    const docs = await loader.load();
    return docs
};

// console.log(await loadGithubRepo('https://github.com/AdwaitDate/scrape-flow'))

export const indexGithubRepo = async (projectId: string, githubUrl: string, githubToken?: string) => {
    const docs = await loadGithubRepo(githubUrl, githubToken);
    const allEmbeddings = await generateEmbeddings(docs);
    await Promise.allSettled(allEmbeddings.map(async (embedding, index) => {
        console.log(`Processing ${index} of ${allEmbeddings.length}`);
        if (!embedding) return;
        const sourceCodeEmbedding = await db.sourceCodeEmbedding.create({
            data: {
                summary: embedding.summary,
                sourceCode: embedding.sourceCode,
                fileName: embedding.fileName,
                projectId,
            }
        })
        await db.$executeRaw`
        UPDATE "SourceCodeEmbedding"
        SET "summaryEmbedding" = ${embedding.embedding}::vector
        WHERE id = ${sourceCodeEmbedding.id}
    `;
    }))
}

async function generateEmbeddings(docs: Document[]) {
    return await Promise.all(docs.map(async (doc) => {
        const summary = await summariseCode(doc);
        const embedding = await generateEmbedding(summary)
        return {
            summary,
            embedding,
            sourceCode: JSON.parse(JSON.stringify(doc.pageContent)),
            fileName: doc.metadata.source,
        }
    }));
}