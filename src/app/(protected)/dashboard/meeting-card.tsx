"use client";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import axios from "axios";
import { PlusIcon, Presentation, Upload } from "lucide-react";
import React from "react";
import { useDropzone } from "react-dropzone";
// import { project } from "@prisma/client";
import { uploadFile } from "@/lib/firebase";
import { api } from "@/trpc/react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import useProject from "@/hooks/use-project";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useMutation } from "@tanstack/react-query";
import useRefetch from "@/hooks/use-refetch";
import { string } from "zod";

const MeetingCard = () => {
  // const processMeeting = useMutation({mutationFn: async () => {meetingUrl: string, projectId: string, meetingId: string}})}
  const { project } = useProject();
  const [progress, setProgress] = React.useState(0);
  const uploadMeeting = api.project.uploadMeeting.useMutation();

  const processMeeting = useMutation({
      mutationFn: async (data: { meetingUrl: string, projectId: string, meetingId: string }) => {
          const response = await axios.post("/api/process-meeting", data);
          return response.data;
      }
  })
  const refetch = useRefetch();
  const [isUploading, setIsUploading] = React.useState(false);
  const router = useRouter();
  const { getRootProps, getInputProps } = useDropzone({
    // only accept audio files
    accept: {
      "audio/*":
        ".mp3,.m4a,.wav,.flac,.ogg,.aac,.opus,.wma,.webm,.amr,.3gp,.mp2,.m2a,.m4b,.m4p,.mpc,.mpga,.oga,.spx,.wv,.mka,.m3u,.m3u8,.m4u".split(
          ",",
        ),
    },
    multiple: false,
    onDragEnter: () => {
      console.log("drag enter");
    },
    onDragOver: () => {
      console.log("drag over");
    },
    onDragLeave: () => {
      console.log("drag leave");
    },
    // 50mb
    maxSize: 50000000,
    onDrop: async (acceptedFiles) => {
      if (!project) return;
      setIsUploading(true);
      setIsUploading(true);
      console.log(acceptedFiles);
      const file = acceptedFiles[0];
      if (!file) return;
      const downloadUrl = await uploadFile(file as File, setProgress) as string;
    //   window.alert(downloadUrl);
      setIsUploading(false);
      uploadMeeting.mutate({
        projectId: project?.id!,
        meetingUrl: downloadUrl,
        name: file.name,
      },{
        onSuccess:(meeting)=>{
            toast.success("Meeting uploaded successfully");
            router.push('/meetings')
            processMeeting.mutateAsync({meetingUrl: downloadUrl, projectId: project?.id!, meetingId: meeting.id})
            // refetch();
        },
        onError:()=>{
            toast.error("Failed to upload meeting");
        }
      });
    },
  });

  return (
    <>
      <Card
        {...getRootProps()}
        className="col-span-2 flex flex-col items-center justify-center rounded-lg border bg-white p-10 text-gray-900 dark:bg-gray-900 dark:text-gray-100"
      >
        {!isUploading && (
          <>
            <Presentation className="h-10 w-10 animate-bounce text-gray-700 dark:text-gray-200" />
            <h3 className="mt-2 text-sm font-semibold text-gray-900 dark:text-gray-100">
              Add a Training
            </h3>
            <p className="mt-1 text-center text-sm text-gray-500 dark:text-gray-400">
              Analyse your Training with GitSage.
              <br />
              Powered by AI.
            </p>
            <div className="mt-6">
              <Button
                isLoading={isUploading}
                className="bg-gray-800 text-white hover:bg-gray-700 dark:bg-gray-200 dark:text-gray-900 dark:hover:bg-gray-300"
              >
                <Upload className="mr-1.5 -ml-0.5 h-5 w-5" aria-hidden="true" />
                Upload Training Video or Audio
                <input className="hidden" {...getInputProps()} />
              </Button>
            </div>
          </>
        )}
        {isUploading && (
          <div>
            <CircularProgressbar
              value={progress}
              text={`${Math.round(progress)}%`}
              className="size-20"
              styles={buildStyles({
                pathColor: "#9ca3af", // neutral gray
                textColor: "#9ca3af",
                trailColor: "#374151",
                backgroundColor: "#111827",
              })}
            />
            <p className="mt-3 text-center text-xs text-gray-500 dark:text-gray-400">
              Uploading and processing meeting...
              <br />
              This may take a few minutes...
            </p>
          </div>
        )}
      </Card>
    </>
  );
};

export default MeetingCard;
