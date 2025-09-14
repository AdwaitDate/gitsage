"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import useRefetch from "@/hooks/use-refetch";
import { api } from "@/trpc/react";
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

  function onSubmit(data: FormInput) {
    // window.alert(JSON.stringify(data));
    createProject.mutate({
      githubUrl: data.repoUrl,
      name:data.projectName,
      githubToken: data.githubToken
    },{
      onSuccess:()=>{
        toast.success("Project Created Successfully")
        refetch()
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
      <img src="/chatgptcreate.png" className="h-90 w-auto" />
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

  // "use client";
  // import { Button } from "@/components/ui/button";
  // import { Input } from "@/components/ui/input";
  // import { Label } from "@/components/ui/label";
  // import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
  // import useRefetch from "@/hooks/use-refetch";
  // import { api } from "@/trpc/react";
  // import React from "react";
  // import { useForm } from "react-hook-form";
  // import { toast } from "sonner";
  // import { Github, Loader2, Plus, Sparkles } from "lucide-react";
  
  // type FormInput = {
  //   repoUrl: string;
  //   projectName: string;
  //   githubToken?: string;
  // };
  
  // const CreateProject = () => {
  //   const { register, handleSubmit, reset } = useForm<FormInput>();
  //   const createProject = api.project.createProject.useMutation({});
  //   const refetch = useRefetch();
  
  //   function onSubmit(data: FormInput) {
  //     createProject.mutate({
  //       githubUrl: data.repoUrl,
  //       name: data.projectName,
  //       githubToken: data.githubToken
  //     }, {
  //       onSuccess: () => {
  //         toast.success("Project Created Successfully");
  //         refetch();
  //         reset();
  //       },
  //       onError: () => {
  //         toast.error("Failed to create project");
  //       }
  //     });
  //     return true;
  //   }
  
  //   return (
  //     <div className="min-h-full flex items-center justify-center p-6">
  //       <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-12 items-center">
  //         {/* Left side - Illustration */}
  //         <div className="hidden lg:flex justify-center">
  //           <div className="relative">
  //             <img 
  //               src="/chatgptcreate.png" 
  //               alt="Create Project Illustration"
  //               className="w-full max-w-lg h-auto rounded-[1.25rem] shadow-2xl"
  //             />
  //             <div className="absolute -top-4 -right-4 w-8 h-8 bg-primary rounded-full flex items-center justify-center shadow-lg">
  //               <Sparkles className="w-4 h-4 text-primary-foreground" />
  //             </div>
  //           </div>
  //         </div>
  
  //         {/* Right side - Form */}
  //         <div className="w-full">
  //           <Card className="border-0 shadow-2xl bg-card/50 backdrop-blur-sm">
  //             <CardHeader className="space-y-4 pb-8">
  //               <div className="flex items-center gap-3">
  //                 <div className="w-12 h-12 bg-primary/10 rounded-[1.25rem] flex items-center justify-center">
  //                   <Github className="w-6 h-6 text-primary" />
  //                 </div>
  //                 <div>
  //                   <CardTitle className="text-2xl text-foreground">Link Your GitHub Repository</CardTitle>
  //                   <CardDescription className="text-muted-foreground mt-1">
  //                     Connect your repository to GitSage and unlock AI-powered code insights
  //                   </CardDescription>
  //                 </div>
  //               </div>
  //             </CardHeader>
  
  //             <CardContent className="space-y-6">
  //               <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
  //                 {/* Project Name Field */}
  //                 <div className="space-y-2">
  //                   <Label htmlFor="projectName" className="text-sm font-medium text-foreground">
  //                     Project Name
  //                   </Label>
  //                   <Input
  //                     id="projectName"
  //                     {...register("projectName", { required: true })}
  //                     placeholder="Enter your project name"
  //                     required
  //                     className="h-12 rounded-[1.25rem] border-border/50 bg-input-background/50 backdrop-blur-sm transition-all duration-200 focus:bg-background focus:border-primary/50 focus:ring-2 focus:ring-primary/20"
  //                   />
  //                 </div>
  
  //                 {/* Repository URL Field */}
  //                 <div className="space-y-2">
  //                   <Label htmlFor="repoUrl" className="text-sm font-medium text-foreground">
  //                     GitHub Repository URL
  //                   </Label>
  //                   <Input
  //                     id="repoUrl"
  //                     {...register("repoUrl", { required: true })}
  //                     placeholder="https://github.com/username/repository"
  //                     type="url"
  //                     required
  //                     className="h-12 rounded-[1.25rem] border-border/50 bg-input-background/50 backdrop-blur-sm transition-all duration-200 focus:bg-background focus:border-primary/50 focus:ring-2 focus:ring-primary/20"
  //                   />
  //                 </div>
  
  //                 {/* GitHub Token Field */}
  //                 <div className="space-y-2">
  //                   <Label htmlFor="githubToken" className="text-sm font-medium text-foreground">
  //                     GitHub Personal Access Token
  //                     <span className="text-muted-foreground font-normal ml-1">(Optional)</span>
  //                   </Label>
  //                   <Input
  //                     id="githubToken"
  //                     {...register("githubToken")}
  //                     placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
  //                     type="password"
  //                     className="h-12 rounded-[1.25rem] border-border/50 bg-input-background/50 backdrop-blur-sm transition-all duration-200 focus:bg-background focus:border-primary/50 focus:ring-2 focus:ring-primary/20"
  //                   />
  //                   <p className="text-xs text-muted-foreground">
  //                     Required for private repositories. Enables deeper code analysis.
  //                   </p>
  //                 </div>
  
  //                 {/* Submit Button */}
  //                 <Button 
  //                   type="submit" 
  //                   disabled={createProject.isPending}
  //                   className="w-full h-12 rounded-[1.25rem] bg-primary hover:bg-primary/90 text-primary-foreground font-medium transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
  //                 >
  //                   {createProject.isPending ? (
  //                     <>
  //                       <Loader2 className="w-4 h-4 mr-2 animate-spin" />
  //                       Creating Project...
  //                     </>
  //                   ) : (
  //                     <>
  //                       <Plus className="w-4 h-4 mr-2" />
  //                       Create Project
  //                     </>
  //                   )}
  //                 </Button>
  //               </form>
  
  //               {/* Help Text */}
  //               <div className="pt-4 border-t border-border/50">
  //                 <div className="flex items-start gap-3 p-4 bg-muted/30 rounded-[1.25rem]">
  //                   <div className="w-5 h-5 bg-accent/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
  //                     <div className="w-2 h-2 bg-accent rounded-full"></div>
  //                   </div>
  //                   <div className="text-sm text-muted-foreground">
  //                     <p className="font-medium text-foreground mb-1">What happens next?</p>
  //                     <p>GitSage will analyze your repository structure, understand your codebase, and prepare AI-powered insights to help you navigate and understand your project better.</p>
  //                   </div>
  //                 </div>
  //               </div>
  //             </CardContent>
  //           </Card>
  //         </div>
  //       </div>
  //     </div>
  //   );
  // };
  
  // export default CreateProject;