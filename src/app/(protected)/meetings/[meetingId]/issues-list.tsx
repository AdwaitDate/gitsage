"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { api, type RouterOutputs } from "@/trpc/react";
import { Loader2, Presentation } from "lucide-react";
import { useState } from "react";

type Props = {
  meetingId: string;
};

const IssuesList = ({ meetingId }: Props) => {
  const { data: meeting, isLoading } = api.project.getMeetingById.useQuery(
    { meetingId },
    { refetchInterval: 4000 }
  );

  if (isLoading || !meeting)
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="animate-spin text-gray-400" />
      </div>
    );

  return (
    <div className="p-6 sm:p-8">
      <div className="mx-auto max-w-5xl">
        <div className="flex items-center justify-between gap-6 border-b border-gray-700 pb-6">
          <div className="flex items-center gap-4">
            <div className="rounded-full border border-gray-700 bg-gray-800 p-3">
              <Presentation className="h-7 w-7 text-gray-200" />
            </div>
            <div>
              <div className="text-sm leading-6 text-gray-400">
                Meeting on{" "}
                <span className="text-gray-300">
                  {meeting.createdAt.toLocaleString()}
                </span>
              </div>
              <div className="mt-1 text-base font-semibold leading-6 text-gray-100">
                {meeting.name}
              </div>
            </div>
          </div>
        </div>

        <div className="h-4" />

        {/* Grid of issues — consistent gap + equal card sizing */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {meeting.issues.map((issue) => (
            <IssueCard issue={issue} key={issue.id} />
          ))}
        </div>
      </div>
    </div>
  );
};

function IssueCard({
  issue,
}: {
  issue: NonNullable<
    RouterOutputs["project"]["getMeetingById"]
  >["issues"][number];
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="bg-gray-900 border border-gray-700 text-gray-100 max-w-2xl">
          <DialogTitle className="text-lg font-semibold text-white">
            {issue.gist}
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-400">
            {issue.createdAt.toDateString()}
          </DialogDescription>

          <div className="mt-4 text-gray-300">{issue.heading}</div>

          <blockquote className="mt-4 border-l-4 border-gray-700 bg-gray-800 p-4 rounded-lg">
            <div className="text-xs text-gray-400 mb-2">
              {issue.start} - {issue.end}
            </div>
            <p className="font-medium italic leading-relaxed text-gray-100">
              {issue.summary}
            </p>
          </blockquote>

          <div className="mt-6 flex justify-end">
            <Button onClick={() => setOpen(false)} className="bg-gray-700">
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Card: consistent padding, fixed min height to align grid */}
      <Card className="relative border border-gray-800 bg-gray-900/70 text-gray-100 hover:bg-gray-900/90 transition-colors shadow-sm min-h-[180px] flex flex-col">
        <CardHeader className="p-4">
          <CardTitle className="text-lg text-white">{issue.gist}</CardTitle>
          <div className="mt-2">
            <CardDescription className="text-sm text-gray-400">
              {issue.heading}
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="p-4 pt-2 flex-1 flex flex-col justify-between">
          {/* Short preview or summary */}
          <div className="text-sm text-gray-300 line-clamp-4">{issue.summary}</div>

          {/* Footer actions aligned right for consistent layout */}
          <div className="mt-4 flex justify-end">
            <Button
              onClick={() => setOpen(true)}
              className="bg-gray-700 text-gray-100 hover:bg-gray-600"
            >
              Details
            </Button>
          </div>
        </CardContent>
      </Card>
    </>
  );
}

export default IssuesList;
