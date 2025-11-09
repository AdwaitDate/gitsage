"use client";

import MDEditor from "@uiw/react-md-editor";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import useProject from "@/hooks/use-project";
import React, { useState } from "react";
import Image from "next/image";
import { askquestion } from "./actions";
import { readStreamableValue } from "@ai-sdk/rsc";
import { api } from "@/trpc/react";
import { toast } from "sonner";
import CodeReferences from "./code-references";
import { Sparkle } from "lucide-react";

const AskQuestionCard = () => {
  const { project } = useProject();
  const [question, setQuestion] = useState("");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [filesReferences, setFilesReferences] = useState<
    { fileName: string; sourceCode: string; summary: string }[]
  >([]);
  const [answer, setAnswer] = useState("");
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
      {/* Dialog for Answer */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[80vw] max-w-[90vw] max-h-[90vh] overflow-y-auto p-6 rounded-2xl bg-gray-900 text-gray-100 border border-gray-700">
          {/* Header */}
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <DialogTitle className="flex flex-wrap items-center gap-2">
              <Image src="/logo.png" alt="Logo" width={40} height={40} />
              <p className="font-medium text-gray-300">Question:</p>
              <p className="font-semibold text-white break-words">{question}</p>
              <Button
                disabled={saveAnswer.isPending}
                variant="outline"
                className="ml-auto border-gray-600 text-gray-200 hover:bg-gray-800"
                onClick={() => {
                  saveAnswer.mutate(
                    {
                      projectId: project?.id!,
                      question,
                      answer,
                      filesReferences,
                    },
                    {
                      onSuccess: () => {
                        toast.success("Answer saved");
                      },
                      onError: () => {
                        toast.error("Failed to save answer");
                      },
                    }
                  );
                }}
              >
                Save Answer
              </Button>
            </DialogTitle>
          </div>

          {/* Answer Section */}
          <div className="w-full">
            <div className="rounded-lg border border-gray-700 bg-gray-800/50 p-4">
              <MDEditor.Markdown
                source={answer}
                className=" max-w-[75vw] prose prose-invert dark"
              />
            </div>
          </div>

          {/* Code References */}
          <div className="mt-6 w-full">
            <h2 className="text-lg font-semibold mb-2 text-gray-200">
              Files Referenced
            </h2>
            <div className="rounded-lg border border-gray-700 bg-gray-800/50 p-4">
              <CodeReferences filesReferences={filesReferences} />
            </div>
          </div>

          {/* Footer */}
          <div className="mt-6 flex justify-end">
            <Button
              className="bg-gray-700 text-white hover:bg-gray-600"
              onClick={() => setOpen(false)}
            >
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Question Card */}
      <Card className="relative col-span-3 flex flex-col justify-between border border-gray-700 dark:bg-gray-900 rounded-xl shadow-sm p-6 min-h-[260px]">
 <CardHeader className="p-0 mb-4 flex justify-center">
  <CardTitle className="text-gray-100 text-lg font-semibold text-center flex items-center gap-2">
    <Sparkle className="w-5 h-5 animate-pulse" />
    Ask a Question
  </CardTitle>
</CardHeader>



  <CardContent className="p-0 flex flex-col justify-between flex-1">
    <form onSubmit={onSubmit1} className="flex flex-col gap-4 h-full">
    <Textarea
  placeholder="Which file should I edit to change the home page?"
  value={question}
  onChange={(e) => setQuestion(e.target.value)}
  className="bg-gray-800 border-gray-700 text-gray-200 placeholder-gray-500 focus-visible:ring-gray-600 
             w-full min-h-[120px] sm:min-h-[140px] md:min-h-[160px] lg:min-h-[180px] xl:min-h-[200px] 
             resize-none rounded-xl p-4 text-base"
/>

     <div className="flex justify-center">
  <Button
    type="submit"
    disabled={loading}
    className="bg-gray-700 text-white hover:bg-gray-600"
  >
    Ask Gitsage
  </Button>
</div>

    </form>
  </CardContent>
</Card>

    </>
  );
};

export default AskQuestionCard;
