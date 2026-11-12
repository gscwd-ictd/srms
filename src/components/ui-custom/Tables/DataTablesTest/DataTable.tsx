import { FunctionComponent } from "react";
import { flexRender } from "@tanstack/react-table";
import { DataTableProps } from "./types/data-table-props";
import { SortableColumn } from "./SortableColumn";
// import { GlobalFilter } from "./GlobalFilter";
// import { ColumnFilter } from "./ColumnFilter";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@srms/components/ui/Table";
import { Button } from "@srms/components/ui/Button";

export const DataTable: FunctionComponent<DataTableProps> = ({
  model,
  // onRowClick,
  // showGlobalFilter = false,
  // showColumnFilter = false,
  paginate = false,
}) => {
  // const resetFilterInputs = () => {
  //   model.resetColumnFilters();
  // };
  // useEffect(() => {
  //   console.log(model.getHeaderGroups());
  // }, []);

  return (
    <div className="w-full">
      {/* <div className="flex items-center py-4">{showGlobalFilter ? <GlobalFilter model={model} /> : null}</div> */}

      <div className="overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            {model.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}

                      {header.column.getCanSort() && <SortableColumn />}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {model.getRowModel().rows?.length ? (
              model.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  // onClick={onRowClick ? () => onRowClick(row) : () => null}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={model?.getAllColumns().length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {model && paginate ? (
        <div className="flex items-center justify-end space-x-2 py-4">
          <div className="text-muted-foreground flex-1 text-sm">
            {model.getFilteredSelectedRowModel().rows.length} of {model.getFilteredRowModel().rows.length}{" "}
            row(s) selected.
          </div>
          <div className="space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => model.previousPage()}
              disabled={!model.getCanPreviousPage()}
            >
              Previous
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => model.nextPage()}
              disabled={!model.getCanNextPage()}
            >
              Next
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
};
