import { format } from "date-fns";
import { formatCurrency } from "@/lib/converters";
import { Separator } from "@/components/ui/separator";

const CustomTooltip = ({ active, payload }: any) => {
  if (!active || !payload) {
    return null;
  }

  const date = payload[0].payload.date;
  const income = payload[0].value;
  const expenses = payload[1].value;

  return (
    <div className="rounded-md bg-white shadow-lg border overflow-hidden">
      <div className="text-xs p-1 px-3 bg-muted text-muted-foreground">
        {format(date, "MMM dd, yyyy")}
      </div>
      <Separator />
      <div className="p-1 px-2 space-y-1">
        {/* for Income */}
        <div className="flex items-center justify-between gap-x-2">
          <div className="flex items-center gap-x-2">
            <div className="size-2 bg-[#399918] rounded-full" />
            <p className="text-xs text-muted-foreground">Income</p>
          </div>
          <p className="text-xs text-right font-medium">
            {formatCurrency(income)}
          </p>
        </div>
        {/* for expenses */}
        <div className="flex items-center justify-between gap-x-2">
          <div className="flex items-center gap-x-2">
            <div className="size-2 bg-[#FF6500] rounded-full" />
            <p className="text-xs text-muted-foreground">Expenses</p>
          </div>
          <p className="text-xs text-right font-medium">
            -{formatCurrency(expenses)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default CustomTooltip;
