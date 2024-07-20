import { createAccountSchema } from "@/validations/schema/accounts";
import { z } from "zod";

export type AccountFormValues = z.input<typeof createAccountSchema>;

export type AccountFormProps = {
    id?: string;
    defaultValues?: AccountFormValues;
    onSubmit: (value: AccountFormValues) => void;
    onDelete?: () => void;
    disabled?: boolean;
};