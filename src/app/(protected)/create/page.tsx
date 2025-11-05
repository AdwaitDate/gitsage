"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import useRefetch from "@/hooks/use-refetch";
import { api } from "@/trpc/react";
import { useRouter } from 'next/navigation';

import React, { use } from "react";
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
  const refetch = useRefetch()
 const router = useRouter()
  function onSubmit(data: FormInput) {
    // window.alert(JSON.stringify(data));
    createProject.mutate({
      githubUrl: data.repoUrl,
      name:data.projectName,
      githubToken: data.githubToken
    },{
      onSuccess:()=>{
        toast.success("Project Created Successfully")
        router.push(`/dashboard`)
        refetch()
        reset()
      },
      onError:()=>{
        toast.error("Failed to create project")
      },
      // onLoadingChange:(isLoading)=>{
      //   if(isLoading){
      //     toast.loading("Creating Project...")
      //   }else{
      //     toast.dismiss()
      //   }
        
      // } 
    })
    return true;
  }
  return (
    <div className="flex h-full items-center justify-center gap-12">
      <img src="/undraw_github.svg" className='h-56 w-auto' />
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
              <Button type="submit" className="text-dark" disabled={createProject.isPending}>
                Create Project
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePage;