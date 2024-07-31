"use client";

import { useState } from "react";
import { showToast } from "@/lib/toast";
import { Loader2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { columns } from "./columns";
import { DataTable } from "@/components/data-table";
import { useNewTransaction } from "@/features/transactions/hooks/use-new-transaction";
import { useBulkCreateTransactions } from "@/features/transactions/api/use-bulk-create-transactions";
import { useGetTransactions } from "@/features/transactions/api/use-get-transactions";
import { useBulkDeleteTransactions } from "@/features/transactions/api/use-bulk-delete-transactions";
import { useSelectAccount } from "@/features/accounts/hooks/use-select-account";
import {
  BulkCreateTransactionData,
  TransactionResponseType,
} from "@/types/transaction";
import UploadButton from "./upload-button";
import ImportCard from "./import-card";
import { INITIAL_IMPORT_RESULTS, VARIANTS } from "./util";
import { BULK_CREATE_TRANSACTION_DATA_LIMIT } from "@/constants";

const TransactionsPage = () => {
  const [AccountDialog, confirm] = useSelectAccount();
  const [variant, setVariant] = useState(VARIANTS.LIST);
  const [importResults, setImportResults] = useState(INITIAL_IMPORT_RESULTS);

  const newTransaction = useNewTransaction();
  const bulkCreateMutation = useBulkCreateTransactions();
  const deleteTransactions = useBulkDeleteTransactions();
  const transactionsQuery = useGetTransactions();
  const transactions: TransactionResponseType[] = transactionsQuery.data || [];

  const isDisabled =
    transactionsQuery.isLoading || deleteTransactions.isPending;

  const onUpload = (results: typeof INITIAL_IMPORT_RESULTS) => {
    if(results.data.length > BULK_CREATE_TRANSACTION_DATA_LIMIT) {
      return showToast.error("Can't import transactions more than " + BULK_CREATE_TRANSACTION_DATA_LIMIT);
    }
    setImportResults(results);
    setVariant(VARIANTS.IMPORT);
  };

  const onCancelImport = () => {
    setImportResults(INITIAL_IMPORT_RESULTS);
    setVariant(VARIANTS.LIST);
  };

  const onSubmitImport = async (values: BulkCreateTransactionData) => {
    if (values.length === 0) {
      return showToast.error("Please provide data to import");
    }

    const accountId = await confirm();
    if (!accountId) {
      return showToast.error("Please select an account to continue");
    }

    const data = values.map((value) => ({
      ...value,
      accountId: accountId as string,
    }));

    bulkCreateMutation.mutate(data, {
      onSuccess: () => {
        onCancelImport();
      },
    });
  };

  if (transactionsQuery.isLoading) {
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

  if (variant === VARIANTS.IMPORT) {
    return (
      <>
        <AccountDialog />
        <ImportCard
          data={importResults.data}
          onCancel={onCancelImport}
          onSubmit={onSubmitImport}
        />
      </>
    );
  }

  return (
    <div className="max-w-screen-2xl mx-auto w-full pb-10 -mt-24">
      <Card className="border-none drop-shadow-sm">
        <CardHeader className="gap-y-2 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle className="text-xl line-clamp-1">
            Transactions History
          </CardTitle>
          <div className="flex flex-col sm:flex-row gap-2">
            <Button
              className="w-full lg:w-auto"
              onClick={newTransaction.onOpen}
              size="sm"
            >
              <Plus className="size-4 mr-2" /> Add New
            </Button>
            <UploadButton onUpload={onUpload} />
          </div>
        </CardHeader>
        <CardContent>
          <DataTable
            dataTableType="transaction"
            filterKey="payee"
            onDelete={(rows) => {
              const ids = rows.map((r) => r.original.id);
              deleteTransactions.mutate({ ids });
            }}
            columns={columns}
            data={transactions}
            disabled={isDisabled}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default TransactionsPage;
