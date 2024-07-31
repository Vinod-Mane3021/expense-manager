import { subDays, parse } from "date-fns";
import { HttpStatusCode } from "@/constants/http-status-code";
import { db } from "@/lib/db";
import { clerkMiddleware } from "@hono/clerk-auth";
import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import {
  bulkCreateTransactionSchema,
  createTransactionSchema,
  deleteTransactionSchema,
  getTransactionsSchema,
  transactionIdSchema,
} from "@/validations/schema/transactions";
import { authorizeUserMiddleware } from "@/middlewares/auth";
import {
  convertAmountFromMiliunit,
  convertAmountToMiliunit,
} from "@/lib/converters";

const app = new Hono()

  // .use(zodErrorHandlerMiddleware)

  // To get all transactions
  .get(
    "/",
    zValidator("query", getTransactionsSchema),
    clerkMiddleware(),
    authorizeUserMiddleware,
    async (c) => {
      const { from, to, accountId } = c.req.valid("query");

      const defaultTo = new Date();
      const defaultFrom = subDays(defaultTo, 30);

      const startDate = from
        ? parse(from, "yyyy-MM-dd", new Date())
        : defaultFrom;
      const endDate = to ? parse(to, "yyyy-MM-dd", new Date()) : defaultTo;

      // const startDate = from
      //   ? parse(from, "yyyy-MM-dd", new Date())
      //   : undefined;
      // const endDate = to ? parse(to, "yyyy-MM-dd", new Date()) : undefined;

      try {
        // const takePageSize = Number(pageSize);
        // const skipPages = (Number(page) - 1) * takePageSize;

        const transactions = await db.transactions.findMany({
          // skip: skipPages, // Skip the items of previous pages
          // take: takePageSize, // Take the number of items for the current page
          where: {
            accountId: accountId ? accountId : undefined,
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

        const data = transactions.map((item) => ({
          ...item,
          amount: convertAmountFromMiliunit(item.amount),
        }));

        if (!data) {
          return c.json(
            { error: "Transactions not found" },
            HttpStatusCode.NOT_FOUND
          );
        }
        return c.json({ data });
      } catch (error) {
        console.error("Error ", error);
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
        const transaction = await db.transactions.findUnique({
          where: {
            id,
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

        const data = {
          ...transaction,
          amount:
            transaction?.amount &&
            convertAmountFromMiliunit(transaction.amount),
        };

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
            amount: convertAmountToMiliunit(values.amount),
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

      const formattedValues = values.map((val) => ({
        ...val,
        amount: convertAmountToMiliunit(val.amount),
      }));

      try {
        const data = await db.transactions.createManyAndReturn({
          data: formattedValues,
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

      console.log("/bulk-delete ", ids);

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

        console.log("count ", count);

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
    zValidator("json", createTransactionSchema),
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
            id,
            account: {
              userId: c.auth.userId,
            },
          },
          data: {
            ...values,
            date: values.date ? new Date(values.date) : undefined,
            amount: convertAmountToMiliunit(values.amount),
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
