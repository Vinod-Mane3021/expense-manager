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
  ids: z.array(z.string()),
});


export const createTransactionSchema = z.object({
  amount: z.number(),
  payee: z.string(),
  notes: z.string().nullable().optional(),
  date: z.coerce.date(),
  accountId: z.string(),
  categoryId: z.string().nullable().optional(),
});

export const createTransactionFormSchema = z.object({
  amount: z.string(),
  payee: z.string(),
  notes: z.string().nullable().optional(),
  date: z.coerce.date(),
  accountId: z.string(),
  categoryId: z.string().nullable().optional(),
});

export const transactionApiSchema = createTransactionSchema;

export const bulkCreateTransactionSchema = z.array(createTransactionSchema);
