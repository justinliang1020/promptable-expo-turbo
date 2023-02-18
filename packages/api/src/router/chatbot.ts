// import { z } from "zod";

// import { createTRPCRouter, publicProcedure } from "../trpc";

// export const chatbotRouter = createTRPCRouter({
//   create: publicProcedure
//     .input(z.object({ name: z.string().min(1) }))
//     .mutation(({ ctx, input }) => {
//       return ctx.prisma.chatbot.create({
//         data: {
//           name: input.name,
//         },
//       });
//     }),
// });
