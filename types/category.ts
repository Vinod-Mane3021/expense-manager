import { z } from "zod";
import { InferResponseType } from "hono";
import { client } from "@/lib/hono";
import { HttpStatusCode } from "@/constants/http-status-code";
import { categoryNameSchema } from "@/validations/schema/categories";

export type CategoryFormValues = z.input<typeof categoryNameSchema>;

export type CategoryFormProps = {
  id?: string;
  defaultValues?: CategoryFormValues;
  onSubmit: (value: CategoryFormValues) => void;
  onDelete?: () => void;
  disabled?: boolean;
};

export type CategoryResponseType = InferResponseType<
  typeof client.api.categories.$get,
  HttpStatusCode.OK
>["data"][0];
