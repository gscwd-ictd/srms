import { ColumnFiltersState, PaginationState } from "@tanstack/react-table";
import { create } from "zustand";
import { devtools } from "zustand/middleware";

export type TableState = {
  paginationState: PaginationState;
  setPaginationState: (paginationState: PaginationState) => void;

  columnFiltersState: ColumnFiltersState;
  setColumnFiltersState: (columnFiltersState: ColumnFiltersState) => void;

  tableLoadingState: boolean;
  setTableLoadingState: (tableLoadingState: boolean) => void;
};

export const useTableStore = create<TableState>()(
  devtools((set) => ({
    paginationState: {} as PaginationState,
    setPaginationState: (paginationState: PaginationState) => set({ paginationState }),

    columnFiltersState: [] as ColumnFiltersState,
    setColumnFiltersState: (columnFiltersState: ColumnFiltersState) => set({ columnFiltersState }),

    tableLoadingState: false,
    setTableLoadingState: (tableLoadingState) => set({ tableLoadingState }),
  })),
);
