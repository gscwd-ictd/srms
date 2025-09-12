/* eslint-disable @typescript-eslint/no-explicit-any */
import { DebouncedInput } from "./DebounceInput";
import { Table } from "@tanstack/react-table";

export const GlobalFilter = ({ model }: { model: Table<any> }) => {
  const filterValue = model.options.state.globalFilter;

  return (
    <div>
      <DebouncedInput
        type="search"
        value={filterValue ?? ""}
        onChange={(value) => model.setGlobalFilter(String(value))}
        className="w-80 rounded-md border border-gray-400 p-2.5 text-sm text-gray-500 hover:bg-gray-50 focus-visible:outline-none"
        placeholder="Search all columns..."
      />
    </div>
  );
};
