import { DoorClosed, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useConfirm } from "@/hooks/use-confirm";
import { TransactionApiFormValues } from "@/types/transaction";
import { deleteAccountDialogProps, deleteTransactionDialogProps } from "@/constants/props";
import { useOpenTransaction } from "@/features/transactions/hooks/use-open-transaction";
import { useGetTransaction } from "@/features/transactions/api/use-get-transaction";
import { useEditTransaction } from "@/features/transactions/api/use-edit-transaction";
import { useBulkDeleteTransactions } from "@/features/transactions/api/use-bulk-delete-transactions";
import { useGetCategories } from "@/features/categories/api/use-get-categories";
import { useGetAccounts } from "@/features/accounts/api/use-get-accounts";
import { useCreateCategory } from "@/features/categories/api/use-create-category";
import { useCreateAccount } from "@/features/accounts/api/use-create-account";
import TransactionForm from "./transaction-form";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { showToast } from "@/lib/toast";

const EditTransactionSheet = () => {
  const { isOpen, onClose, id} = useOpenTransaction();

  const transactionQuery = useGetTransaction(id);
  const editTransactionMutation = useEditTransaction(id);
  const deleteTransactionMutation = useBulkDeleteTransactions();

  const categoriesQuery = useGetCategories();
  const accountsQuery = useGetAccounts();

  const createCategoryMutation = useCreateCategory();
  const createAccountMutation = useCreateAccount();

  const categoryOptions = (categoriesQuery.data ?? []).map((category) => ({
    label: category.name,
    value: category.id,
  }));
  const accountOptions = (accountsQuery.data ?? []).map((account) => ({
    label: account.name,
    value: account.id,
  }));

  const isPending =
    editTransactionMutation.isPending ||
    deleteTransactionMutation.isPending ||
    transactionQuery.isLoading ||
    createCategoryMutation.isPending ||
    createAccountMutation.isPending;

  const isLoading =
    transactionQuery.isLoading ||
    categoriesQuery.isLoading ||
    accountsQuery.isLoading;

  const [ConfirmationDialog, confirm] = useConfirm(deleteTransactionDialogProps);

  const onCreateCategory = (name: string) => {
    createCategoryMutation.mutate({
      name,
    });
  };
  const onCreateAccount = (name: string) => {
    createAccountMutation.mutate({
      name,
    });
  };

  const onSubmit = (value: TransactionApiFormValues) => {
    const originalTransaction = transactionQuery.data;
    if (!originalTransaction) return;

    const isEdited =
      value.amount !== originalTransaction.amount ||
      value.payee !== originalTransaction.payee ||
      value.date.toISOString() !== new Date(originalTransaction.date!).toISOString() ||
      value.accountId !== originalTransaction.accountId ||
      value.notes !== originalTransaction.notes ||
      value.categoryId !== originalTransaction.categoryId;

    if (!isEdited) {
      showToast.info("You have not changed any value")
      onClose();
      return;
    }

    editTransactionMutation.mutate(value, {
      onSuccess: () => {
        onClose();
      },
    });
  };

  const handleDeleteTransaction = async () => {
    const isConfirm = await confirm();

    if (isConfirm) {
      deleteTransactionMutation.mutate(
        { ids: [id!] },
        {
          onSuccess: () => {
            onClose();
          },
        }
      );
    }
  };

  const defaultValues = {
    categoryId: transactionQuery.data?.categoryId,
    accountId: transactionQuery.data?.accountId ?? "",
    amount: String(transactionQuery.data?.amount) ?? "",
    date: transactionQuery.data?.date ? new Date(transactionQuery.data.date) : new Date(),
    payee: transactionQuery.data?.payee ?? "",
    notes: transactionQuery.data?.notes,
  }

  return (
    <>
      <ConfirmationDialog />
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent className="space-y-4">
          <SheetHeader>
            <SheetTitle>Edit Transaction</SheetTitle>
            <SheetDescription>Edit an existing transaction</SheetDescription>
          </SheetHeader>

          {isLoading ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader2 className="size-5 text-muted-foreground animate-spin" />
            </div>
          ) : (
            <TransactionForm
              id={id}
              onSubmit={onSubmit}
              disabled={isPending}
              defaultValues={defaultValues}
              onDelete={handleDeleteTransaction}
              accountOptions={accountOptions}
              categoryOptions={categoryOptions}
              onCreateAccount={onCreateAccount}
              onCreateCategory={onCreateCategory}
            />
          )}
        </SheetContent>
      </Sheet>
    </>
  );
};

export default EditTransactionSheet;
