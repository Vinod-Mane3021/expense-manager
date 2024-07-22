"use client";

import { Loader2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DataTable } from "@/components/data-table";
import { Skeleton } from "@/components/ui/skeleton";
import { useNewAccount } from "@/features/accounts/hooks/use-new-account";
import { useDeleteAccounts } from "@/features/accounts/api/use-delete-accounts";
import { useGetAccounts } from "@/features/accounts/api/use-get-accounts";
import { AccountResponseType } from "@/types/account";
import { columns } from "./columns";

const AccountsPage = () => {
  const newAccount = useNewAccount();
  const deleteAccounts = useDeleteAccounts();
  const accountQuery = useGetAccounts();
  const accounts: AccountResponseType[] = accountQuery.data || [];

  const isDisabled = accountQuery.isLoading || deleteAccounts.isPending;

  if (accountQuery.isLoading) {
    return (
      <div className="max-w-screen-2xl mx-auto w-full pb-10 -mt-24">
        <Card className="border-none drop-shadow-sm">
          <CardHeader>
            <Skeleton className="h-8 w-48" />
          </CardHeader>
          <CardContent>
            <div className="h-[500px] w-full flex items-center justify-center">
              <Loader2 className="size-6 text-slate-300 animate-spin" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-screen-2xl mx-auto w-full pb-10 -mt-24">
      <Card className="border-none drop-shadow-sm">
        <CardHeader className="gap-y-2 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle className="text-xl line-clamp-1">Accounts page</CardTitle>
          <Button onClick={newAccount.onOpen} size="sm">
            {" "}
            <Plus className="size-4 mr-2" /> Add New
          </Button>
        </CardHeader>
        <CardContent>
          <DataTable
            onDelete={(rows) => {
              const ids = rows.map((r) => r.original.id);
              deleteAccounts.mutate({ ids });
            }}
            filterKey="name"
            columns={columns}
            data={accounts}
            disabled={isDisabled}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default AccountsPage;
