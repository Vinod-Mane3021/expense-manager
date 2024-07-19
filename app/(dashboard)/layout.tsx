import Header from "@/components/header";
import NewAccountSheet from "@/features/accounts/components/new-account-sheet";
import { ChildrenProps } from "@/types";

const DashboardLayout = ({ children }: ChildrenProps) => {
  return (
    <>
      <Header />
      <main className="px-3 lg:px-14">{children}</main>
    </>
  );
};

export default DashboardLayout;
