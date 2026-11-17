import { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";
import { TRPCError } from "@trpc/server";
import { timingSafeEqual } from "node:crypto";
import { z } from "zod";
import { getSessionCookieOptions } from "./_core/cookies";
import { ENV } from "./_core/env";
import { systemRouter } from "./_core/systemRouter";
import { sdk } from "./_core/sdk";
import { publicProcedure, router } from "./_core/trpc";
import * as db from "./db";

function secretsMatch(expected: string, received: string): boolean {
  const expectedBuffer = Buffer.from(expected);
  const receivedBuffer = Buffer.from(received);
  if (expectedBuffer.length !== receivedBuffer.length) return false;
  return timingSafeEqual(expectedBuffer, receivedBuffer);
}

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    login: publicProcedure
      .input(
        z.object({
          email: z.string().trim().email(),
          password: z.string().min(1),
        }),
      )
      .mutation(async ({ input, ctx }) => {
        const email = input.email.toLowerCase();
        const isAllowed =
          Boolean(ENV.adminEmail) &&
          Boolean(ENV.adminPassword) &&
          email === ENV.adminEmail &&
          secretsMatch(ENV.adminPassword, input.password);

        if (!isAllowed) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "Adresse e-mail ou mot de passe incorrect.",
          });
        }

        const openId = `mansa-email:${email}`;
        await db.upsertUser({
          openId,
          name: "Administrateur Mansa",
          email,
          loginMethod: "email",
          role: "admin",
          lastSignedIn: new Date(),
        });

        const sessionToken = await sdk.createSessionToken(openId, {
          name: "Administrateur Mansa",
        });
        const cookieOptions = getSessionCookieOptions(ctx.req);
        ctx.res.cookie(COOKIE_NAME, sessionToken, {
          ...cookieOptions,
          maxAge: ONE_YEAR_MS,
        });

        return { success: true } as const;
      }),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),
});

export type AppRouter = typeof appRouter;
