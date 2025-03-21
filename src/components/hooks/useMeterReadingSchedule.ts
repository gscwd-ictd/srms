/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import {
  addDays,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isFirstDayOfMonth,
  isSameMonth,
  isSunday,
  isWeekend,
  nextMonday,
  parse,
  startOfMonth,
  startOfWeek,
  subDays,
} from 'date-fns';
import { useCallback, useMemo, useState } from 'react';

export type Holiday = {
  id: string;
  name: string;
  holidayDate: string;
  type: string;
};

export type CalendarDay = {
  readingDate: Date;
  dueDate: Date | Date[] | undefined;
  disconnectionDate: Date | Date[] | undefined;
};

export const useMeterReadingSchedule = (holidays: Holiday[], date?: Date) => {
  const [currentDate, setCurrentDate] = useState(date ?? new Date());

  // Memoize formatted holiday dates for efficient lookups
  const holidayDates = useMemo(() => {
    return new Set(
      holidays.map(holiday => format(parse(holiday.holidayDate, 'MMMM dd, yyyy', new Date()), 'yyyy-MM-dd')),
    );
  }, [holidays]);

  // Utility function to have a uniform format for dates
  const formatDate = (date: Date) => format(date, 'yyyy-MM-dd');

  // Check if a date is a holiday
  const isHoliday = useCallback((date: Date): boolean => holidayDates.has(formatDate(date)), [holidayDates]);

  // Add 1 day if the provided date is a holiday
  const adjustForHolidayOrWeekend = useCallback(
    (date: Date) => {
      while (isHoliday(date) || isWeekend(date)) {
        if (isHoliday(date)) {
          date = addDays(date, 1);
        }

        if (isWeekend(date)) {
          date = nextMonday(date);
        }
      }
      return date;
    },
    [isHoliday],
  );

  const getCalendarDays = () => {
    const firstDayOfMonth = startOfMonth(currentDate);
    const lastDayOfMonth = endOfMonth(currentDate);

    const firstDayOfCalendar = startOfWeek(firstDayOfMonth);
    const lastDayOfCalendar = endOfWeek(lastDayOfMonth);

    const allDays = eachDayOfInterval({
      start: firstDayOfCalendar,
      end: lastDayOfCalendar,
    });

    return allDays;
  };

  const calculateDueDate = (readingDate: Date) => {
    const monthStart = startOfMonth(currentDate);
    let dueDate = readingDate;

    if (isSunday(readingDate) || isHoliday(readingDate) || !isSameMonth(readingDate, monthStart)) {
      return undefined;
    }

    dueDate = addDays(dueDate, 15);

    dueDate = adjustForHolidayOrWeekend(dueDate);

    return formatDate(dueDate);
  };

  const calculateDisconnectionDate = (dueDate: Date | undefined) => {};

  return {
    getCalendarDays,
    calculateDueDate,
    calculateDisconnectionDate,
    isHoliday,
    formatDate,
  };
};
