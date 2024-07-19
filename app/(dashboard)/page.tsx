'use client'

import { Button } from "@/components/ui/button";
import { useGetAccounts } from "@/features/accounts/api/use-get-account";
import { useNewAccount } from "@/features/accounts/hooks/use-new-account";
import { UserButton } from "@clerk/nextjs";
import Image from "next/image";

export default function Home() {

  const { isOpen, onOpen, onClose } = useNewAccount()

  const { data, isLoading } = useGetAccounts()

  return (
    <div>
       Dashboard Page
       <Button onClick={onOpen}>
        Click ME
       </Button>
    </div>
  );
}
