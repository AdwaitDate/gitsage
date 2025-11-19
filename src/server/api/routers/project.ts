import z, { string } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { pollCommits } from "@/lib/github";
import { indexGithubRepo } from "@/lib/github-loader";
import { after } from "next/server";

export const projectRouter = createTRPCRouter({
  createProject: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        githubUrl: z.string(),
        githubToken: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
        console.log("Creating project with input:", input);
        console.log("ctx.user.userId", ctx.user.userId);
        console.log("ctx.user.userId", ctx.user.userId);
const existingUser = await ctx.db.user.findMany();
console.log("Users in DB", existingUser.map(u => u.id));
      const project = await ctx.db.project.create({
        data: {
          githubUrl: input.githubUrl,
          name: input.name,
          userToProjects: {
            create: {
              userId: ctx.user.userId!,
            },
          },
        },
      });
      after(async () => {
        await indexGithubRepo(project.id, input.githubUrl, input.githubToken);
        await pollCommits(project.id);
      });
      
      return project;
    }),
    getProjects: protectedProcedure.query(async ({ ctx }) => {
      return await ctx.db.project.findMany({
        where:{
          userToProjects:{
            some:{
              userId: ctx.user.userId!
            }
          },
          deletedAt: null
        }
      })
    }),

    getCommits: protectedProcedure.input(z.object({
      projectId: z.string()

    })).query(async({ctx,input})=>{
      return await ctx.db.commit.findMany({
        where:{
          projectId: input.projectId
        },
        
      })
    }),
    saveAnswer: protectedProcedure.input(z.object({
      projectId: z.string(),
      question: z.string(),
      answer: z.string(),
      filesReferences:z.any(),
    })).mutation(async({ctx,input})=>{
      return await ctx.db.question.create({
        data:{
          answer:input.answer,
          filesReferences:input.filesReferences,
          projectId:input.projectId,
          question:input.question,
          userId:ctx.user.userId!
        }
      })
    }),

    getQuestions: protectedProcedure.input(z.object({projectId: z.string()})).query(async({ctx,input})=>{
      return await ctx.db.question.findMany({
        where:{
          projectId: input.projectId
        },
        include:{
          user: true
        },
        orderBy:{
          createdAt: "desc"
        }
      })
    }),

    archiveProject: protectedProcedure.input(z.object({projectId: z.string()})).mutation(async({ctx,input})=>{
      return await ctx.db.project.update({
        where:{
          id: input.projectId
        },
        data:{
          deletedAt: new Date()
        }
      })
    }),

    uploadMeeting: protectedProcedure.input(z.object({projectId:z.string(),meetingUrl:z.string(),name:z.string()}))
    .mutation(async({ctx,input})=>{
      const meeting = await ctx.db.meeting.create({
        data:{
          meetingUrl:input.meetingUrl,
          projectId:input.projectId,
          name:input.name,
          status:"PROCESSING",
        }
      })
      return meeting;
    }),
    getMeetings: protectedProcedure.input(z.object({ projectId: z.string() })).query(async ({ ctx, input }) => {
    return await ctx.db.meeting.findMany({
      where: { projectId: input.projectId },
      include: {
        issues: true,
        // createdBy: true,
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
  }),

    deleteMeeting: protectedProcedure.input(z.object({meetingId: z.string()})).mutation(async({ctx,input})=>{
      return await ctx.db.meeting.delete({
        where:{
          id: input.meetingId
        }
      })
    }),

    getMeetingById: protectedProcedure.input(z.object({meetingId: z.string()})).query(async({ctx,input})=>{
      return await ctx.db.meeting.findUnique({
        where:{
          id: input.meetingId
        },
        include:{
          issues: true,
          // createdBy: true,
        },
      })
    }),
    
});