import React from "react";
import { z } from "zod";
import { Trash } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { categoryNameSchema } from "@/validations/schema/categories";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { CategoryFormProps, CategoryFormValues } from "@/types/category";
import { toast } from "sonner";

const CategoryForm = ({
  id,
  defaultValues,
  onSubmit,
  onDelete,
  disabled,
}: CategoryFormProps) => {
  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categoryNameSchema),
    defaultValues: defaultValues,
  });

  const handleSubmit = (values: CategoryFormValues) => {
    if (id && defaultValues?.name === values.name) {
      toast.error("You have not changed the name.");
      return;
    }
    onSubmit(values);
  };

  const handleDelete = () => {
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
                  placeholder="e.g. Food, Travel, etc."
                  {...field}
                />
              </FormControl>
              <FormMessage/>
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={disabled}>
          {id ? "Save Changes " : "Create Category"}
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
            Delete category
          </Button>
        )}
      </form>
    </Form>
  );
};

export default CategoryForm;
