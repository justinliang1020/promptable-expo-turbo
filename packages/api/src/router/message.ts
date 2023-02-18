import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "../trpc";

export const messageRouter = createTRPCRouter({
  all: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.message.findMany({ orderBy: { id: "desc" } });
  }),
  byId: publicProcedure.input(z.string()).query(({ ctx, input }) => {
    return ctx.prisma.message.findFirst({ where: { id: input } });
  }),
  create: publicProcedure
    .input(z.object({ content: z.string().min(1), fromUser: z.boolean() }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.message.create({ data: input });
    }),
  delete: publicProcedure.input(z.string()).mutation(({ ctx, input }) => {
    return ctx.prisma.message.delete({ where: { id: input } });
  }),
});
