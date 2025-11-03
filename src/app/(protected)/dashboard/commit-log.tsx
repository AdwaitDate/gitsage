"use client";

import useProject from "@/hooks/use-project";
import { cn } from "@/lib/utils";
import { api } from "@/trpc/react";
import { ExternalLink, GitCommit } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

const CommitLog = () => {
  const { projectId, project } = useProject();
  const { data: commits } = api.project.getCommits.useQuery({ projectId });

  if (!commits || commits.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4 border">
          <GitCommit className="w-8 h-8 text-muted-foreground" />
        </div>
        <h3 className="font-medium text-foreground mb-2">No commits found</h3>
        <p className="text-muted-foreground">Commits will appear here once they're available.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {commits.map((commit, commitIdx) => (
        <div key={commit.id} className="relative">
          {/* Timeline connector */}
          {commitIdx !== commits.length - 1 && (
            <div className="absolute left-6 top-14 bottom-0 w-px bg-border" />
          )}

          <div className="group">
            <div className="flex gap-4 p-4 rounded-lg border bg-card hover:bg-accent/5 transition-colors duration-200">
              {/* Avatar with status indicator */}
              <div className="relative flex-shrink-0">
                <img
                  src={commit.commitAuthorAvatar}
                  alt={`${commit.commitAuthorName}'s avatar`}
                  className="w-10 h-10 rounded-full bg-muted border-2 border-background shadow-sm"
                />
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-background" />
              </div>

              {/* Commit content */}
              <div className="flex-1 min-w-0 space-y-3">
                {/* Header */}
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <span className="font-medium text-card-foreground">
                      {commit.commitAuthorName}
                    </span>
                    <Badge variant="secondary" className="text-xs px-2 py-0.5 font-normal">
                      committed
                    </Badge>
                  </div>
                  
                  <Link
                    target="_blank"
                    href={`${project?.githubUrl}/commit/${commit.commitHash}`}
                    className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors duration-200 flex-shrink-0 group/link"
                  >
                    <span className="hidden sm:inline">View commit</span>
                    <ExternalLink className="w-3.5 h-3.5 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform duration-200" />
                  </Link>
                </div>

                {/* Commit message and hash */}
                <div className="space-y-2">
                  <p className="font-medium text-card-foreground leading-relaxed">
                    {commit.commitMessage}
                  </p>
                  
                  <div className="flex items-center gap-2">
                    <code className="text-xs font-mono bg-muted text-muted-foreground px-2 py-1 rounded-md border border-border/50">
                      {commit.commitHash.substring(0, 7)}
                    </code>
                  </div>
                </div>

                {/* AI Summary */}
                {commit.summary && (
                  <div className="bg-muted/50 border border-border/50 rounded-lg p-4 space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                        <div className="w-2 h-2 bg-white rounded-full" />
                      </div>
                      <span className="text-xs font-medium text-foreground">AI Summary</span>
                    </div>
                    <div className="bg-card border border-border/30 rounded-md p-3">
                      <pre className="text-sm text-card-foreground whitespace-pre-wrap leading-relaxed font-sans">
                        {commit.summary}
                      </pre>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CommitLog;