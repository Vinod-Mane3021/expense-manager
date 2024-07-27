import { Loader2 } from "lucide-react";
import { AccountFormValues } from "@/types/account";
import { useOpenAccount } from "../hooks/use-open-account";
import { useGetAccount } from "../api/use-get-transaction";
import { useEditAccount } from "../api/use-edit-transaction";
import AccountForm from "./account-form";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useDeleteAccounts } from "../api/use-delete-transactions";
import { useConfirm } from "@/hooks/use-confirm";
import { deleteAccountDialogProps } from "@/constants/props";

const EditAccountSheet = () => {
  const { isOpen, onClose, id } = useOpenAccount();

  const accountQuery = useGetAccount(id);
  const editAccountMutation = useEditAccount(id);
  const deleteAccountMutation = useDeleteAccounts();

  const isQueryLoading = accountQuery.isLoading;
  const isPending = editAccountMutation.isPending || deleteAccountMutation.isPending;

  const [ConfirmationDialog, confirm] = useConfirm(deleteAccountDialogProps);

  const onSubmit = (values: AccountFormValues) => {
    editAccountMutation.mutate(values, {
      onSuccess: () => {
        onClose();
      },
    });
  };

  const handleDeleteAccount = async () => {
    const isConfirm = await confirm();

    if (isConfirm) {
      deleteAccountMutation.mutate(
        { ids: [Number(id)] },
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
            <SheetTitle>Edit Account</SheetTitle>
            <SheetDescription>Edit an existing account</SheetDescription>
          </SheetHeader>

          {isQueryLoading ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader2 className="size-5 text-muted-foreground animate-spin" />
            </div>
          ) : (
            <AccountForm
              id={id}
              onSubmit={onSubmit}
              disabled={isPending}
              defaultValues={{ name: accountQuery.data?.name || "" }}
              onDelete={handleDeleteAccount}
            />
          )}
        </SheetContent>
      </Sheet>
    </>
  );
};

export default EditAccountSheet;
