import DataGrip from "@/components/pages/dashboard/data-grip";
import DataCharts from "@/components/pages/dashboard/data-charts";

export default function Home() {

  return (
    <div className="max-w-screen-2xl mx-auto w-full pb-10 -mt-24">
       <DataGrip />
       <DataCharts />
    </div>
  );

}