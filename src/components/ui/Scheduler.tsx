"use client";

import { cn } from "@srms/utils/shadcn";

import { FunctionComponent, useEffect, useState } from "react";
import { CalendarDays, useCalendarDays } from "../hooks/useCalendarDays";
import { format } from "date-fns";

export const Scheduler: FunctionComponent = () => {
  // const calendarDays = useCalendarDays(new Date().getMonth());

  // console.log(calendarDays);

  // return <></>;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  //const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const currentMonth = new Date().getMonth();
  const calendarDays = useCalendarDays(currentMonth);

  console.log(calendarDays);

  // useEffect(() => {
  //   setCalendarDays(getCalendarDays(currentMonth));
  // }, [currentMonth]);

  return (
    <>
      {/* <div className="mb-4 flex items-center gap-4">
        <Button onClick={() => setCurrentMonth(currentMonth - 1)}>Prev</Button>
        <h1>{format(setMonth(new Date(), currentMonth), "MMMM yyy")}</h1>
        <Button onClick={() => setCurrentMonth(currentMonth + 1)}>Next</Button>
      </div> */}
      <div className="grid w-full grid-cols-7">
        {calendarDays.weeks.map((day, index) => (
          <div
            key={index}
            className="text-muted-foreground col-span-1 flex items-center justify-center border-y border-l py-2 text-sm font-medium first:border-l last:border-r"
          >
            {day}
          </div>
        ))}
      </div>
      <div className="grid h-full w-full grid-cols-7">
        {calendarDays.allDays.map((date, index) => {
          const currentDate = new Date(date.date);
          const formattedDay = format(currentDate, "dd");
          const sundays = calendarDays.sundays;
          const disable =
            calendarDays.trailingDays.includes(date.date) ||
            calendarDays.leadingDays.includes(date.date) ||
            sundays.includes(date.date);
          return (
            <div
              role="button"
              key={index}
              aria-disabled={disable}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  console.log(date); // Trigger the same action as onClick when Enter or Space is pressed
                }
              }}
              onClick={() => console.log(date)}
              tabIndex={disable ? -1 : 0}
              className={cn(
                disable
                  ? "aria-disabled:text-muted-foreground cursor-default"
                  : "text-primary hover:bg-secondary/40 font-semibold",
                "relative col-span-1 flex items-center justify-center border-b border-l p-2 text-xs first:border-l last:border-r [:nth-child(7n)]:border-r",
              )}
            >
              <div
                className={cn(
                  calendarDays.today === formattedDay &&
                    "bg-primary dark:bg-secondary flex h-6 w-6 items-center justify-center rounded-full p-2 text-white",
                  "absolute top-2 left-2",
                )}
              >
                {formattedDay}
              </div>
              {!sundays.includes(date.date) &&
                !calendarDays.leadingDays.includes(date.date) &&
                !calendarDays.trailingDays.includes(date.date) && (
                  <div className="w-full space-y-2">
                    <div className="bg-secondary flex items-center gap-2 rounded-lg px-2 py-1">
                      <div className="size-2 rounded-full bg-indigo-500" />
                      Due: {date.dueDate ? format(date.dueDate, "MMM dd") : ""}
                    </div>
                    <div className="bg-secondary flex items-center gap-2 rounded-lg px-2 py-1">
                      <div className="size-2 rounded-full bg-rose-500" />
                      Discon: {date.disconnectionDate ? format(date.disconnectionDate, "MMM dd") : ""}
                    </div>
                  </div>
                )}
            </div>
          );
        })}
      </div>
    </>
  );
};
