import { subDays, parse } from "date-fns";
import { HttpStatusCode } from "@/constants/http-status-code";
import { db } from "@/lib/db";
import { clerkMiddleware, getAuth } from "@hono/clerk-auth";
import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import {
  bulkCreateTransactionSchema,
  createTransactionSchema,
  deleteTransactionSchema,
  getTransactionsSchema,
  transactionIdSchema,
  updateTransactionSchema,
} from "@/validations/schema/transactions";
import { authorizeUserMiddleware } from "@/middlewares/auth";
import { ResponseMessage } from "@/constants/response-messages";
import { zodErrorHandlerMiddleware } from "@/middlewares/zod-error-handler";

const app = new Hono()

  // .use(zodErrorHandlerMiddleware)

  // To get all transactions
  .get(
    "/",
    zValidator("query", getTransactionsSchema),
    clerkMiddleware(),
    authorizeUserMiddleware,
    async (c) => {
      console.log("Validation failed. Please check your input data.");

      const { from, to, accountId, page, pageSize } = c.req.valid("query");

      const defaultTo = new Date();
      const defaultFrom = subDays(defaultTo, 30);

      // const startDate = from
      //   ? parse(from, "yyyy-MM-dd", new Date())
      //   : defaultFrom;
      // const endDate = to ? parse(to, "yyyy-MM-dd", new Date()) : defaultTo;

      const startDate = from
        ? parse(from, "yyyy-MM-dd", new Date())
        : undefined;
      const endDate = to ? parse(to, "yyyy-MM-dd", new Date()) : undefined;

      try {
        const takePageSize = Number(pageSize);
        const skipPages = (Number(page) - 1) * takePageSize;

        const data = await db.transactions.findMany({
          skip: skipPages, // Skip the items of previous pages
          take: takePageSize, // Take the number of items for the current page
          where: {
            accountId: accountId ? Number(accountId) : undefined,
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

        if (!data) {
          return c.json(
            { error: "Transactions not found" },
            HttpStatusCode.NOT_FOUND
          );
        }
        return c.json({ data });
      } catch (error) {
        console.error("Error ", error)
        return c.json(
          { error: "Failed to get transactions" },
          HttpStatusCode.INTERNAL_SERVER_ERROR
        );
      }
    }
  )

  // to get transaction by id
  .get(
    "/:id",
    clerkMiddleware(),
    authorizeUserMiddleware,
    zValidator("param", transactionIdSchema),
    async (c) => {
      const { id } = c.req.valid("param");
      if (!id) {
        return c.json(
          { error: "Missing account id" },
          HttpStatusCode.BAD_REQUEST
        );
      }

      try {
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
      } catch (error) {
        return c.json(
          { error: "Failed to get transaction" },
          HttpStatusCode.INTERNAL_SERVER_ERROR
        );
      }
    }
  )

  // to create a new transaction
  .post(
    "/create",
    clerkMiddleware(),
    authorizeUserMiddleware,
    zValidator("json", createTransactionSchema),
    async (c) => {
      const values = c.req.valid("json");

      try {
        const data = await db.transactions.create({
          data: {
            ...values,
            date: new Date(values.date),
          },
        });

        return c.json({ data });
      } catch (error) {
        return c.json(
          { error: "Failed to create transaction" },
          HttpStatusCode.INTERNAL_SERVER_ERROR
        );
      }
    }
  )

  // to create a new transactions in bulk
  .post(
    "/bulk-create",
    clerkMiddleware(),
    authorizeUserMiddleware,
    zValidator("json", bulkCreateTransactionSchema),
    async (c) => {
      const values = c.req.valid("json");
      if (!values) {
        return c.json(
          { error: "Provided invalid inputs" },
          HttpStatusCode.BAD_REQUEST
        );
      }

      try {
        const data = await db.transactions.createManyAndReturn({
          data: { ...values },
        });
        return c.json({ data });
      } catch (error) {
        return c.json(
          { error: "Failed to create transactions" },
          HttpStatusCode.INTERNAL_SERVER_ERROR
        );
      }
    }
  )

  // to delete an existing transactions
  .post(
    "/bulk-delete",
    clerkMiddleware(),
    authorizeUserMiddleware,
    zValidator("json", deleteTransactionSchema),
    async (c) => {
      const { ids } = c.req.valid("json");

      try {
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
      } catch (error) {
        return c.json(
          { error: "Failed to delete transactions" },
          HttpStatusCode.INTERNAL_SERVER_ERROR
        );
      }
    }
  )

  // to update the transaction
  .patch(
    "/:id",
    clerkMiddleware(),
    authorizeUserMiddleware,
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

      try {
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
      } catch (error) {
        return c.json(
          { error: "Failed to update transaction" },
          HttpStatusCode.INTERNAL_SERVER_ERROR
        );
      }
    }
  );

export default app;
