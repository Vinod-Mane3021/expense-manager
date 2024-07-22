import { z } from "zod";

export const createAccountSchema = z.object({
  name: z.string(),
});

export const deleteAccountSchema = z.object({
  ids: z.array(z.number()),
});

export const getAccountSchema = z.object({
  id: z.string().optional(),
});
