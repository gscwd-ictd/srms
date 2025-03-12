"use client";

import { cn } from "@srms/utils/shadcn";
import {
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  getDay,
  isSameMonth,
  //   setMonth,
  startOfMonth,
  startOfWeek,
} from "date-fns";
import { FunctionComponent, useEffect, useState } from "react";
// import { Button } from "./Button";

type CalendarDays = {
  allDays: string[];
  previousMonthDays: string[];
  currentMonthDays: string[];
  nextMonthDays: string[];
};

const getCalendarDays = (month: number) => {
  const currentYear = new Date().getFullYear();

  const monthStart = startOfMonth(new Date(currentYear, month)); // month is 0-based
  const monthEnd = endOfMonth(monthStart);

  // Get the full week's start (Sunday-based, adjust if Monday-based)
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);

  // Generate all days within the interval (including previous and next month)
  const allDays = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  // Separate into categories
  const previousMonthDays = allDays.filter((day) => !isSameMonth(day, monthStart) && day < monthStart);
  const currentMonthDays = allDays.filter((day) => isSameMonth(day, monthStart));
  const nextMonthDays = allDays.filter((day) => !isSameMonth(day, monthStart) && day > monthEnd);

  return {
    allDays: allDays.map((day) => format(day, "yyyy-MM-dd")),
    previousMonthDays: previousMonthDays.map((day) => format(day, "yyyy-MM-dd")),
    currentMonthDays: currentMonthDays.map((day) => format(day, "yyyy-MM-dd")),
    nextMonthDays: nextMonthDays.map((day) => format(day, "yyyy-MM-dd")),
  };
};

const getAllSundays = (month: number) => {
  const currentYear = new Date().getFullYear();
  const monthStart = startOfMonth(new Date(currentYear, month)); // month is 0-based
  const monthEnd = endOfMonth(monthStart);

  const allDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Filter only Sundays (getDay() === 0)
  const sundays = allDays.filter((day) => getDay(day) === 0);

  return sundays.map((day) => format(day, "yyyy-MM-dd"));
};

const daysIEE = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const today = format(new Date(), "dd");

export const Scheduler: FunctionComponent = () => {
  const [calendarDays, setCalendarDays] = useState<CalendarDays>({
    allDays: [],
    previousMonthDays: [],
    currentMonthDays: [],
    nextMonthDays: [],
  });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());

  //const currentMonth = new Date().getMonth();
  //const calendarDays = getCalendarDays(currentMonth);

  useEffect(() => {
    setCalendarDays(getCalendarDays(currentMonth));
  }, [currentMonth]);

  return (
    <>
      {/* <div className="mb-4 flex items-center gap-4">
        <Button onClick={() => setCurrentMonth(currentMonth - 1)}>Prev</Button>
        <h1>{format(setMonth(new Date(), currentMonth), "MMMM yyy")}</h1>
        <Button onClick={() => setCurrentMonth(currentMonth + 1)}>Next</Button>
      </div> */}
      <div className="grid w-full grid-cols-7">
        {daysIEE.map((day, index) => (
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
          const currentDate = new Date(date);
          const formattedDay = format(currentDate, "dd");

          const sundays = getAllSundays(currentMonth);

          return (
            <div
              role="button"
              key={index}
              aria-disabled={
                calendarDays.previousMonthDays.includes(date) ||
                calendarDays.nextMonthDays.includes(date) ||
                sundays.includes(date)
              }
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  console.log(date); // Trigger the same action as onClick when Enter or Space is pressed
                }
              }}
              onClick={() => console.log(date)}
              tabIndex={0}
              className={cn(
                calendarDays.previousMonthDays.includes(date) ||
                  calendarDays.nextMonthDays.includes(date) ||
                  sundays.includes(date)
                  ? "aria-disabled:text-muted-foreground cursor-default"
                  : "text-primary hover:bg-secondary/40 font-semibold",
                "relative col-span-1 flex items-center justify-center border-b border-l p-2 text-xs first:border-l last:border-r [:nth-child(7n)]:border-r",
              )}
            >
              <div
                className={cn(
                  today === formattedDay &&
                    "bg-secondary flex h-6 w-6 items-center justify-center rounded-full p-2 text-white",
                  "absolute top-2 left-2",
                )}
              >
                {formattedDay}
              </div>

              {!sundays.includes(date) && calendarDays.currentMonthDays.includes(date) && (
                <div className="w-full space-y-2">
                  <div className="bg-secondary flex items-center gap-2 rounded-lg px-2 py-1">
                    <div className="size-2 rounded-full bg-indigo-500" />
                    Due Date
                  </div>
                  <div className="bg-secondary flex items-center gap-2 rounded-lg px-2 py-1">
                    <div className="size-2 rounded-full bg-rose-500" />
                    Disconnection Date
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
