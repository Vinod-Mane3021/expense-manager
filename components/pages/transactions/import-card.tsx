import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dot, Plus } from "lucide-react";
import { useState } from "react";
import ImportTable from "./import-table";
import { options, requiredOptions } from "./util";
import { cn } from "@/lib/utils";
import { convertAmountToMiliunit } from "@/lib/converters";
import { detectAndFormatDate } from "@/lib/date";

interface SelectedColumnsState {
  [key: string]: string | null;
}

type Props = {
  data: string[][];
  onCancel: () => void;
  onSubmit: (data: any) => void;
};

const ImportCard = ({ data, onCancel, onSubmit }: Props) => {
  const headers = data[0];
  const body = data.slice(1);

  const [selectedColumns, setSelectedColumns] = useState<SelectedColumnsState>({});

  const progress = Object.values(selectedColumns).filter(Boolean).length;
  const disabledContinueButton = progress < requiredOptions.length;

  const onTableHeadSelectChange = (
    columnIndex: number,
    value: string | null
  ) => {
    setSelectedColumns((prev) => {
      const newSelectedColumns = { ...prev };
      for (const key in newSelectedColumns) {
        if (newSelectedColumns[key] === value) {
          newSelectedColumns[key] = null;
        }
      }
      if (value === "skip") {
        value = null;
      }
      newSelectedColumns[`column_${columnIndex}`] = value;
      return newSelectedColumns;
    });
  };

  const handleContinue = () => {
    const getColumnIndex = (column: string) => {
      return column.split("_")[1];
    };

    /**
     * Now convert
     *     data     --->       db formate
     * [][][][][]
     * [][][][][]    --->    [{}, {}, {}, {}, {}]
     * [][][][][]
     */
    const mappedData = {
      headers: headers.map((_, index) => {
        const columnIndex = getColumnIndex(`column_${index}`);
        return selectedColumns[`column_${columnIndex}`] || null;
      }),
      body: body
        .map((row) => {
          const transformedRow = row.map((cell, index) => {
            const columnIndex = getColumnIndex(`column_${index}`);
            return selectedColumns[`column_${columnIndex}`] ? cell : null;
          });
          return transformedRow.every((item) => item === null)
            ? []
            : transformedRow;
        })
        .filter((row) => row.length > 0),
    };

    const arrayOfData = mappedData.body.map((row) => {
      const arr = row.reduce((acc: any, cell, index) => {
        const header = mappedData.headers[index];
        if (header !== null) {
          acc[header] = cell;
        }
        return acc;
      }, {});
      return arr;
    });

    const formattedData = arrayOfData.map((item) => ({
      ...item,
      amount: convertAmountToMiliunit(item.amount),
      date: item.date && detectAndFormatDate(item.date),
    }));

    onSubmit(formattedData);
  };

  return (
    <div className="max-w-screen-2xl mx-auto w-full pb-10 -mt-24">
      <Card className="border-none drop-shadow-sm">
        <CardHeader className="gap-y-2 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle className="text-xl line-clamp-1">
            Import Transaction
          </CardTitle>
          <div className="flex flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              size="sm"
              className="w-full lg:w-auto"
              onClick={onCancel}
            >
              Cancel
            </Button>
            <Button
              variant="success"
              size="sm"
              disabled={disabledContinueButton}
              className="w-full lg:w-auto"
              onClick={handleContinue}
            >
              Continue ({progress} / {options.length})
            </Button>
          </div>
        </CardHeader>
        <CardContent className="flex flex-col gap-8">
          <div>
            <div className="flex items-center gap-5">
              <Dot
                color="#71717a"
                className="size-3 bg-[#71717a] rounded-full"
              />
              <p>{"-->"} you are skipping these column</p>
            </div>
            <div className="flex items-center gap-5">
              <Dot
                color="#3b82f6"
                className="size-3 bg-[#3b82f6] rounded-full"
              />
              <p>
                {"-->"} you are adding these column in your transaction history
              </p>
            </div>
          </div>
          <ImportTable
            headers={headers}
            body={body}
            selectedColumns={selectedColumns}
            onTableHeadSelectChange={onTableHeadSelectChange}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default ImportCard;
