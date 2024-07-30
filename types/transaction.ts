import { z } from "zod";
import {
  createTransactionSchema,
  transactionApiSchema,
  transactionsNameSchema,
} from "@/validations/schema/transactions";
import { InferResponseType } from "hono";
import { client } from "@/lib/hono";
import { HttpStatusCode } from "@/constants/http-status-code";

export type TransactionFormValues = z.input<typeof createTransactionSchema>;

export type TransactionApiFormValues = z.input<typeof transactionApiSchema>;

export type TransactionResponseType = InferResponseType<
  typeof client.api.transactions.$get,
  HttpStatusCode.OK
>["data"][0];

export type LabelValueType = {
    label: string;
    value: string | number;
}

export type TransactionFormProps = {
    id?: number;
    defaultValues?: TransactionFormValues;
    onSubmit: (value: TransactionApiFormValues) => void;
    onDelete?: () => void;
    disabled?: boolean;
    categoryOptions: LabelValueType[];
    accountOptions: LabelValueType[];
    onCreateCategory: (name: string) => void;
    onCreateAccount: (name: string) => void;
  };