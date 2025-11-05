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
  const saveAnswer = api.project.saveAnswer.useMutation()

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
  <DialogContent
    className="sm:max-w-[80vw] w-[90vw] max-h-[90vh] overflow-y-auto overflow-x-hidden p-6 rounded-2xl bg-background text-foreground"
  >
    {/* Header */}
    <div className="flex items-center gap-2 flex-wrap mb-4">
      <DialogTitle className="flex items-center flex-wrap">
        <Image src="/logo.png" alt="Logo" width={40} height={40} />
        <p className="ml-2 font-medium">Question:</p>
        <p className="ml-2 mr-2 break-words">{question}</p>
        <Button disabled={saveAnswer.isPending} variant={'outline'} onClick={() => {
                            saveAnswer.mutate({
                                projectId:project?.id!,
                                question,
                                answer,
                                filesReferences
                            }, {
                                onSuccess: () => {
                                    toast.success('Answer saved')
                                },
                                onError: () => {
                                    toast.error('Failed to save answer')
                                }
                            })
                        }} >Save Answer</Button>
      </DialogTitle>
    </div>

    {/* Answer Section */}
    <div className="w-full">
      <div className="rounded-lg border border-border bg-muted/10 p-4">
        <MDEditor.Markdown
          source={answer}
          className="!max-w-full !w-full prose prose-invert dark:prose-invert"
        />
      </div>
    </div>

    {/* Code References Section */}
    <div className="mt-6 w-full">
      <h2 className="text-lg font-semibold mb-2">Files Referenced</h2>
      <div className="rounded-lg border border-border bg-muted/10 p-4">
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
