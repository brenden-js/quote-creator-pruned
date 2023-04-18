import {createTRPCRouter, publicProcedure} from "../trpc";
import {z} from "zod";
import {inngest} from "~/pages/api/inngest";
import type {House} from "@prisma/client";
import {ConfigType, ServiceType, RegionCode} from "@prisma/client";


export const houseRouter = createTRPCRouter({
  getQuote: publicProcedure
    .input(z.string())
    .query(({ctx, input}) => {
      return ctx.prisma.house.findUnique({where: {id: input}});
    }),
  createQuote: publicProcedure
    .input(z.object({
      stAddress: z.string(),
      zipCode: z.string(),
      city: z.string(),
      serviceType: z.nativeEnum(ServiceType),
      configType: z.nativeEnum(ConfigType),
      sqft: z.string().min(3),
      region: z.nativeEnum(RegionCode),
      name: z.string(),
      email: z.string(),
      phone: z.string(),
      requestedTimes: z.array(z.string())
    }))
    .mutation(async ({ctx, input}) => {
      const response: House = await ctx.prisma.house.create({
        data: {
          stAddress: input.stAddress,
          city: input.city,
          sqft: parseInt(input.sqft),
          zipCode: parseInt(input.zipCode),
          state: 'CA',
          houseStatus: 'QUOTE',
          region: input.region,
          customer: {
            connectOrCreate: {
              where: {
                email: input.email
              },
              create: {
                email: input.email,
                name: input.name
              }
            }
          },
          requestedTimes: input.requestedTimes.join(','),
          serviceType: input.serviceType,
          configType: input.configType
        }
      });

      // send to inngest API as a new quote created event
      // handle things such as notifying admin of new deal etc.

      await inngest.send({
        name: "quote/guest.created",
        data: {
          email: input.email,
          houseId: response.id,
          stAddress: response.stAddress
        },
      });

      return response
    }),
})

