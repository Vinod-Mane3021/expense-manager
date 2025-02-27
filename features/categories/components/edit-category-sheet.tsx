import { Loader2 } from "lucide-react";
import { CategoryFormValues } from "@/types/category";
import { useOpenCategory } from "../hooks/use-open-category";
import { useGetCategory } from "../api/use-get-category";
import { useEditCategory } from "../api/use-edit-category";
import CategoryForm from "./category-form";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useConfirm } from "@/hooks/use-confirm";
import { deleteCategoryDialogProps } from "@/constants/props";
import { useBulkDeleteCategories } from "../api/use-bulk-delete-categories";
import { showToast } from "@/lib/toast";

const EditCategorySheet = () => {
  const { isOpen, onClose, id } = useOpenCategory();

  const categoryQuery = useGetCategory(id);
  const editCategoryMutation = useEditCategory(id);
  const deleteCategoriesMutation = useBulkDeleteCategories();

  const isLoading = categoryQuery.isLoading;
  const isPending = editCategoryMutation.isPending || deleteCategoriesMutation.isPending;

  const [ConfirmationDialog, confirm] = useConfirm(deleteCategoryDialogProps);

  const onSubmit = (values: CategoryFormValues) => {

    const isEdited = categoryQuery.data?.name !== values.name;
    if (!isEdited) {
      showToast.error("You have not changed the name.");
      return;
    }
    editCategoryMutation.mutate(values, {
      onSuccess: () => {
        onClose();
      },
    });
  };

  const handleDeleteCategory = async () => {
    const isConfirm = await confirm();

    if (isConfirm) {
      deleteCategoriesMutation.mutate(
        { ids: [id!] },
        {
          onSuccess: () => {
            onClose();
          },
        }
      );
    }
  };

  return (
    <>
      <ConfirmationDialog />
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent className="space-y-4">
          <SheetHeader>
            <SheetTitle>Edit Category</SheetTitle>
            <SheetDescription>Edit an existing category</SheetDescription>
          </SheetHeader>

          {isLoading ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader2 className="size-5 text-muted-foreground animate-spin" />
            </div>
          ) : (
            <CategoryForm
              id={id}
              onSubmit={onSubmit}
              disabled={isPending}
              defaultValues={{ name: categoryQuery.data?.name || "" }}
              onDelete={handleDeleteCategory}
            />
          )}
        </SheetContent>
      </Sheet>
    </>
  );
};

export default EditCategorySheet;
