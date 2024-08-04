import { format } from "date-fns";
import { formatCurrency } from "@/lib/converters";
import { Separator } from "@/components/ui/separator";

const CustomCategoryTooltip = ({ active, payload }: any) => {
  if (!active || !payload) {
    return null;
  }

  const name = payload[0].payload.name;
  const value = payload[0].value;

  return (
    <div className="rounded-md bg-white shadow-lg border overflow-hidden">
      <div className="text-xs p-1 px-3 bg-muted text-muted-foreground">
        {name}
      </div>
      <Separator />
      <div className="p-1 px-2 space-y-1">
        {/* for expenses */}
        <div className="flex items-center justify-between gap-x-2">
          <div className="flex items-center gap-x-2">
            <div className="size-2 bg-[#e26c4e] rounded-full" />
            <p className="text-xs text-muted-foreground">Expenses</p>
          </div>
          <p className="text-xs text-right font-medium">
            -{formatCurrency(value)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default CustomCategoryTooltip;
