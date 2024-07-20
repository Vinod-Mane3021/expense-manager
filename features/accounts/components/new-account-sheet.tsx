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
import { toast } from "sonner";
import { useCreateAccount } from "../api/use-create-account";

const NewAccountSheet = () => {
  const { isOpen, onOpen, onClose } = useNewAccount();

  const { data, error, isPending, mutate, status } = useCreateAccount();

  const onSubmit = (values: AccountFormValues) => {
    console.log("onSubmit");
    console.log(values);
    mutate(values,
    //    {
    //   onSuccess: () => {
    //     onClose();
    //   },
    // }
  );
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
        {isPending && <p>Loading...</p>}
        <p>{error?.message}</p>
        <p>status -- {status}</p>
      </SheetContent>
    </Sheet>
  );
};

export default NewAccountSheet;
