import { HttpStatusCode } from "@/constants/http-status-code";
import { ResponseMessage } from "@/constants/response-messages";
import { db } from "@/lib/db";
import { clerkMiddleware, getAuth } from "@hono/clerk-auth";
import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import {
  accountNameSchema,
  deleteAccountSchema,
  accountIdSchema,
} from "@/validations/schema/accounts";

const app = new Hono()

  // To get all accounts
  .get("/", clerkMiddleware(), async (c) => {
    const auth = getAuth(c);
    if (!auth?.userId) {
      return c.json(
        { error: ResponseMessage.UNAUTHORIZED_TO_ACCESS_RESOURCE },
        HttpStatusCode.UNAUTHORIZED
      );
    }

    const data = await db.accounts.findMany({
      select: {
        id: true,
        name: true,
      },
    });

    return c.json({ data });
  })

  // to get account by id
  .get(
    "/:id",
    clerkMiddleware(),
    zValidator("param", accountIdSchema),
    async (c) => {
      const auth = getAuth(c);
      if (!auth?.userId) {
        return c.json(
          { error: ResponseMessage.UNAUTHORIZED_TO_ACCESS_RESOURCE },
          HttpStatusCode.UNAUTHORIZED
        );
      }

      const { id } = c.req.valid("param");
      if (!id) {
        return c.json({ error: "Missing account id" }, HttpStatusCode.BAD_REQUEST);
      }

      const data = await db.accounts.findUnique({
        where: {
          userId: auth.userId,
          id: Number(id),
        },
        select: {
          id: true,
          name: true,
        },
      });

      if (!data) {
        return c.json({ error: "Not found" }, HttpStatusCode.NOT_FOUND);
      }

      return c.json({ data });
    }
  )

  // to create a new account
  .post(
    "/create",
    clerkMiddleware(),
    zValidator("json", accountNameSchema),
    async (c) => {
      const auth = getAuth(c);
      if (!auth?.userId) {
        console.log("un : ", ResponseMessage.UNAUTHORIZED_TO_ACCESS_RESOURCE);
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
  )

  // to delete an existing account
  .post(
    "/bulk-delete",
    clerkMiddleware(),
    zValidator("json", deleteAccountSchema),
    async (c) => {
      const auth = getAuth(c);
      if (!auth?.userId) {
        return c.json(
          { error: ResponseMessage.UNAUTHORIZED_TO_ACCESS_RESOURCE },
          HttpStatusCode.UNAUTHORIZED
        );
      }

      const { ids } = c.req.valid("json");

      const userId = auth.userId;

      const { count } = await db.accounts.deleteMany({
        where: {
          userId: userId,
          id: {
            in: ids,
          },
        },
      });

      return c.json({ count });
    }
  )

  // to update the account name
  .patch(
    "/:id",
    clerkMiddleware(),
    zValidator("param", accountIdSchema),
    zValidator("json", accountNameSchema),
    async (c) => {
      const auth = getAuth(c);
      if (!auth?.userId) {
        return c.json(
          { error: ResponseMessage.UNAUTHORIZED_TO_ACCESS_RESOURCE },
          HttpStatusCode.UNAUTHORIZED
        );
      }

      const { id } = c.req.valid("param");
      if (!id) {
        return c.json({ error: "Missing account id" }, HttpStatusCode.BAD_REQUEST);
      }

      const { name } = c.req.valid("json");
      if (!name) {
        return c.json({ error: "Missing account name" }, HttpStatusCode.BAD_REQUEST);
      }

      console.log("PRINT")
      console.log("id - " + id + " " + " name - ", name)
      console.log("userId ", auth.userId)

      const data = await db.accounts.update({
        where: {
          userId: auth.userId,
          id: Number(id),
        },
        data: {
          name,
        },
      });

      if (!data) {
        return c.json({ error: "Not Found" }, HttpStatusCode.NOT_FOUND);
      }

      return c.json({ data });
    }
  );

export default app;
