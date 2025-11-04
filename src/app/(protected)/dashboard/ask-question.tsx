"use client";

import MDEditor from "@uiw/react-md-editor";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import useProject from "@/hooks/use-project";
import React, { useState } from "react";
import Image from "next/image";
import { askquestion } from "./actions";
import { readStreamableValue } from "@ai-sdk/rsc";
import { api } from "@/trpc/react";
import { toast } from "sonner";
import { DownloadIcon } from "lucide-react";
import CodeReferences from "./code-references";

const AskQuestionCard = () => {
  const { project } = useProject();
  const [question, setQuestion] = useState("");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [filesReferences, setFilesReferences] = React.useState<
    { fileName: string; sourceCode: string; summary: string }[]
  >([]);
  const [answer, setAnswer] = React.useState("");
  const saveAnswer = api.project.saveAnswer.useMutation();

  const onSubmit1 = async (e: React.FormEvent<HTMLFormElement>) => {
    setAnswer("");
    setFilesReferences([]);
    e.preventDefault();
    if (!project?.id) return;
    setLoading(true);

    const { output, filesReferenced } = await askquestion(question, project.id);
    setOpen(true);
    setFilesReferences(filesReferenced);

    for await (const delta of readStreamableValue(output)) {
      if (delta) {
        setAnswer((ans) => ans + delta);
      }
    }
    setLoading(false);
  };
  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="bg-background text-foreground max-h-[90vh] w-[90vw] overflow-x-hidden overflow-y-auto rounded-2xl p-6 sm:max-w-[80vw]">
          {/* Header */}
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <DialogTitle className="flex flex-wrap items-center gap-3">
              <Image src="/logo.png" alt="Logo" width={40} height={40} />
              <p className="font-medium">Question:</p>
              <p className="break-words">{question}</p>
              <div className="ml-auto">
                <Button
                  disabled={saveAnswer.isPending}
                  variant="outline"
                  onClick={() => {
                    saveAnswer.mutate(
                      {
                        projectId: project?.id!,
                        question,
                        answer,
                        filesReferences,
                      },
                      {
                        onSuccess: () => toast.success("Answer saved"),
                        onError: () => toast.error("Failed to save answer"),
                      },
                    );
                  }}
                >
                  Save Answer
                </Button>
              </div>
            </DialogTitle>
          </div>

          {/* Answer Section */}
          <div className="w-full">
            <div className="border-border bg-muted/10 rounded-lg border p-4">
              <MDEditor.Markdown
                source={answer}
                className="prose prose-invert dark:prose-invert !w-full !max-w-full"
              />
            </div>
          </div>

          {/* Code References Section */}
          <div className="mt-6 w-full">
            <h2 className="mb-2 text-lg font-semibold">Files Referenced</h2>
            <div className="border-border bg-muted/10 rounded-lg border p-4">
              <CodeReferences filesReferences={filesReferences} />
            </div>
          </div>

          {/* Footer */}
          <div className="mt-6 flex justify-end">
            <Button onClick={() => setOpen(false)}>Close</Button>
          </div>
        </DialogContent>
      </Dialog>

      <Card className="relative col-span-3">
        <CardHeader>
          <CardTitle>Ask a Question</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit1}>
            <Textarea
              placeholder="Which file should I edit to change the home page?"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
            />
            <div className="h-4"></div>
            <Button type="submit" disabled={loading}>
              Ask Gitsage
            </Button>
          </form>
        </CardContent>
      </Card>
    </>
  );
};

export default AskQuestionCard;
