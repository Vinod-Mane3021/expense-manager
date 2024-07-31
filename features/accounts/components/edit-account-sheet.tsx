import { Loader2 } from "lucide-react";
import { AccountFormValues } from "@/types/account";
import { useOpenAccount } from "../hooks/use-open-account";
import { useGetAccount } from "../api/use-get-account";
import { useEditAccount } from "../api/use-edit-account";
import AccountForm from "./account-form";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useConfirm } from "@/hooks/use-confirm";
import { deleteAccountDialogProps } from "@/constants/props";
import { useBulkDeleteAccounts } from "../api/use-bulk-delete-accounts";
import { showToast } from "@/lib/toast";

const EditAccountSheet = () => {
  const { isOpen, onClose, id } = useOpenAccount();

  const accountQuery = useGetAccount(id);
  const editAccountMutation = useEditAccount(id);
  const deleteAccountMutation = useBulkDeleteAccounts();

  const isQueryLoading = accountQuery.isLoading;
  const isPending = editAccountMutation.isPending || deleteAccountMutation.isPending;

  const [ConfirmationDialog, confirm] = useConfirm(deleteAccountDialogProps);

  const onSubmit = (values: AccountFormValues) => {

    const isEdited = accountQuery.data?.name !== values.name;
    if (!isEdited) {
      showToast.info("You have not changed the name.");
      onClose();
      return;
    }

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
