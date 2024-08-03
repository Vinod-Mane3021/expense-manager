"use client";

import { useGetSummary } from "@/features/summary/api/use-get-summary";
import { formatDateRange } from "@/lib/date";
import { useSearchParams } from "next/navigation";
import { FaPiggyBank } from "react-icons/fa";
import { FaArrowTrendUp, FaArrowTrendDown } from "react-icons/fa6";
import DataCard from "./data-card";
import { DataCardLoading } from "./data-card-loading";

const DataGrip = () => {
  const { data, isLoading } = useGetSummary();

  const params = useSearchParams();
  const to = params.get('to') || undefined;
  const from = params.get('to') || undefined;

  const dateRangeLabel = formatDateRange({ to, from })

  if(isLoading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-2 mb-8">
        <DataCardLoading/>
        <DataCardLoading/>
        <DataCardLoading/>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-2 mb-8">
      <DataCard
        title="Income"
        value={data?.incomeAmount}
        percentageChange={data?.incomeChange}
        icon={FaArrowTrendUp}
        variant="default"
        dateRange={dateRangeLabel}
      />
      <DataCard
        title="Expenses"
        value={data?.expenseAmount}
        percentageChange={data?.expensesChange}
        icon={FaArrowTrendDown}
        variant="default"
        dateRange={dateRangeLabel}
      />
      <DataCard
        title="Remaining"
        value={data?.remainingAmount}
        percentageChange={data?.remainingChange}
        icon={FaPiggyBank}
        variant="default"
        dateRange={dateRangeLabel}
      />
    </div>
  );
};

export default DataGrip;
