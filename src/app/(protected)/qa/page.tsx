'use client'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

import useProject from '@/hooks/use-project'
import { api } from '@/trpc/react'
import MDEditor from "@uiw/react-md-editor"
import React from 'react'
import CodeReferences from "../dashboard/code-references"
import Image from "next/image"
import { formatDistanceToNow } from "date-fns"
import { Loader2 } from "lucide-react"
import AskQuestionCard from "../dashboard/ask-question"

const QuestionList = () => {
  const { projectId } = useProject()
  const { data: questions, isLoading } = api.project.getQuestions.useQuery({ projectId })
  const [questionIdx, setQuestionIdx] = React.useState(0)
  const question = questions?.[questionIdx]

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-4">
        <Loader2 className="animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <Sheet>
      <AskQuestionCard />
      <div className="h-4"></div>
      <h1 className="text-xl font-semibold text-gray-800 dark:text-gray-100">Saved Questions</h1>
      <div className="h-2"></div>
      <div className="grid gap-2 grid-cols-1 sm:grid-cols-1">
        {questions?.map((question, idx) => (
          <React.Fragment key={question.id}>
            <SheetTrigger onClick={() => setQuestionIdx(idx)}>
              <div className="flex items-center gap-4 bg-white dark:bg-gray-900 rounded-lg p-4 shadow border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                <Image
                  src={question.user.imageUrl ?? ''}
                  alt="Avatar"
                  width={30}
                  height={30}
                  className="rounded-full"
                />

                <div className="text-left flex flex-col">
                  <div className="flex items-center gap-2">
                    <p className="text-gray-700 dark:text-gray-200 line-clamp-1 text-lg font-medium">
                      
                      {question.question}
                    </p>
                    <span className="text-xs text-gray-400 dark:text-gray-500 whitespace-nowrap">
                      {formatDistanceToNow(question.createdAt, { addSuffix: true })}
                    </span>
                  </div>
                  <p className="text-gray-500 dark:text-gray-400 text-sm line-clamp-1">
                    {question.answer}
                  </p>
                </div>
              </div>
            </SheetTrigger>
          </React.Fragment>
        ))}
      </div>

      {question && (
        <SheetContent className="sm:max-w-[80vw] bg-background text-foreground dark:bg-gray-950 dark:text-gray-100">
          <SheetHeader>
            <SheetTitle className="text-gray-800 dark:text-gray-100 flex items-center">
              <p className="mr-2">Question:</p>
              {question.question}</SheetTitle>
            <MDEditor.Markdown
              
              source={question.answer}
              className="flex-1 w-full !h-full max-h-[50vh] overflow-scroll custom-ref prose prose-invert dark:prose-invert"
            />
            <CodeReferences filesReferences={(question.filesReferences ?? []) as any} />
          </SheetHeader>
        </SheetContent>
      )}
    </Sheet>
  )
}

export default QuestionList
