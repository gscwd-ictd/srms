"use client";

import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  format,
  addDays,
  isSunday,
  getDay,
} from "date-fns";

const WEEKS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as const;

export type CalendarDays = {
  allDays: string[];
  currentMonthDays: {
    date: string;
    dueDate: string | null;
    disconnectionDate: string | null;
  }[];
  leadingDays: string[];
  trailingDays: string[];
  sundays: string[];
  weeks: Array<typeof WEEKS>;
  today: number;
};

export const useCalendarDays = (month: number) => {
  const currentYear = new Date().getFullYear();

  const monthStart = startOfMonth(new Date(currentYear, month)); // month is 0-based
  const monthEnd = endOfMonth(monthStart);

  // Get the full week's start (Sunday-based, adjust if Monday-based)
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);

  // Generate all days within the interval (including previous and next month)
  const allDays = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  // Separate into categories
  const currentMonthDays = allDays.filter((day) => isSameMonth(day, monthStart));
  const previousMonthDays = allDays.filter((day) => !isSameMonth(day, monthStart) && day < monthStart);
  const nextMonthDays = allDays.filter((day) => !isSameMonth(day, monthStart) && day > monthEnd);

  const sundays = allDays.filter((day) => getDay(day) === 0);

  // Function to calculate due date
  const calculateDueDate = (day: Date) => {
    if (isSunday(day)) return null; // If the given day is Sunday, return null

    let dueDate = addDays(day, 15);
    if (isSunday(dueDate)) {
      dueDate = addDays(dueDate, 1);
    }
    return dueDate;
  };

  // Function to calculate disconnection date
  const calculateDisconnectionDate = (dueDate: Date | null) => {
    if (!dueDate) return null; // If dueDate is null, return null

    let disconnectionDate = addDays(dueDate, 3);

    if (isSunday(disconnectionDate)) {
      disconnectionDate = addDays(disconnectionDate, 1);
    }

    return disconnectionDate;
  };

  // Map dates with due and disconnection dates
  const allDaysWithDueAndDisconnection = allDays.map((day) => {
    // Check if the day belongs to the current month
    const isCurrentMonth = isSameMonth(day, new Date());

    // If it's not in the current month, set dueDate and disconnectionDate to null
    const dueDate = isCurrentMonth ? calculateDueDate(day) : null;
    const disconnectionDate = isCurrentMonth && dueDate ? calculateDisconnectionDate(dueDate) : null;

    return {
      date: format(day, "yyyy-MM-dd"),
      dueDate: dueDate ? format(dueDate, "yyyy-MM-dd") : null,
      disconnectionDate: disconnectionDate ? format(disconnectionDate, "yyyy-MM-dd") : null,
    };
  });

  return {
    // allDays: allDays.map((day) => format(day, "yyyy-MM-dd")),
    allDays: allDaysWithDueAndDisconnection,
    currentMonthDays: currentMonthDays, // Includes due & disconnection dates
    leadingDays: previousMonthDays.map((day) => format(day, "yyyy-MM-dd")),
    trailingDays: nextMonthDays.map((day) => format(day, "yyyy-MM-dd")),
    sundays: sundays.map((day) => format(day, "yyyy-MM-dd")),
    weeks: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    today: format(new Date(), "dd"),
  };
};
