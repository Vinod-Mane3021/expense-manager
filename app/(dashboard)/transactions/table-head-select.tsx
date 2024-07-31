import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { options } from "./util";

type Props = {
  header: string;
  columnIndex: number;
  selectedColumns: Record<string, string | null>;
  onChange: (columnIndex: number, value: string | null) => void;
};


const TableHeadSelect = ({
  header,
  columnIndex,
  selectedColumns,
  onChange,
}: Props) => {
  const currentSelectedColumn = selectedColumns[`column_${columnIndex}`];

  return (
    <Select
      value={currentSelectedColumn || ""}
      onValueChange={(value) => onChange(columnIndex, value)}
    >
      <SelectTrigger
        className={cn(
          "focus:ring-offset-0 focus:ring-transparent outline-none border-none bg-transparent capitalize",
          currentSelectedColumn && "text-blue-500"
        )}
      >
        <SelectValue placeholder={header} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="skip">Skip</SelectItem>
        {options.map((option, index) => {
          const isSelected =
            Object.values(selectedColumns).includes(option) &&
            currentSelectedColumn !== option;

          return (
            <SelectItem
              key={index}
              value={option}
              disabled={isSelected}
              className="capitalize"
            >
              {option}
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
};

export default TableHeadSelect;
