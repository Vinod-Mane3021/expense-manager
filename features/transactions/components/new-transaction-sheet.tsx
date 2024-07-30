import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { TransactionFormValues } from "@/types/transaction";
import { useNewTransaction } from "@/features/transactions/hooks/use-new-transaction";
import { useCreateCategory } from "@/features/categories/api/use-create-category";
import { useGetCategories } from "@/features/categories/api/use-get-categories";
import { useCreateAccount } from "@/features/accounts/api/use-create-account";
import { useGetAccounts } from "@/features/accounts/api/use-get-accounts";
import { useCreateTransaction } from "../api/use-create-transaction";
import TransactionForm from "./transaction-form";
import { Loader2 } from "lucide-react";

const NewTransactionSheet = () => {
  const { isOpen, onClose } = useNewTransaction();
  const createTransactionMutation = useCreateTransaction();

  const categoriesQuery = useGetCategories();
  const accountsQuery = useGetAccounts();

  const categoryMutation = useCreateCategory();
  const accountMutation = useCreateAccount();

  const categoryOptions = (categoriesQuery.data ?? []).map((category) => ({
    label: category.name,
    value: category.id,
  }));
  const accountOptions = (accountsQuery.data ?? []).map((account) => ({
    label: account.name,
    value: account.id,
  }));

  const onCreateCategory = (name: string) => {
    categoryMutation.mutate({
      name,
    });
  };
  const onCreateAccount = (name: string) => {
    accountMutation.mutate({
      name,
    });
  };

  const isPending =
    createTransactionMutation.isPending ||
    categoryMutation.isPending ||
    accountMutation.isPending;
  const isLoading = categoriesQuery.isLoading || accountsQuery.isLoading;

  const onSubmit = (values: TransactionFormValues) => {
    createTransactionMutation.mutate(values, {
      onSuccess: () => {
        onClose();
      },
    });
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="space-y-4">
        <SheetHeader>
          <SheetTitle>New Transaction</SheetTitle>
          <SheetDescription>Add a new transaction.</SheetDescription>
        </SheetHeader>

        {isLoading ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <Loader2 className="size-4 text-muted-foreground animate-spin" />
          </div>
        ) : (
          <TransactionForm
            onSubmit={onSubmit}
            disabled={isPending}
            categoryOptions={categoryOptions}
            accountOptions={accountOptions}
            onCreateCategory={onCreateCategory}
            onCreateAccount={onCreateAccount}
          />
        )}
      </SheetContent>
    </Sheet>
  );
};

export default NewTransactionSheet;
