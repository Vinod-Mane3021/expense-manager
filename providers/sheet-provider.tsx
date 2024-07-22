"use client";

import { useMountedState } from "react-use";
import { Loader2 } from "lucide-react";

import NewAccountSheet from "@/features/accounts/components/new-account-sheet";
import EditAccountSheet from "@/features/accounts/components/edit-account-sheet";

const SheetProvider = () => {
  const isMounted = useMountedState();

  if (!isMounted) {
    return <Loader2 className="size-5 text-gray-600 animate-spin" />;
  }

  return (
    <>
      <NewAccountSheet />
      <EditAccountSheet />
    </>
  );
};

export default SheetProvider;
