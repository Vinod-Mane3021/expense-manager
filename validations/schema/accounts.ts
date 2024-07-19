import z from 'zod'

export const createAccountSchema = z.object({
    name: z.string(),
})