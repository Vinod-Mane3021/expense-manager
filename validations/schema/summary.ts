import { z } from "zod";

export const getSummarySchema = z.object({
    from: z.string().optional(),
    to: z.string().optional(),
    accountId: z.string().optional(),
})