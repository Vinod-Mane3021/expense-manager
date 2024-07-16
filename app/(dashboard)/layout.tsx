import Header from "@/components/header";
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
