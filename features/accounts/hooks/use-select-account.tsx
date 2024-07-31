import { useRef, useState } from "react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useGetAccounts } from "../api/use-get-accounts";
import { useCreateAccount } from "../api/use-create-account";
import Select from "@/components/select";

export type UseConfirmTypes = {
  title?: string;
  message: string;
  confirmButtonLabel?: string;
  type?: "default" | "alert";
};

type UseConfirmReturnType = [() => JSX.Element, () => Promise<unknown>];

type PromiseType = { resolve: (value: string | undefined) => void } | null;

export const useSelectAccount = (): UseConfirmReturnType => {
  const accountQuery = useGetAccounts();
  const createAccountMutation = useCreateAccount();

  const onCreateAccount = (name: string) => {
    createAccountMutation.mutate({ name });
  };

  const accountOptions = (accountQuery.data ?? []).map((account) => ({
    label: account.name,
    value: account.id,
  }));

  const [promise, setPromise] = useState<PromiseType>(null);
  const selectedValue = useRef<string>();

  const confirm = () => {
    return new Promise((resolve, reject) => {
      setPromise({ resolve });
    });
  };

  const handleClose = () => {
    setPromise(null);
  };

  const handleConfirm = () => {
    promise?.resolve(selectedValue.current);
    handleClose();
  };

  const handleCancel = () => {
    promise?.resolve(undefined);
    handleClose();
  };

  const ConfirmationDialog = () => {
    return (
      <AlertDialog open={promise !== null}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Select Account</AlertDialogTitle>
            <AlertDialogDescription>
              Please select an account to continue.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <Select
            placeholder="Select an account"
            options={accountOptions}
            onCreate={onCreateAccount}
            onChange={(value) => (selectedValue.current = value)}
            disabled={accountQuery.isLoading || createAccountMutation.isPending}
          />
          <AlertDialogFooter>
            <Button className="" onClick={handleCancel} variant="outline">
              Cancel
            </Button>
            <Button onClick={handleConfirm}>Confirm</Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  };

  return [ConfirmationDialog, confirm];
};
