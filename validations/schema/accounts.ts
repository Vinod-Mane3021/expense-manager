import { z } from 'zod'

export const createAccountSchema = z.object({
    name: z.string(),
})

export const deleteAccountSchema = z.object({
    ids: z.array(z.number())
})