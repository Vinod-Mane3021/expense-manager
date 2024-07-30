import { z } from "zod";

export const categoryNameSchema = z.object({
  name: z.string().min(1, { message: "Category name is required" }),
});

export const deleteCategorySchema = z.object({
  ids: z.array(z.string()),
});

export const categoryIdSchema = z.object({
  id: z.string().optional(),
});
