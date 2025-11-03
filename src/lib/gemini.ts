import { GoogleGenerativeAI } from '@google/generative-ai';
import { loadGithubRepo } from './github-loader'

const genAi = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const model = genAi.getGenerativeModel({ model: 'gemini-flash-latest' });

export const getSummary = async (doc: Awaited<ReturnType<typeof loadGithubRepo>>[number]) => {
    console.log("getting summary for", doc.metadata.source);
    try {
        const code = doc.pageContent.slice(0, 10000); // Limit to 10000 characters

        const response = await model.generateContent([
            `You are an intelligent senior software engineer who specialises in onboarding junior software engineers onto projects`,
            `You are onboarding a junior software engineer and explaining to them the purpose of the ${doc.metadata.source} file`,
            `Here is the code:
            ----
              ${code}
            ----
            Give a summary no more than 100 words of the code above,`
        ]);

        console.log("got back summary", doc.metadata.source);
        return response.response.text();
    } catch (error) {
        console.log("AI summary failed for", doc.metadata.source, "using fallback");
        // Fallback: Generate a simple summary based on file name and content
        const fileName = doc.metadata.source.split('/').pop() || 'file';
        const fileType = fileName.split('.').pop() || 'code';
        const lines = doc.pageContent.split('\n').length;
        return `This ${fileType} file (${fileName}) contains ${lines} lines of code. ${doc.pageContent.slice(0, 100)}...`;
    }
}

export const aiSummariseCommit = async (diff: string) => {
    try {
        const response = await model.generateContent([
            `You are an expert programmer, and you are trying to summarize a git diff.

Reminders about the git diff format:
For every file, there are a few metadata lines, like (for example):

\`\`\`
diff --git a/lib/index.js b/lib/index.js
index aadf091..bfef603 100644
--- a/lib/index.js
+++ b/lib/index.js
\`\`\`

This means that \`lib/index.js\` was modified in this commit. Note that this is only an example.
Then there is a specifier of the lines that were modified.
A line starting with \`+\` means it was added.
A line that starting with \`-\` means that line was deleted.
A line that starts with neither \`+\` nor \`-\` is code given for context and better understanding.
It is not part of the diff.
[...]

EXAMPLE SUMMARY COMMENTS:
\`\`\`
* Raised the amount of returned recordings from \`10\` to \`100\` [packages/server/recordings_api.ts], [packages/server/constants.ts]
* Fixed a typo in the github action name [.github/workflows/gpt-commit-summarizer.yml]
* Moved the \`octokit\` initialization to a separate file [src/octokit.ts], [src/index.ts]
* Added an OpenAI API for completions [packages/utils/apis/openai.ts]
* Lowered numeric tolerance for test files
\`\`\`

Most commits will have less comments than this examples list.
The last comment does not include the file names,
because there were more than two relevant files in the hypothetical commit.
Do not include parts of the example in your summary.
It is given only as an example of appropriate comments.`,

            `Please summarise the following diff file:\n\n${diff}`
        ]);

        return response.response.text();
    } catch (error) {
        console.log("AI commit summary failed, using fallback");
        // Fallback: Generate a simple summary based on diff content
        const addedLines = (diff.match(/^\+/gm) || []).length;
        const removedLines = (diff.match(/^-/gm) || []).length;
        const files = diff.match(/^diff --git a\/(.+?) b\/(.+?)$/gm) || [];
        const fileNames = files.map(f => {
            const parts = f.split(' ');
            // Ensure the part exists before using replace
            return parts[2] ? parts[2].replace('b/', '') : '';
        }).filter(name => !!name);

        if (fileNames && fileNames.length > 0) {
            return `Modified ${fileNames.join(', ')}: ${addedLines} lines added, ${removedLines} lines removed.`;
        } else {
            return `Code changes: ${addedLines} lines added, ${removedLines} lines removed.`;
        }
    }
};


// export const getEmbeddings = async (text: string) => {
//     try {
//         const payload = text.replaceAll("\n", " ");
//         const response = await openAI.embeddings.create({
//             model: "text-embedding-ada-002",
//             input: payload,
//         });
//         return response.data[0]?.embedding;
//     } catch (error) {
//         console.log("OpenAI embeddings failed, using fallback");
//         // Fallback: Return a simple zero vector for embeddings
//         // This will prevent the system from crashing but won't provide meaningful embeddings
//         return new Array(1536).fill(0);
//     }
// }

