import { subDays, parse } from "date-fns";
import { HttpStatusCode } from "@/constants/http-status-code";
import { db } from "@/lib/db";
import { clerkMiddleware, getAuth } from "@hono/clerk-auth";
import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import {
  createTransactionSchema,
  deleteTransactionSchema,
  getTransactionsSchema,
  transactionIdSchema,
  updateTransactionSchema,
} from "@/validations/schema/transactions";
import { authMiddleware } from "@/middlewares/auth";
import { ResponseMessage } from "@/constants/response-messages";

const app = new Hono()

  // To get all transactions
  .get(
    "/",
    zValidator("query", getTransactionsSchema),
    clerkMiddleware(),
    authMiddleware,
    async (c) => {
      const { from, to, accountId } = c.req.valid("query");

      const defaultTo = new Date();
      const defaultFrom = subDays(defaultTo, 30);

      const startDate = from
        ? parse(from, "yyyy-MM-dd", new Date())
        : defaultFrom;
      const endDate = to ? parse(to, "yyyy-MM-dd", new Date()) : defaultTo;

      const data = await db.transactions.findMany({
        where: {
          accountId: Number(accountId),
          account: {
            userId: c.auth.userId,
          },
          date: {
            gte: startDate,
            lte: endDate,
          },
        },
        orderBy: {
          date: "desc",
        },
        select: {
          id: true,
          date: true,
          payee: true,
          amount: true,
          notes: true,
          accountId: true,
          categoryId: true,
          account: {
            select: {
              name: true,
            },
          },
          category: {
            select: {
              name: true,
            },
          },
        },
      });

      return c.json({ data });
    }
  )

  // to get transaction by id
  .get(
    "/:id",
    clerkMiddleware(),
    authMiddleware,
    zValidator("param", transactionIdSchema),
    async (c) => {
      const { id } = c.req.valid("param");
      if (!id) {
        return c.json(
          { error: "Missing account id" },
          HttpStatusCode.BAD_REQUEST
        );
      }

      const data = await db.transactions.findUnique({
        where: {
          id: Number(id),
          account: {
            userId: c.auth.userId,
          },
        },
        select: {
          id: true,
          date: true,
          payee: true,
          amount: true,
          notes: true,
          categoryId: true,
          accountId: true,
        },
      });

      if (!data) {
        return c.json({ error: "Not found" }, HttpStatusCode.NOT_FOUND);
      }

      return c.json({ data });
    }
  )

  // to create a new transaction
  .post(
    "/create",
    clerkMiddleware(),
    authMiddleware,
    zValidator("json", createTransactionSchema),
    async (c) => {

      const values = c.req.valid("json");

      const data = await db.transactions.create({
        data: { ...values, date: new Date() },
      });

      if (!data) {
        return c.json(
          { error: "Failed to create transaction" },
          HttpStatusCode.INTERNAL_SERVER_ERROR
        );
      }

      return c.json({ data });
    }
  )

  // to delete an existing transactions
  .post(
    "/bulk-delete",
    clerkMiddleware(),
    authMiddleware,
    zValidator("json", deleteTransactionSchema),
    async (c) => {
      const { ids } = c.req.valid("json");

      const { count } = await db.transactions.deleteMany({
        where: {
          account: {
            userId: c.auth.userId,
          },
          id: {
            in: ids,
          },
        },
      });

      return c.json({ count });
    }
  )

  // to update the transaction
  .patch(
    "/:id",
    clerkMiddleware(),
    authMiddleware,
    zValidator("param", transactionIdSchema),
    zValidator("json", updateTransactionSchema),
    async (c) => {
      const { id } = c.req.valid("param");
      if (!id) {
        return c.json(
          { error: "Missing transaction id" },
          HttpStatusCode.BAD_REQUEST
        );
      }

      const values = c.req.valid("json");

      const data = await db.transactions.update({
        where: {
          id: Number(id),
          account: {
            userId: c.auth.userId,
          },
        },
        data: {
          ...values,
          date: values.date ? new Date(values.date) : undefined,
        },
        select: {
          id: true,
        },
      });

      if (!data) {
        return c.json({ error: "Not Found" }, HttpStatusCode.NOT_FOUND);
      }

      return c.json({ data });
    }
  );

export default app;
