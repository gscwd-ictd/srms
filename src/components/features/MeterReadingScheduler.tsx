"use client";

import { FunctionComponent, useState, memo } from "react";
import { CalendarDay, useCalendarDays } from "../temp/useCalendarDays";
import { format } from "date-fns";
import { cn } from "@srms/utils/shadcn";
import { Button } from "../ui/Button";
import { ButtonGroup } from "../ui/ButtonGroup";
import { AvatarUser, StackedAvatars } from "../ui/StackedAvatar";
import {
  CalendarPlus,
  Check,
  ChevronLeft,
  ChevronRight,
  ChevronsUpDown,
  StickyNote,
  UserPen,
} from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@srms/components/ui/Command";
import { Popover, PopoverContent, PopoverTrigger } from "@srms/components/ui/Popover";

type MeterReader = {
  id: string;
  value: string;
  label: string;
};

// Sample data with proper typing
const sampleData: MeterReader[] = [
  {
    id: "1",
    value: "John Doe",
    label: "John Doe",
  },
  {
    id: "2",
    value: "Linus Torvalds",
    label: "Linus Torvalds",
  },
  {
    id: "3",
    value: "Rob Pke",
    label: "Rob Pike",
  },
  {
    id: "4",
    value: "Sam Altman",
    label: "Sam Altman",
  },
  {
    id: "5",
    value: "Jane Dane",
    label: "Jane Dane",
  },
];

