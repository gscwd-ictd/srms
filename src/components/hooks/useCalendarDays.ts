'use client';

import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  format,
  addDays,
  getDay,
  lastDayOfMonth,
} from 'date-fns';
import { useState } from 'react';

const WEEKS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as const;

type Schedule = {
  date: string;
  dueDate: string | null;
  disconnectionDate: string | null;
  isRestDay: boolean;
};

export type CalendarDays = {
  allDays: string[];
  currentMonthDays: Schedule[];
  leadingDays: string[];
  trailingDays: string[];
  sundays: string[];
  weeks: string[];
  today: number;
  currentMonth: number;
  setCurrentMonth: (month: number) => void;
};

export const useCalendarDays = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());

  const currentYear = new Date().getFullYear();

  const monthStart = startOfMonth(new Date(currentYear, currentMonth)); // month is 0-based
  const monthEnd = endOfMonth(monthStart);

  // Get the full week's start (Sunday-based)
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);

  // Generate all days within the interval (including previous and next month)
  const allDays = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  // Separate into categories
  const currentMonthDays = allDays.filter(day => isSameMonth(day, monthStart));
  const previousMonthDays = allDays.filter(day => !isSameMonth(day, monthStart) && day < monthStart);
  const nextMonthDays = allDays.filter(day => !isSameMonth(day, monthStart) && day > monthEnd);

  const sundays = allDays.filter(day => getDay(day) === 0);

  // Function to calculate due date
  const calculateDueDate = (day: Date) => {
    let dueDate = addDays(day, 15);

    const dueDay = getDay(dueDate);
    if (dueDay === 6) {
      // If Saturday, move to Monday
      dueDate = addDays(dueDate, 2);
    } else if (dueDay === 0) {
      // If Sunday, move to Monday
      dueDate = addDays(dueDate, 1);
    }

    return dueDate;
  };

  // Function to calculate disconnection date
  const calculateDisconnectionDate = (dueDate: Date | null) => {
    if (!dueDate) return null; // If dueDate is null, return null

    let disconnectionDate = addDays(dueDate, 3);

    const disconnectionDay = getDay(disconnectionDate);

    if (disconnectionDay === 5) {
      // If Friday, move to Monday
      disconnectionDate = addDays(disconnectionDate, 3);
    } else if (disconnectionDay === 6) {
      // If Saturday, move to Monday
      disconnectionDate = addDays(disconnectionDate, 2);
    } else if (disconnectionDay === 0) {
      // If Sunday, move to Monday
      disconnectionDate = addDays(disconnectionDate, 1);
    }

    return disconnectionDate;
  };

  // Calculate the 22nd working day (excluding either Saturday or Sunday)
  const calculate22ndDay = () => {
    let restDayStart = '';
    let count = 0;

    currentMonthDays.forEach(day => {
      const currentDay = getDay(day);

      if (currentDay !== 6) {
        count += 1;
      }

      if (count === 21) {
        restDayStart = format(day, 'yyyy-MM-dd');
      }
    });

    const range = eachDayOfInterval({
      start: restDayStart,
      end: lastDayOfMonth(new Date().setMonth(currentMonth)).setFullYear(currentYear),
    });

    const formatted = range.map(restDay => format(restDay, 'yyyy-MM-dd'));

    console.log({ range: formatted });

    return formatted;
  };

  const restDayStart = calculate22ndDay();

  console.log({ restDayStart });

  // Map dates with due and disconnection dates
  const allDaysWithDueAndDisconnection = allDays.map(day => {
    const isRestDay = restDayStart.includes(format(day, 'yyyy-MM-dd'));
    const dueDate = isRestDay ? null : calculateDueDate(day);
    const disconnectionDate = isRestDay ? null : calculateDisconnectionDate(dueDate);
    return {
      date: format(day, 'yyyy-MM-dd'),
      dueDate: dueDate ? format(dueDate, 'yyyy-MM-dd') : null,
      disconnectionDate: disconnectionDate ? format(disconnectionDate, 'yyyy-MM-dd') : null,
      isRestDay,
    };
  });

  return {
    allDays: allDaysWithDueAndDisconnection,
    currentMonthDays, // Includes due & disconnection dates
    leadingDays: previousMonthDays.map(day => format(day, 'yyyy-MM-dd')),
    trailingDays: nextMonthDays.map(day => format(day, 'yyyy-MM-dd')),
    sundays: sundays.map(day => format(day, 'yyyy-MM-dd')),
    weeks: WEEKS,
    today: format(new Date(), 'dd'),
    currentMonth,
    setCurrentMonth,
  };
};
