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
  // const saveAnswer = api.question.saveAnswer.useMutation()

  const onSubmit1 = async (e: React.FormEvent<HTMLFormElement>) => {
    setAnswer('')
    setFilesReferences([])
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
        <DialogContent className='sm:max-w-[80vw]'>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Image src="/logo.png" alt="Gitsage" height={40} width={40} />
              <span>GitSage Answer</span>
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            {/* Answer Section */}
            <div>
              <h2 className="text-lg font-semibold mb-3">Answer</h2>
              <div className="max-h-[40vh] overflow-y-auto scrollbar-hide border rounded-md p-4 bg-muted/30">
                <MDEditor.Markdown source={answer} className='max-w-full' />
              </div>
            </div>

            {/* Code References Section */}
            {filesReferences.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold mb-3">Code References</h2>
                <CodeReferences filesReferences={filesReferences}/>
              </div>
            )}
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
            <Button type="submit" disabled={loading}>Ask Gitsage</Button>
          </form>
        </CardContent>
      </Card>
    </>
  );
};

export default AskQuestionCard;
