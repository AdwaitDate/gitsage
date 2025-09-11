import z from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

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
    })
});