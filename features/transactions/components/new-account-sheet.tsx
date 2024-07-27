import { useNewAccount } from "../hooks/use-new-account";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import AccountForm from "./account-form";
import { AccountFormValues } from "@/types/account";
import { useCreateAccount } from "@/features/accounts/api/use-create-account";

const NewAccountSheet = () => {
  const { isOpen, onOpen, onClose } = useNewAccount();

  const { data, error, isPending, mutate, status } = useCreateAccount();

  const onSubmit = (values: AccountFormValues) => {
    console.log("onSubmit");
    console.log(values);
    mutate(values, {
      onSuccess: () => {
        onClose();
      },
    });
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="space-y-4">
        <SheetHeader>
          <SheetTitle>New Account</SheetTitle>
          <SheetDescription>
            Create a new account to track your transactions.
          </SheetDescription>
        </SheetHeader>

        <AccountForm
          onSubmit={onSubmit}
          disabled={isPending}
          defaultValues={{ name: "" }}
        />
      </SheetContent>
    </Sheet>
  );
};

export default NewAccountSheet;
