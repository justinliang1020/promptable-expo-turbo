import { z } from "zod";

import dotenv from "dotenv";
import {
  BufferedChatMemory,
  MemoryLLMChain,
  OpenAI,
  prompts,
} from "promptable";
import { createTRPCRouter, publicProcedure } from "../trpc";
dotenv.config();

const apiKey = process.env.OPENAI_API_KEY || "missing";
const openai = new OpenAI(apiKey);
const memory = new BufferedChatMemory();
const memoryChain = new MemoryLLMChain(prompts.chatbot(), openai, memory);

export const messageRouter = createTRPCRouter({
  all: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.message.findMany({ orderBy: { createdAt: "asc" } });
  }),
  byId: publicProcedure.input(z.string()).query(({ ctx, input }) => {
    return ctx.prisma.message.findFirst({ where: { id: input } });
  }),
  createUserMessage: publicProcedure
    .input(z.object({ content: z.string().min(1) }))
    .mutation(({ ctx, input }) => {
      memory.addUserMessage(input.content);
      return ctx.prisma.message.create({
        data: {
          content: input.content,
          fromUser: true,
        },
      });
    }),
  createBotMessage: publicProcedure
    .input(z.object({ content: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      const botOutput: string = await memoryChain.run({
        userInput: input.content,
      });
      memory.addBotMessage(botOutput);
      return ctx.prisma.message.create({
        data: {
          content: botOutput,
          fromUser: false,
        },
      });
    }),
  delete: publicProcedure.input(z.string()).mutation(({ ctx, input }) => {
    return ctx.prisma.message.delete({ where: { id: input } });
  }),
  deleteAll: publicProcedure.mutation(({ ctx }) => {
    return ctx.prisma.message.deleteMany({});
  }),
});
