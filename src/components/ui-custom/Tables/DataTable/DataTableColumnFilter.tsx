import * as React from "react";
import { Column } from "@tanstack/react-table";
import { Popover, PopoverContent, PopoverTrigger } from "@srms/components/ui/Popover";
import { Button } from "@srms/components/ui/Button";
import { Search } from "lucide-react";
import { Input } from "@srms/components/ui/Input";
import { Separator } from "@srms/components/ui/Separator";

interface DataTableColumnFilterProps<TData, TValue> {
  column: Column<TData, TValue>;
  title: string;
}

export function DataTableColumnFilter<TData, TValue>({
  column,
  title,
}: DataTableColumnFilterProps<TData, TValue>) {
  const columnFilterValue = column?.getFilterValue() as string;
  const [inputValue, setInputValue] = React.useState<string>("");

  // const sortedList = useMemo(() => Array.from(column.getFacetedUniqueValues().keys()).sort(), [column]);
  const handleSubmit = () => {
    column?.setFilterValue(inputValue);
  };

  return (
    <>
      {column.getCanFilter() ? (
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="h-8 border-none bg-transparent hover:bg-blue-500">
              <>{title}</>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="p-0" align="start">
            <form onSubmit={handleSubmit}>
              <div className="relative flex items-center">
                <Search className="absolute left-2.5 h-4 w-4 opacity-50" />
                <Input
                  type="text"
                  value={inputValue}
                  placeholder={columnFilterValue || title}
                  onChange={(e) => setInputValue(e.target.value)}
                  className="placeholder:text-muted-foreground flex h-10 w-full rounded-md border-0 bg-transparent py-3 pl-8 text-sm outline-hidden focus-visible:border-0 focus-visible:ring-0 focus-visible:outline-0 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>
            </form>

            {columnFilterValue && (
              <>
                <Separator className="my-1 bg-[#262626]" />
                <div className="p-1">
                  <Button
                    onClick={() => column?.setFilterValue("")}
                    className="w-full cursor-default items-center justify-center rounded-sm border-0 bg-[#262626] px-2 py-1.5 text-center text-sm font-thin text-[#fafafa] hover:bg-[#262626]"
                  >
                    Clear filters
                  </Button>
                </div>
              </>
            )}

            {/* <Command>
              <CommandInput
                // disabled={sortedList.length === 0}
                placeholder={title}
                onKeyDown={(e) => column?.setFilterValue((e.target as HTMLInputElement).value)}
              />
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
            </Command> */}
          </PopoverContent>
        </Popover>
      ) : (
        <>{title}</>
      )}
    </>
  );
}
