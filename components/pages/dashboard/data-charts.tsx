"use client";

import { useGetSummary } from "@/features/summary/api/use-get-summary";
import Chart from "./chart";
import SpendingPie from "./spending-pie";
import { ChartLoading } from "./loader/chart-loading";

const DataCharts = () => {
  const { data, isLoading } = useGetSummary();

  console.log({
    data_data: data,
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-6 gap-8">
        <div className="col-span-1 lg:col-span-3 xl:col-span-4">
          <ChartLoading/>
        </div>
        <div className="col-span-1 lg:col-span-3 xl:col-span-2">
            <ChartLoading/>
        </div>
      </div>
    );
  } 

  return (
    <div className="grid grid-cols-1 lg:grid-cols-6 gap-8">
      <div className="col-span-1 lg:col-span-3 xl:col-span-4">
        <Chart data={data?.days} />
      </div>
      <div className="col-span-1 lg:col-span-3 xl:col-span-2">
        <SpendingPie data={data?.categories} />
      </div>
    </div>
  );
};

export default DataCharts;
