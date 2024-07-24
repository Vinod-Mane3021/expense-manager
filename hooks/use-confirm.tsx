import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export type UseConfirmTypes = {
  title?: string;
  message: string;
  confirmButtonLabel?: string;
  type?: "default" | "alert"; 
};

type UseConfirmReturnType = [() => JSX.Element, () => Promise<unknown>];

type PromiseType = { resolve: (value: boolean) => void } | null;

export const useConfirm = ({
  title = "Are you absolutely sure?",
  message,
  confirmButtonLabel = "Confirm",
  type
}: UseConfirmTypes): UseConfirmReturnType => {
  const [promise, setPromise] = useState<PromiseType>(null);

  const confirm = () => {
    return new Promise((resolve, reject) => {
      setPromise({ resolve });
    });
  };

  const handleClose = () => {
    setPromise(null);
  };

  const handleConfirm = () => {
    promise?.resolve(true);
    handleClose();
  };

  const handleCancel = () => {
    promise?.resolve(false);
    handleClose();
  };

  const ConfirmationDialog = () => {
    return (
      <AlertDialog open={promise !== null}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{title}</AlertDialogTitle>
            <AlertDialogDescription>{message}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <Button className="" onClick={handleCancel} variant="outline">Cancel</Button>
            <Button onClick={handleConfirm} variant={type}>{confirmButtonLabel}</Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  };

  return [ConfirmationDialog, confirm];
};
