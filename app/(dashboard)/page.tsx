'use client'

import { Button } from "@/components/ui/button";
import { useGetAccounts } from "@/features/accounts/api/use-get-accounts";
import { useNewAccount } from "@/features/accounts/hooks/use-new-account";
import { UserButton } from "@clerk/nextjs";
import Image from "next/image";

export default function Home() {


  return (
    <div>
       Dashboard Page
    </div>
  );
}
