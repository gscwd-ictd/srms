import { Checkbox } from "@srms/components/ui/Checkbox";
import { Table } from "@tanstack/react-table";

type DataTableSelectableHeaderProps<T> = {
  table: Table<T>;
};

export function DataTableSelectableTableHeader<T>({ table }: DataTableSelectableHeaderProps<T>) {
  return (
    <Checkbox
      checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
      onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
      aria-label="Select all"
    />
  );
}
