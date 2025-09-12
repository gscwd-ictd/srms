import * as React from "react";
import { Column } from "@tanstack/react-table";
import { useMemo } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@srms/components/ui/Popover";
import { Button } from "@srms/components/ui/Button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@srms/components/ui/Command";
import { Check } from "lucide-react";
import { cn } from "@srms/utils/shadcn";

interface DataTableColumnFilterProps<TData, TValue> {
  column: Column<TData, TValue>;
  title: string;
  // title: string | Element | React.ReactNode | React.JSX.Element;
}

export function DataTableColumnFilter<TData, TValue>({
  column,
  title,
}: DataTableColumnFilterProps<TData, TValue>) {
  const columnFilterValue = column?.getFilterValue() as string;

  const sortedList = useMemo(() => Array.from(column.getFacetedUniqueValues().keys()).sort(), [column]);

  return (
    <>
      {column.getCanFilter() ? (
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="h-8 border-none bg-cyan-600 hover:bg-cyan-600">
              <>{title}</>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="p-0" align="start">
            <Command>
              <CommandInput disabled={sortedList.length === 0} placeholder={title} />
              <CommandList>
                <CommandEmpty className="dark:text-white">No results found.</CommandEmpty>
                {columnFilterValue && (
                  <>
                    <CommandGroup>
                      <CommandItem
                        onSelect={() => column?.setFilterValue("")}
                        className="justify-center text-center"
                      >
                        Clear filters
                      </CommandItem>
                    </CommandGroup>
                    <CommandSeparator />
                  </>
                )}

                <CommandGroup>
                  {sortedList.length === 0 ? (
                    <p className="text-muted-foreground p-2 text-sm">No data</p>
                  ) : (
                    sortedList.map((row, index) => {
                      return (
                        <CommandItem
                          key={index}
                          value={row}
                          onSelect={(selectedValue) => {
                            if (selectedValue === columnFilterValue) {
                              column?.setFilterValue("");
                            } else {
                              column?.setFilterValue(selectedValue);
                            }
                          }}
                        >
                          {row}
                          <Check
                            className={cn("ml-auto", columnFilterValue === row ? "opacity-100" : "opacity-0")}
                          />
                        </CommandItem>
                      );
                    })
                  )}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      ) : (
        <>{title}</>
      )}
    </>
  );
}
