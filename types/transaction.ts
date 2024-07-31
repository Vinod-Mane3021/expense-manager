import { z } from "zod";
import {
  bulkCreateTransactionSchema,
  createTransactionFormSchema,
  createTransactionSchema,
  transactionApiSchema,
  transactionsNameSchema,
} from "@/validations/schema/transactions";
import { InferResponseType } from "hono";
import { client } from "@/lib/hono";
import { HttpStatusCode } from "@/constants/http-status-code";

export type TransactionFormValues = z.input<typeof createTransactionFormSchema>;

export type TransactionApiFormValues = z.input<typeof createTransactionSchema>;

export type BulkCreateTransactionData = z.input<typeof bulkCreateTransactionSchema>;

export type TransactionResponseType = InferResponseType<
  typeof client.api.transactions.$get,
  HttpStatusCode.OK
>["data"][0];

export type LabelValueType = {
  label: string;
  value: string;
};

export type TransactionFormProps = {
  id?: string;
  defaultValues?: TransactionFormValues;
  onSubmit: (value: TransactionApiFormValues) => void;
  onDelete?: () => void;
  disabled?: boolean;
  categoryOptions: LabelValueType[];
  accountOptions: LabelValueType[];
  onCreateCategory: (name: string) => void;
  onCreateAccount: (name: string) => void;
};
