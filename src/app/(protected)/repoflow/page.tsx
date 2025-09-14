// "use client";

// import { useEffect, useRef, useState } from "react";
// import mermaid from "mermaid";
// import { db } from "@/server/db";
// import { Octokit } from "octokit";
// import { GoogleGenerativeAI } from "@google/generative-ai";

// // ---------- SETUP ----------

// // Octokit instance
// const octokit = new Octokit({
//   auth: process.env.GITHUB_TOKEN,
// });

// // Gemini client (model name: test)
// const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
// const model = genAI.getGenerativeModel({ model: "test" });

// // ---------- HELPERS ----------

// // Fetch GitHub URL for given project
// async function fetchProjectGithubUrl(projectId: string) {
//   const project = await db.project.findUnique({
//     where: { id: projectId },
//     select: { githubUrl: true },
//   });
//   if (!project?.githubUrl) {
//     throw new Error("Project not linked to GitHub");
//   }
//   return { project, githubUrl: project.githubUrl };
// }

// // Fetch repo details via Octokit & save them in DB
// async function fetchAndSaveRepoDetails(projectId: string, githubUrl: string) {
//   const [owner, repo] = githubUrl.split("/").slice(-2);

//   const { data } = await octokit.rest.repos.get({ owner, repo });

//   // Save repo details in DB
//   await db.test.upsert({
//     where: { projectId },
//     update: {
//       name: data.name,
//       description: data.description ?? "",
//       stars: data.stargazers_count,
//       forks: data.forks_count,
//     },
//     create: {
//       projectId,
//       name: data.name,
//       description: data.description ?? "",
//       stars: data.stargazers_count,
//       forks: data.forks_count,
//     },
//   });

//   return data;
// }

// // Ask Gemini to generate a Mermaid diagram string
// async function generateMermaidDiagram(repoDetails: any) {
//   const prompt = `
// You are an expert system designer. Create a userflow diagram in Mermaid.js format 
// that describes how users interact with the GitHub repository.

// Repository details:
// - Name: ${repoDetails.name}
// - Description: ${repoDetails.description}
// - Stars: ${repoDetails.stargazers_count}
// - Forks: ${repoDetails.forks_count}

// The diagram should include:
// * User interacting with Frontend
// * Frontend calling Backend
// * Backend accessing Database
// * Backend fetching from GitHub API
// * GitHub API connecting with Gemini AI

// Return ONLY a valid Mermaid.js diagram string (no explanation).
// Example format:

// flowchart TD
//   A[User] --> B[Frontend]
//   B --> C[Backend]
//   C --> D[Database]
//   C --> E[GitHub API]
//   E --> F[Gemini AI]
//   `;

//   const response = await model.generateContent(prompt);
//   return response.response.text();
// }

// // ---------- MERMAID COMPONENT ----------
// function Mermaid({ chart }: { chart: string }) {
//   const ref = useRef<HTMLDivElement>(null);

//   useEffect(() => {
//     if (ref.current) {
//       mermaid.initialize({ startOnLoad: true, theme: "default" });
//       ref.current.innerHTML = `<div class="mermaid">${chart}</div>`;
//       mermaid.init(undefined, ref.current.querySelectorAll(".mermaid"));
//     }
//   }, [chart]);

//   return <div ref={ref} />;
// }

// // ---------- MAIN PAGE ----------
// export default function Page() {
//   const [diagram, setDiagram] = useState<string | null>(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     async function load() {
//       try {
//         const projectId = "cmfd2lqgu0009uya7vo6ub9qk"; // <-- user-selected project ID

//         // Step 1: Get GitHub URL
//         const { githubUrl } = await fetchProjectGithubUrl(projectId);

//         // Step 2: Fetch repo details & save in DB
//         const repoDetails = await fetchAndSaveRepoDetails(projectId, githubUrl);

//         // Step 3: Generate Mermaid diagram
//         const diagramText = await generateMermaidDiagram(repoDetails);

//         setDiagram(diagramText);
//       } catch (err) {
//         console.error("Error:", err);
//       } finally {
//         setLoading(false);
//       }
//     }

//     load();
//   }, []);

//   return (
//     <div className="p-6">
//       <h1 className="text-xl font-bold mb-4">Repo Userflow Diagram</h1>
//       {loading ? (
//         <p>Loading...</p>
//       ) : diagram ? (
//         <Mermaid chart={diagram} />
//       ) : (
//         <p>No diagram generated.</p>
//       )}
//     </div>
//   );
// }