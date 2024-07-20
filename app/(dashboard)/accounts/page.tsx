"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useNewAccount } from "@/features/accounts/hooks/use-new-account";
import { Plus } from "lucide-react";
import { columns, Payment } from "./columns";
import { DataTable } from "@/components/data-table";

const data: Payment[] = [
  {
    id: "1",
    amount: 100,
    status: "pending",
    email: "m@example.com",
  },
  {
    id: "2",
    amount: 800,
    status: "success",
    email: "vinod@gmal.com",
  },
  {
    id: "3",
    amount: 200,
    status: "failed",
    email: "jeet@gmal.com",
  },
  {
    id: "4",
    amount: 150,
    status: "pending",
    email: "sara@example.com",
  },
  {
    id: "5",
    amount: 300,
    status: "success",
    email: "alex@gmal.com",
  },
  {
    id: "6",
    amount: 400,
    status: "failed",
    email: "john@gmal.com",
  },
  {
    id: "7",
    amount: 250,
    status: "pending",
    email: "lisa@example.com",
  },
  {
    id: "8",
    amount: 350,
    status: "success",
    email: "paul@gmal.com",
  },
  {
    id: "9",
    amount: 450,
    status: "failed",
    email: "anna@gmal.com",
  },
  {
    id: "10",
    amount: 500,
    status: "pending",
    email: "mike@example.com",
  },
  {
    id: "11",
    amount: 600,
    status: "success",
    email: "jane@gmal.com",
  },
  {
    id: "12",
    amount: 700,
    status: "failed",
    email: "peter@gmal.com",
  },
  {
    id: "13",
    amount: 550,
    status: "pending",
    email: "kate@example.com",
  },
  {
    id: "14",
    amount: 150,
    status: "success",
    email: "tom@gmal.com",
  },
  {
    id: "15",
    amount: 250,
    status: "failed",
    email: "emily@gmal.com",
  },
  {
    id: "16",
    amount: 350,
    status: "pending",
    email: "sam@example.com",
  },
  {
    id: "17",
    amount: 450,
    status: "success",
    email: "will@gmal.com",
  },
  {
    id: "18",
    amount: 300,
    status: "failed",
    email: "chris@gmal.com",
  },
  {
    id: "19",
    amount: 400,
    status: "pending",
    email: "nina@example.com",
  },
  {
    id: "20",
    amount: 500,
    status: "success",
    email: "jake@gmal.com",
  },
];

const AccountsPage = () => {
  const newAccount = useNewAccount();

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
            onDelete={() => {}}
            filterKey="email"
            columns={columns}
            data={data}
            disabled={false}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default AccountsPage;
