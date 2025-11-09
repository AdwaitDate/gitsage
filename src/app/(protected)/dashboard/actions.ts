"use server";

import { streamText } from "ai";
import { createStreamableValue } from "@ai-sdk/rsc";
import { createGoogleGenerativeAI } from "@ai-sdk/google";

import { db } from "@/server/db";
import { generateEmbedding, formatCommitContext } from "@/lib/gemini";

const google = createGoogleGenerativeAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export async function askquestion(question: string, projectId: string) {
  const stream = createStreamableValue("");

  const embedding = await generateEmbedding(question);
  const vectorQuery = `[${embedding.join(",")}]`;

  // Search source code embeddings
  const result = (await db.$queryRaw`
      SELECT
    "fileName",
    "sourceCode",
        "summary",
        1 - ("summaryEmbedding" <=> ${vectorQuery}::vector) AS similarity
      FROM "SourceCodeEmbedding"
      WHERE 1 - ("summaryEmbedding" <=> ${vectorQuery}::vector) > 0.5
      AND "projectId" = ${projectId}
      ORDER BY  similarity DESC
      LIMIT 10;
    `) as { fileName: string; sourceCode: string; summary: string }[];

  // Search commit diff embeddings
  let commitDiffResults: Array<{
    commitHash: string;
    fileName: string;
    diffContent: string;
    lines: string | null;
    similarity: number;
  }> = [];

  try {
    commitDiffResults = (await db.$queryRaw`
      SELECT 
        cd."commitHash",
        cd."fileName",
        cd."diffContent",
        cd."lines",
        1 - (cd."embedding" <=> ${vectorQuery}::vector) AS similarity
      FROM "CommitDiffEmbedding" cd
      WHERE cd."projectId" = ${projectId}
        AND 1 - (cd."embedding" <=> ${vectorQuery}::vector) > 0.5
      ORDER BY similarity DESC
      LIMIT 5
    `) as Array<{
      commitHash: string;
      fileName: string;
      diffContent: string;
      lines: string | null;
      similarity: number;
    }>;
  } catch (error) {
    console.error('Error searching commit diffs:', error instanceof Error ? error.message : 'Unknown error');
    // Continue without commit context if this fails
  }

  // Fetch commit metadata for matched diffs
  let commitContext = '';
  if (commitDiffResults.length > 0) {
    const commitHashes = [...new Set(commitDiffResults.map(r => r.commitHash))];
    const commits = await db.commit.findMany({
      where: {
        commitHash: { in: commitHashes },
        projectId: projectId,
      },
    });

    // Merge commit data with diff results
    const commitData = commitDiffResults.map(diff => {
      const commit = commits.find(c => c.commitHash === diff.commitHash);
      return {
        commitHash: diff.commitHash,
        commitAuthorName: commit?.commitAuthorName || 'Unknown',
        commitDate: commit?.commitDate?.toISOString() || '',
        commitMessage: commit?.commitMessage || '',
        fileName: diff.fileName,
        diffContent: diff.diffContent,
        summary: commit?.summary || '',
      };
    });

    commitContext = formatCommitContext(commitData);
  }

  let context = "";

  for (const doc of result) {
    context += `source:${doc.fileName}\ncode content:${doc.sourceCode}\nsummary of file:${doc.summary}\n\n`;
  }

  (async () => {
    const { textStream } = await streamText({
      model: google("gemini-flash-latest"),
      prompt: `
            You are a ai code assistant who answers questions about the codebase. Your target audience is a technical intern who is looking to understand the codebase.
                    AI assistant is a brand new, powerful, human-like artificial intelligence.
      The traits of AI include expert knowledge, helpfulness, cleverness, and articulateness.
      AI is a well-behaved and well-mannered individual.
      AI is always friendly, kind, and inspiring, and he is eager to provide vivid and thoughtful responses to the user.
      AI has the sum of all knowledge in their brain, and is able to accurately answer nearly any question about any topic in conversation.
      If the question is asking about code or a specific file, AI will provide the detailed answer, giving step by step instructions, including code snippets.
      
      START CODE CONTEXT BLOCK
      ${context}
      END OF CODE CONTEXT BLOCK
      ${commitContext}
      
      START QUESTION
      ${question}
      END OF QUESTION
      
      IMPORTANT INSTRUCTIONS:
      - If asked about who modified, changed, or worked on specific code/files/functionality, answer ONLY from the RELEVANT COMMIT HISTORY section.
      - Include the author name, date, and what they changed.
      - Never guess or invent information about code modifications.
      - If the commit history is empty or doesn't contain relevant information, say "I don't have information about who modified this code in the available commit history."
      - For general code questions, use the CODE CONTEXT BLOCK.
      - AI assistant will take into account any CONTEXT BLOCK that is provided in a conversation.
      - If the context does not provide the answer to question, the AI assistant will say, "I'm sorry, but I don't know the answer to that question".
      - AI assistant will not apologize for previous responses, but instead will indicated new information was gained.
      - AI assistant will not invent anything that is not drawn directly from the context.
      - Answer in markdown syntax, with code snippets if needed. Be as detailed as possible when answering, make sure there is no ambiguity and include any and all relevant information to give context to the intern.
            `,
    });

    for await (const delta of textStream) {
      stream.update(delta);
    }

    stream.done();
  })();

  return { output: stream.value, filesReferenced: result };
}
