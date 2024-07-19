import HttpStatusCode from "@/constants/http-status-code";
import { ResponseMessage } from "@/constants/response-messages";
import { db } from "@/lib/db";
import { clerkMiddleware, getAuth } from "@hono/clerk-auth";
import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { createAccountSchema } from "@/validations/schema/accounts";

const app = new Hono()
  .get("/", clerkMiddleware(), async (c) => {
    const auth = getAuth(c);
    if (!auth?.userId) {
      console.log("throw new HTTPException");
      return c.json(
        { error: ResponseMessage.UNAUTHORIZED_TO_ACCESS_RESOURCE },
        HttpStatusCode.UNAUTHORIZED
      );
    }

    const data = await db.accounts.findMany({});

    return c.json({ data });
  })

  .post(
    "/create",
    clerkMiddleware(),
    zValidator("json", createAccountSchema),
    async (c) => {
      const auth = getAuth(c);
      if (!auth?.userId) {
        return c.json(
          { error: ResponseMessage.UNAUTHORIZED_TO_ACCESS_RESOURCE },
          HttpStatusCode.UNAUTHORIZED
        );
      }

      const { name } = c.req.valid("json");

      const account = await db.accounts.create({
        data: {
          name,
          userId: auth.userId,
        },
      });

      return c.json({ account });
    }
  );

export default app;
