import { ColumnDef } from "@tanstack/react-table";

export type DataTableOptions<T> = {
  columns: ColumnDef<T, unknown>[];
  data: T[];
  enableRowSelection?: boolean;
  columnVisibility?: Record<string, boolean>;
};
