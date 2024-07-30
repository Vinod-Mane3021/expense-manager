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
import { deleteTransactionDialogProps } from "@/constants/props";
import { useBulkDeleteTransactions } from "@/features/transactions/api/use-bulk-delete-transactions";
import { useOpenTransaction } from "@/features/transactions/hooks/use-open-transaction";

type ActionsProps = {
  id: string;
};

const Actions = ({ id }: ActionsProps) => {
  const { onOpen } = useOpenTransaction();
  const deleteTransactionsMutation = useBulkDeleteTransactions();

  const [ConfirmationDialog, confirm] = useConfirm(deleteTransactionDialogProps);

  const isPending = deleteTransactionsMutation.isPending;

  const handleOpenDrawer = () => {
    onOpen(id);
  };

  const handleDeleteAccount = async () => {
    const isConfirm = await confirm();
    console.log("isConfirm ", isConfirm, id);
    if (isConfirm) {
      const ids: string[] = [id];
      deleteTransactionsMutation.mutate({ ids });
    }
  };

  return (
    <>
      <ConfirmationDialog />
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
          <DropdownMenuItem disabled={isPending} onClick={handleDeleteAccount}>
            <Trash className="size-4 mr-2" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export default Actions;
