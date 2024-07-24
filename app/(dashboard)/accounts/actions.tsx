"use client";

import { Edit, MoreHorizontal, Trash } from "lucide-react";
import { useOpenAccount } from "@/features/accounts/hooks/use-open-account";
import { useDeleteAccounts } from "@/features/accounts/api/use-delete-accounts";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useConfirm } from "@/hooks/use-confirm";
import { deleteAccountDialogProps } from "@/constants/props";

type ActionsProps = {
  id: string;
};

const Actions = ({ id }: ActionsProps) => {
  const { onOpen } = useOpenAccount();
  const deleteAccountMutation = useDeleteAccounts();

  const [ ConfirmationDialog, confirm ] = useConfirm(deleteAccountDialogProps);

  const isPending = deleteAccountMutation.isPending

  const handleOpenDrawer = () => {
    onOpen(id)
  }

  const handleDeleteAccount = async () => {
    const isConfirm = await confirm()
    if(isConfirm) {
      deleteAccountMutation.mutate({ids: [Number(id)]})
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
