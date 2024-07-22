import { AccountFormValues } from "@/types/account";
import { useOpenAccount } from "../hooks/use-open-account";
import { useCreateAccount } from "../api/use-create-account";
import { useGetAccount } from "../api/use-get-account";
import AccountForm from "./account-form";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Loader2 } from "lucide-react";

const EditAccountSheet = () => {
  const { isOpen, onClose, id } = useOpenAccount();

  const accountQuery = useGetAccount(id);
  const mutation = useCreateAccount();

  const onSubmit = (values: AccountFormValues) => {
    console.log("onSubmit");
    console.log(values);
    mutation.mutate(values, {
      onSuccess: () => {
        onClose();
      },
    });
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="space-y-4">
        <SheetHeader>
          <SheetTitle>Edit Account</SheetTitle>
          <SheetDescription>
            Edit an existing account
          </SheetDescription>
        </SheetHeader>

        {accountQuery.isLoading ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <Loader2 className="size-5 text-muted-foreground animate-spin" />
          </div>
        ) : (
          <AccountForm
            id={id}
            onSubmit={onSubmit}
            disabled={mutation.isPending}
            defaultValues={{ name: accountQuery.data?.name || "" }}
          />
        )}
      </SheetContent>
    </Sheet>
  );
};

export default EditAccountSheet;