const users: AvatarUser[] = [
  {
    id: "1",
    name: "Test",
    image:
      "https://plus.unsplash.com/premium_photo-1671656349218-5218444643d8?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: "1",
    name: "Test",
    image:
      "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=2080&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: "1",
    name: "Test",
    image:
      "https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=2080&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: "1",
    name: "Test",
    image:
      "https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: "1",
    name: "Test",
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
];

type CalendarGridProps = {
  calendarDays: CalendarDay[];
  week: string[];
  today: string;
};

type MeterReaderSelectorProps = {
  value: string;
  setValue: (value: string) => void;
};

// Memoized Calendar component with TypeScript props
const CalendarGrid = memo<CalendarGridProps>(({ calendarDays, week }) => {
  return (
    <>
      <div className="grid h-[4vh] w-full grid-cols-7 border-b">
        {week.map((weekName, index) => (
          <div
            key={index}
            className="text-muted-foreground col-span-1 flex items-center justify-center border-l text-xs font-bold tracking-wide uppercase first:border-l-0"
          >
            {weekName}
          </div>
        ))}
      </div>

      <div className="grid flex-1 grid-cols-7 overflow-y-auto">
        {calendarDays.map((day, index) => {
          return (
            <div
              key={index}
              role="button"
              className={cn(
                !day.dueAt || !day.disconnectAt
                  ? "bg-muted/60 dark:bg-muted/30 text-muted-foreground/40 cursor-default"
                  : "bg-background",
                "col-span-1 flex h-full min-h-16 flex-col justify-between border-t border-l p-2 [&:nth-child(-n+7)]:border-t-0 [&:nth-child(7n+1)]:border-l-0",
              )}
            >
              <section className="flex items-center justify-between">
                <div
                  className={cn(
                    format(new Date(), "MM-dd-yyyy") === format(day.date, "MM-dd-yyyy")
                      ? "bg-primary text-primary-foreground rounded-full"
                      : "text-muted-foreground/85 bg-transparent",
                    "flex size-7 items-center justify-center text-sm font-semibold",
                  )}
                >
                  {format(new Date(day.date), "dd")}
                </div>

                {day.dueAt || day.disconnectAt ? (
                  <div className="text-muted-foreground/60 flex items-center gap-2 pr-4">
                    <button>
                      <UserPen className="size-4" />
                    </button>

                    <button>
                      <CalendarPlus className="size-4" />
                    </button>

                    <button>
                      <StickyNote className="size-4" />
                    </button>
                  </div>
                ) : null}
              </section>

              <section>
                {day.dueAt || day.disconnectAt ? (
                  <div className="space-y-1 pb-2 text-xs">
                    <div className="bg-secondary flex items-center gap-1 rounded border px-1">
                      <div className="size-2 rounded-full bg-indigo-500" />
                      {format(day.dueAt!, "MMM dd yyyy")}
                    </div>
                    <div className="bg-secondary flex items-center gap-1 rounded border px-1">
                      <div className="size-2 rounded-full bg-rose-500" />
                      {format(day.disconnectAt!, "MMM dd yyyy")}
                    </div>
                  </div>
                ) : null}
              </section>

              <section>
                {day.dueAt || day.disconnectAt ? <StackedAvatars users={users} size="sm" limit={3} /> : null}
              </section>
            </div>
          );
        })}
      </div>
    </>
  );
});

CalendarGrid.displayName = "CalendarGrid";

// Separate component for the meter reader selection popover
const MeterReaderSelector: FunctionComponent<MeterReaderSelectorProps> = ({ value, setValue }) => {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" role="combobox" aria-expanded={open} className="w-[200px] justify-between">
          {value ? sampleData.find((framework) => framework.value === value)?.label : "Select Meter Reader"}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search..." className="h-9" />
          <CommandList>
            <CommandEmpty>
              <p className="text-muted-foreground">Not found</p>
            </CommandEmpty>
            <CommandGroup>
              {sampleData.map((framework, index) => (
                <CommandItem
                  key={index}
                  value={framework.value}
                  onSelect={(currentValue) => {
                    setValue(currentValue === value ? "" : currentValue);
                    setOpen(false);
                  }}
                >
                  {framework.label}
                  <Check className={cn("ml-auto", value === framework.value ? "opacity-100" : "opacity-0")} />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export const MeterReadingScheduler: FunctionComponent = () => {
  const [value, setValue] = useState<string>("");

  const calendar = useCalendarDays();
  const today = format(new Date(), "MM-dd-yyyy");

  return (
    <>
      <div className="flex h-full w-full flex-col overflow-clip rounded-2xl border">
        <header className="flex items-center justify-between border-b px-5 py-4">
          <section className="flex items-center gap-3">
            <div
              role="button"
              className="flex flex-col overflow-clip rounded-md border"
              onClick={() => calendar.today()}
            >
              <div className="bg-secondary text-secondary-foreground/50 flex flex-1 items-center justify-center border-b px-3 py-1 text-sm font-bold tracking-wide uppercase">
                {format(new Date(), "MMM")}
              </div>

              <div className="flex flex-1 justify-center text-lg font-extrabold">
                {format(new Date(), "dd")}
              </div>
            </div>

            <div className="flex h-full flex-col">
              <h3 className="text-lg font-semibold">
                {calendar.month} {calendar.year}
              </h3>
              <p className="text-muted-foreground text-sm">
                {format(calendar.getCurrentMonthRange().monthStart, "MMM dd")} -{" "}
                {format(calendar.getCurrentMonthRange().monthEnd, "MMM dd, yyyy")}
              </p>
            </div>
          </section>

          <section className="flex items-center gap-2">
            <ButtonGroup>
              <Button variant="outline" onClick={() => calendar.goToPreviousMonth()}>
                <ChevronLeft />
              </Button>
              <Button variant="outline" onClick={() => calendar.today()}>
                Today
              </Button>
              <Button variant="outline" onClick={() => calendar.goToNextMonth()}>
                <ChevronRight />
              </Button>
            </ButtonGroup>

            {/* Extracted into a separate component */}
            <MeterReaderSelector value={value} setValue={setValue} />

            <Button>
              <CalendarPlus />
              Add schedule
            </Button>
          </section>
        </header>

        {/* Memoized calendar grid component */}
        <CalendarGrid calendarDays={calendar.calendarDays} week={calendar.week} today={today} />
      </div>
    </>
  );
};
