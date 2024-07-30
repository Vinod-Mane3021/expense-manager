"use client";

import { Edit, MoreHorizontal, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useConfirm } from "@/hooks/use-confirm";
import { deleteCategoryDialogProps } from "@/constants/props";
import { useOpenCategory } from "@/features/categories/hooks/use-open-category";
import { useBulkDeleteCategories } from "@/features/categories/api/use-bulk-delete-categories";


type ActionsProps = {
  id: string;
};

const Actions = ({ id }: ActionsProps) => {
  const { onOpen } = useOpenCategory();
  const deleteCategoriesMutation = useBulkDeleteCategories();

  const [ ConfirmationDialog, confirm ] = useConfirm(deleteCategoryDialogProps);

  const isPending = deleteCategoriesMutation.isPending

  const handleOpenDrawer = () => {
    onOpen(id)
  }

  const handleDeleteCategory = async () => {
    const isConfirm = await confirm()
    if(isConfirm) {
      deleteCategoriesMutation.mutate({ids: [id]})
    }
  }

  return (
    <>
      <ConfirmationDialog/>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="size-8 p-0">
            <MoreHorizontal className="size-4" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent>
          <DropdownMenuItem disabled={isPending} onClick={handleOpenDrawer}>
            <Edit className="size-4 mr-2" />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem disabled={isPending} onClick={handleDeleteCategory}>
            <Trash className="size-4 mr-2" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export default Actions;
