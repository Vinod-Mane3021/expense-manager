import { UseConfirmTypes } from "@/hooks/use-confirm";

export const deleteAccountDialogProps: UseConfirmTypes = {
  title: "Are you absolutely sure?",
  message: "This action cannot be undone. This will permanently delete your account from our servers.",
  confirmButtonLabel: "Yes, delete account",
  type: "alert",
};

export const deleteCategoryDialogProps: UseConfirmTypes = {
  title: "Are you absolutely sure?",
  message: "This action cannot be undone. This will permanently delete your category from our servers.",
  confirmButtonLabel: "Yes, delete category",
  type: "alert",
};

export const deleteTransactionDialogProps: UseConfirmTypes = {
  title: "Are you absolutely sure?",
  message: "This action cannot be undone. This will permanently delete your transaction from our servers.",
  confirmButtonLabel: "Yes, delete transaction",
  type: "alert",
};

export const deleteDefaultDialogProps: UseConfirmTypes = {
  title: "Are you absolutely sure?",
  message: "This action cannot be undone. This will permanently from our servers.",
  confirmButtonLabel: "Yes, delete",
  type: "alert",
};