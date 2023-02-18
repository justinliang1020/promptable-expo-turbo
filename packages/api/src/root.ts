import { authRouter } from "./router/auth";
import { messageRouter } from "./router/message";
import { postRouter } from "./router/post";
import { createTRPCRouter } from "./trpc";

export const appRouter = createTRPCRouter({
  post: postRouter,
  auth: authRouter,
  message: messageRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
