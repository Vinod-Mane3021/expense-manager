import { HttpStatusCode } from "@/constants/http-status-code";
import { ResponseMessage } from "@/constants/response-messages";
import { db } from "@/db/index";
import { clerkMiddleware, getAuth } from "@hono/clerk-auth";
import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import {
  accountNameSchema,
  deleteAccountSchema,
  accountIdSchema,
} from "@/validations/schema/accounts";
import { authorizeUserMiddleware } from "@/middlewares/auth";

const app = new Hono()

  // To get all accounts
  .get("/", clerkMiddleware(), authorizeUserMiddleware, async (c) => {

    const data = await db.accounts.findMany({
      where: {
        userId: c.auth.userId,
      },
      select: {
        id: true,
        name: true,
      },
      orderBy: {
        updateAt: "desc",
      },
    });

    return c.json({ data });
  })

  // to get account by id
  .get(
    "/:id",
    clerkMiddleware(),
    authorizeUserMiddleware,
    zValidator("param", accountIdSchema),
    async (c) => {

      const { id } = c.req.valid("param");
      if (!id) {
        return c.json(
          { error: "Missing account id" },
          HttpStatusCode.BAD_REQUEST
        );
      }

      const data = await db.accounts.findUnique({
        where: {
          userId: c.auth.userId,
          id,
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
    authorizeUserMiddleware,
    zValidator("json", accountNameSchema),
    async (c) => {
      const { name } = c.req.valid("json");
      if (!name) {
        return c.json({ error: "Missing name." }, HttpStatusCode.BAD_REQUEST);
      }

      try {
        const existingAccount = await db.accounts.findFirst({
          where: {
            name,
            userId: c.auth.userId,
          },
        });
        if (existingAccount) {
          return c.json(
            { error: "Account with this name is already exist" },
            HttpStatusCode.CONFLICT
          );
        }

        const account = await db.accounts.create({
          data: {
            name,
            userId: c.auth.userId!,
          },
        });
        return c.json({ account });
      } catch (error) {
        return c.json(
          { error: "Failed to create account." },
          HttpStatusCode.INTERNAL_SERVER_ERROR
        );
      }
    }
  )

  // to delete an existing account
  .post(
    "/bulk-delete",
    clerkMiddleware(),
    authorizeUserMiddleware,
    zValidator("json", deleteAccountSchema),
    async (c) => {

      const { ids } = c.req.valid("json");

      const { count } = await db.accounts.deleteMany({
        where: {
          userId: c.auth.userId,
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
    authorizeUserMiddleware,
    zValidator("param", accountIdSchema),
    zValidator("json", accountNameSchema),
    async (c) => {

      const { id } = c.req.valid("param");
      if (!id) {
        return c.json(
          { error: "Missing account id" },
          HttpStatusCode.BAD_REQUEST
        );
      }

      const { name } = c.req.valid("json");
      if (!name) {
        return c.json(
          { error: "Missing account name" },
          HttpStatusCode.BAD_REQUEST
        );
      }

      const data = await db.accounts.update({
        where: {
          userId: c.auth.userId,
          id,
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
