import { z } from "zod";

export const getTransactionsSchema = z.object({
  from: z.string().optional(),
  to: z.string().optional(),
  accountId: z.string().optional(),
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
  amount: z.number().gt(0, { message: "amount mush be more than 0" }),
  payee: z.string(),
  notes: z.string().optional(),
  date: z
    .string()
    .refine((val) => new Date(val), { message: "Invalid date format" }),
  accountId: z.number(),
  categoryId: z.number(),
});

export const updateTransactionSchema = z.object({
  amount: z.number().optional(),
  payee: z.string().optional(),
  notes: z.string().optional(),
  date: z.string().optional(),
  accountId: z.number().optional(),
  categoryId: z.number().optional(),
});
