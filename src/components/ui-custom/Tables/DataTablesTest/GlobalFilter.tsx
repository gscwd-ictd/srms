import { DebouncedInput } from "./DebounceInput";
import { Table } from "@tanstack/react-table";

export const GlobalFilter = ({ model }: { model: Table<unknown> }) => {
  const filterValue = model.options.state.globalFilter;

  return (
    <div>
      <DebouncedInput
        type="search"
        value={filterValue ?? ""}
        onChange={(value) => model.setGlobalFilter(String(value))}
        className="max-w-sm"
        // className="w-80 rounded-md border border-gray-300 bg-white p-2.5 text-xs font-medium text-gray-500 hover:bg-gray-50 focus-visible:outline-none"
        placeholder="Search all columns..."
      />
    </div>
  );
};
