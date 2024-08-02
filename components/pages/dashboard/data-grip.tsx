"use client";

import { useGetSummary } from "@/features/summary/api/use-get-summary";
import { formatDateRange } from "@/lib/date";
import { useSearchParams } from "next/navigation";
import { FaPiggyBank } from "react-icons/fa";
import DataCard from "./data-card";

const DataGrip = () => {
  const { data } = useGetSummary();

  const params = useSearchParams();
  const to = params.get('to') || undefined;
  const from = params.get('to') || undefined;

  const dateRangeLabel = formatDateRange({ to, from })

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-2 mb-8">
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
