import { createTRPCRouter } from "./trpc";
import {houseRouter} from "./routers/house";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here
 */
export const appRouter = createTRPCRouter({
  house: houseRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;
