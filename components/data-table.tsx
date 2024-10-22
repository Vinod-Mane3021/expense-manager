"use client";

import {
  ColumnDef,
  ColumnFiltersState,
  Row,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { useState } from "react";
import { ChevronDown, Trash } from "lucide-react";
import { useConfirm } from "@/hooks/use-confirm";
import { deleteDefaultDialogProps, deleteAccountDialogProps, deleteCategoryDialogProps } from "@/constants/props";
import { TransactionResponseType } from "@/types/transaction";

interface DataTableProps<TData, TValue> {
  dataTableType: "account" | "category" | "transaction";
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  filterKey: string;
  onDelete: (rows: Row<TData>[]) => void;
  disabled?: boolean;
}

export function DataTable<TData, TValue>({
  dataTableType,
  columns,
  data,
  filterKey,
  onDelete,
  disabled,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  const selectedRow = table.getFilteredSelectedRowModel().rows;
  
  const accountDialogProps = {
    ...deleteAccountDialogProps,
    confirmButtonLabel: selectedRow.length > 1 ? "Yes, delete account's" : "Yes, delete account",
  }
  const categoryDialogProps = {
    ...deleteCategoryDialogProps,
    confirmButtonLabel: selectedRow.length > 1 ? "Yes, delete categories" : "Yes, delete category",
  }
  const transactionDialogProps = {
    ...deleteCategoryDialogProps,
    confirmButtonLabel: selectedRow.length > 1 ? "Yes, delete transactions" : "Yes, delete transaction",
  }

  const dialogProps = 
    dataTableType === "account" ? accountDialogProps :
    dataTableType === "category" ? categoryDialogProps :
    dataTableType === "transaction" ? transactionDialogProps :
    deleteDefaultDialogProps
  
  const [ConfirmationDialog, confirm] = useConfirm(dialogProps);

  // This function is responsible for deleting users account or category
  const handleDelete = async () => {
    const isConfirm = await confirm();
    if (isConfirm) {
      console.log("rows length -> ", selectedRow.length)
      onDelete(selectedRow);
      table.resetRowSelection();
    }
  };

  return (
    <div>
      {/* dialog */}
      <ConfirmationDialog />

      <div className="flex items-center py-4">
        {/* Filter */}
        <Input
          placeholder={`Filter ${filterKey}...`}
          value={(table.getColumn(filterKey)?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn(filterKey)?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <div className="flex ml-auto gap-5">
          {/*  delete functionality */}
          {selectedRow.length > 0 && (
            <Button
              disabled={disabled}
              // size="sm"
              variant="outline"
              className="font-normal text-red-400 hover:text-red-600"
              onClick={handleDelete}
            >
              <Trash className="size-4 mr-2" />
              Delete ({selectedRow.length})
            </Button>
          )}

          {/* Select dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-auto">
                Columns
                <ChevronDown className="size-4 ml-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* column Visibility */}
      </div>

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-end space-x-2 py-4">
        {/* Show Row Selection */}
        <div className="flex-1 text-sm text-muted-foreground">
          {selectedRow.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
