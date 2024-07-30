import { z } from "zod";

export const accountNameSchema = z.object({
  name: z.string().min(1, { message: "Account name is required" }),
});

export const deleteAccountSchema = z.object({
  ids: z.array(z.string()),
});

export const accountIdSchema = z.object({
  id: z.string().optional(),
});
