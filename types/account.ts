import { accountNameSchema } from "@/validations/schema/accounts";
import { z } from "zod";
import { InferResponseType } from "hono";
import { client } from "@/lib/hono";
import { HttpStatusCode } from "@/constants/http-status-code";

export type AccountFormValues = z.input<typeof accountNameSchema>;

export type AccountFormProps = {
  id?: string;
  defaultValues?: AccountFormValues;
  onSubmit: (value: AccountFormValues) => void;
  onDelete?: () => void;
  disabled?: boolean;
};

export type AccountResponseType = InferResponseType<
  typeof client.api.accounts.$get,
  HttpStatusCode.OK
>["data"][0];
