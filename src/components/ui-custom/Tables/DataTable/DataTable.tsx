"use client";

import {
  ColumnDef,
  ColumnFiltersState,
  FilterFn,
  PaginationState,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ReactNode, useEffect, useState } from "react";
import { ArrowDownIcon, ArrowUpDown, ArrowUpIcon } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@srms/components/ui/Table";
import { Input } from "@srms/components/ui/Input";
import { DataTablePagination } from "./DataTablePagination";
import { Spinner } from "../../Spinner";
import { rankItem } from "@tanstack/match-sorter-utils";
import { useTableStore } from "@srms/components/stores/useTableStore";
import { Button } from "@srms/components/ui/Button";
import React from "react";
import { cn } from "@srms/utils/shadcn";
import { isEmpty } from "@srms/utils/isEmpty";

type DataTableProps<T> = {
  columns: Array<ColumnDef<T, unknown>>;
  data: T[];
  enableGlobalFilter?: boolean;
  enablePagination?: boolean;
  manualPagination?: boolean;
  manualFiltering?: boolean;
  pageSize?: number;
  loading?: boolean;
  actionBtn?: ReactNode | ReactNode[];
  title: string;
  rowCount?: number;
  sticky?: boolean;
  fixedHeight?: string;
};

export function DataTable<T>({
  columns,
  data,
  enableGlobalFilter = true,
  enablePagination = true,
  manualPagination = false,
  manualFiltering = false,
  pageSize = 10,
  loading = false,
  actionBtn,
  title = "",
  rowCount = 0,
  sticky = false,
  fixedHeight,
}: DataTableProps<T>) {
  const { setPaginationState, setColumnFiltersState } = useTableStore();

  const [sorting, setSorting] = useState<SortingState>([]);
  const [rowSelection, setRowSelection] = useState({});
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [debounceValue, setDebounceValue] = useState(globalFilter ?? "");
  const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize });

  const fuzzyFilter: FilterFn<unknown> = (row, columnId, value, addMeta) => {
    // Rank the item
    const itemRank = rankItem(row.getValue(columnId), value);

    // Store the itemRank info
    addMeta({
      itemRank,
    });

    // Return if the item should be filtered in/out
    return itemRank.passed;
  };

  const table = useReactTable({
    data,
    columns,
    filterFns: {
      fuzzy: fuzzyFilter,
    },
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    onSortingChange: setSorting,
    onRowSelectionChange: setRowSelection,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: setPagination,
    manualPagination: manualPagination,
    manualFiltering: manualFiltering,
    rowCount: rowCount,
    state: {
      sorting,
      rowSelection,
      columnFilters,
      globalFilter,
      pagination,
    },
  });

  useEffect(() => {
    const timeout = setTimeout(() => {
      setGlobalFilter(debounceValue);
    }, 500);

    return () => clearTimeout(timeout);
  }, [debounceValue, setGlobalFilter]);

  useEffect(() => {
    setPaginationState(pagination);
  }, [pagination, setPaginationState]);

  useEffect(() => {
    setPagination({ pageIndex: 0, pageSize: pageSize });
    setPaginationState({ pageIndex: 0, pageSize: pageSize });
    setColumnFiltersState(columnFilters);
  }, [columnFilters, setColumnFiltersState]);

  return (
    <div className="flex flex-col space-y-4">
      {/* Right-aligned: Search + Actions (flexible for mobile) */}
      <div
        className={cn(
          "grid grid-cols-1 items-start gap-2 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2",
          enableGlobalFilter ? "mb-3" : "mb-0",
        )}
      >
        <h3 className="order-1 text-xl font-bold">{title}</h3>

        {/* Search Input (full width on mobile, fixed width on desktop) */}
        <div className="order-2 flex flex-col justify-end gap-2 sm:flex-col md:flex-col lg:flex-row">
          {enableGlobalFilter && (
            <Input
              placeholder="Search..."
              value={debounceValue ?? ""}
              onChange={(event) => setDebounceValue(event.target.value)}
              className="order-2 sm:order-2 sm:w-full md:order-2 md:w-full lg:order-1 lg:w-64" // Fixed width on desktop
            />
          )}

          {actionBtn && (
            <div className="order-1 flex justify-end sm:order-1 md:order-1 lg:order-2">{actionBtn}</div>
          )}
        </div>
      </div>

      <div className="mb-0 flex min-h-0 flex-1 flex-col overflow-auto border">
        {loading ? (
          <Spinner className="text-primary my-4 size-20" size={"lg"} />
        ) : (
          // !isEmpty(fixedHeight) ? "h-[" + fixedHeight + "]" : "h-full",
          <div className={cn("w-full overflow-x-auto", !isEmpty(fixedHeight) ? fixedHeight : "h-full")}>
            {/* <div className="w-full overflow-x-auto"> */}
            <Table className="min-w-full [&_td]:px-4 [&_th]:px-4">
              <TableHeader className={cn(sticky ? "sticky top-0 z-10" : "")}>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow
                    key={headerGroup.id}
                    className="sticky bg-cyan-600 text-amber-50 hover:bg-cyan-600"
                  >
                    {headerGroup.headers.map((header) => (
                      <TableHead key={header.id}>
                        <div className="flex items-center py-1">
                          <div>{flexRender(header.column.columnDef.header, header.getContext())}</div>

                          {/* Sorting */}
                          {header.column.getCanSort() ? (
                            <Button
                              variant="ghost"
                              onClick={() =>
                                header.column.toggleSorting(header.column.getIsSorted() === "asc")
                              }
                              className="rounded-none hover:bg-cyan-600"
                            >
                              {header.column.getIsSorted() === "desc" ? (
                                <ArrowDownIcon className="ml-1 h-4 w-4" />
                              ) : header.column.getIsSorted() === "asc" ? (
                                <ArrowUpIcon className="ml-1 h-4 w-4" />
                              ) : (
                                <ArrowUpDown className="ml-1 h-4 w-4" />
                              )}
                            </Button>
                          ) : null}
                        </div>
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>

              <TableBody>
                {!table.getRowModel().rows?.length ? (
                  <TableRow>
                    <TableCell colSpan={table.getAllColumns().length}>
                      <div className="max-w-full py-5 text-center text-2xl font-bold text-black">
                        No Results
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  table.getRowModel().rows.map((row) => (
                    <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id} className="word-wrap overflow-wrap">
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      {enablePagination && (
        <div className="pt-2">
          <DataTablePagination table={table} />
        </div>
      )}
    </div>
  );
}
