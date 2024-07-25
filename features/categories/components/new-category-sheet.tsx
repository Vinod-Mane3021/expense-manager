import { useNewCategory } from "../hooks/use-new-category";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import CategoryForm from "./category-form";
import { CategoryFormValues } from "@/types/category";
import { useCreateCategory } from "../api/use-create-category";

const NewCategorySheet = () => {
  const { isOpen, onClose } = useNewCategory();

  const { isPending, mutate } = useCreateCategory();

  const onSubmit = (values: CategoryFormValues) => {
    console.log("onSubmit");
    console.log(values);
    mutate(values, {
      onSuccess: () => {
        onClose();
      },
    });
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="space-y-4">
        <SheetHeader>
          <SheetTitle>New Category</SheetTitle>
          <SheetDescription>
            Create a new category to organize your transactions.
          </SheetDescription>
        </SheetHeader>

        <CategoryForm
          onSubmit={onSubmit}
          disabled={isPending}
          defaultValues={{ name: "" }}
        />
      </SheetContent>
    </Sheet>
  );
};

export default NewCategorySheet;
