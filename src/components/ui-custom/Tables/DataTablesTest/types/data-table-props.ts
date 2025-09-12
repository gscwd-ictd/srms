import { Row, Table } from "@tanstack/react-table";

export type DataTableProps = {
  hydrating?: boolean;
  width?: "fixed" | "auto";
  model: Table<unknown>;
  onRowClick?: (row: Row<unknown>) => void;
  showGlobalFilter?: boolean;
  showColumnFilter?: boolean;
  paginate?: boolean;
};

export type DataTablePortalProps<T> = {
  textSize?: "text-xs" | "text-md" | "text-lg" | "text-xl";
  model: Table<unknown>;
  onRowClick?: (row: Row<T>) => void;
  showGlobalFilter?: boolean;
  showColumnFilter?: boolean;
  paginate?: boolean;
};
