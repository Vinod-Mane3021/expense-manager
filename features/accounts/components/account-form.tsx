import React from "react";
import { z } from "zod";
import { Trash } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { createAccountSchema } from "@/validations/schema/accounts";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { AccountFormProps, AccountFormValues } from "@/types/account";

const AccountForm = ({
    id,
    defaultValues,
    onSubmit,
    onDelete,
    disabled,
}: AccountFormProps) => {
    const form = useForm<AccountFormValues>({
        resolver: zodResolver(createAccountSchema),
        defaultValues: defaultValues,
    });

    const handleSubmit = (values: AccountFormValues) => {
        onSubmit(values)
    };

    const handleDelete = () => {
        console.log("handleDelete : ");
        onDelete?.();
    };

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(handleSubmit)}
                className="space-y-4 pt-4"
            >
                <FormField
                    name="name"
                    control={form.control}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                                <Input
                                    disabled={disabled}
                                    placeholder="e.g. Cash, Bank, Credit Card"
                                    {...field}
                                />
                            </FormControl>
                        </FormItem>
                    )}
                />
                <Button type="submit" className="w-full" disabled={disabled}>
                    {id ? "Save Changes " : "Create Account"}
                </Button>
                {!!id && (
                    <Button
                        type="button"
                        disabled={disabled}
                        onClick={handleDelete}
                        className="w-full"
                        variant="outline"
                    >
                        <Trash style={{ marginRight: 5 }} className="size-4" />
                        Delete account
                    </Button>
                )}
            </form>
        </Form>
    );
};

export default AccountForm;
