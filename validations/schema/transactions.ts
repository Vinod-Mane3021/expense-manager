import { z } from "zod";

export const getTransactionsSchema = z.object({
  from: z.string().optional(),
  to: z.string().optional(),
  accountId: z.string().optional(),
  page: z.string(),
  pageSize: z.string(),
});

export const transactionIdSchema = z.object({
  id: z.string().optional(),
});

export const transactionsNameSchema = z.object({
  name: z.string().min(1, { message: "Transactions name is required" }),
});

export const deleteTransactionSchema = z.object({
  ids: z.array(z.number()),
});

export const createTransactionSchema = z.object({
  amount: z.string(),
  payee: z.string(),
  notes: z.string().nullable().optional(),
  date: z.coerce.date(),
  accountId: z.number(),
  categoryId: z.number().nullable().optional(),
});

export const updateTransactionSchema = z.object({
  amount: z.string().optional(),
  payee: z.string().optional(),
  notes: z.string().optional(),
  date: z.string().optional(),
  accountId: z.number().optional(),
  categoryId: z.number().optional(),
});

export const transactionApiSchema = createTransactionSchema;

export const bulkCreateTransactionSchema = z.array(createTransactionSchema)