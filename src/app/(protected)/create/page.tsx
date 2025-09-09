"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "@/trpc/react";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

type FormInput = {
  repoUrl: string;
  projectName: string;
  githubToken?: string;
};

const CreatePage = () => {
  const { register, handleSubmit, reset } = useForm<FormInput>();
  const createProject = api.project.createProject.useMutation({

  })

  function onSubmit(data: FormInput) {
    // window.alert(JSON.stringify(data));
    createProject.mutate({
      githubUrl: data.repoUrl,
      name:data.projectName,
      githubToken: data.githubToken
    },{
      onSuccess:()=>{
        toast.success("Project Created Successfully")
        reset()
      },
      onError:()=>{
        toast.error("Failed to create project")
      }
    })
    return true;
  }
  return (
    <div className="flex h-full items-center justify-center gap-12">
      <img src="/Stock Trader Illustration.png" className="h-56 w-auto" />
      <div>
        <div>
          <h1 className="text-2xl font-semibold">
            Link your Github Repository
          </h1>
          <p className="text-muted-foreground text-sm">
            Enter the URL of your Repository to link it to Gitsage
          </p>
          <div className="h-4"></div>
          <div>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Input
                {...register("projectName", { required: true })}
                placeholder="ProjectName"
                required
              />
              <div className="h-2"></div>
              <Input
                {...register("repoUrl", { required: true })}
                placeholder="Github URL"
                type="url"
                required
              />
              <div className="h-2"></div>
              <Input
                {...register("githubToken")}
                placeholder="Github Token (Optional)"
                
              />
              <div className="h-4"></div>
              <Button type="submit">Create Project</Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePage;
