'use client';

import {
  addDays,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameMonth,
  isSunday,
  isWeekend,
  nextMonday,
  parse,
  startOfMonth,
  startOfWeek,
} from 'date-fns';
import { useCallback, useEffect, useMemo, useState } from 'react';

type Holiday = {
  id: string;
  name: string;
  holidayDate: string;
  type: string;
};

export type DateEntry = {
  readingDate: Date;
  dueDate: Date | Date[];
  disconnectionDate: Date | Date[];
};

export const useCalendar = (holidays: Holiday[], month?: number, year?: number) => {
  const [currentMonth, setCurrentMonth] = useState(month ?? new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(year ?? new Date().getFullYear());

  const formatDate = (date: Date) => {
    return format(date, 'yyyy-MM-dd');
  };

  // Get current month name
  const currentMonthName = useMemo(() => {
    return format(new Date(currentYear, currentMonth), 'MMMM');
  }, [currentMonth, currentYear]);

  // Memoize formatted holiday dates for efficient lookups
  const holidayDates = useMemo(() => {
    return new Set(
      holidays.map(holiday => format(parse(holiday.holidayDate, 'MMMM dd, yyyy', new Date()), 'yyyy-MM-dd')),
    );
  }, [holidays]);

  // Check if a date is a holiday
  const isHoliday = useCallback(
    (date: Date): boolean => {
      return holidayDates.has(format(date, 'yyyy-MM-dd'));
    },
    [holidayDates],
  );

  const adjustForHolidayOrWeekend = useCallback(
    (date: Date) => {
      while (isWeekend(date) || isHoliday(date)) {
        if (isWeekend(date)) {
          date = nextMonday(date);
        } else {
          date = addDays(date, 1);
        }
      }

      return date;
    },
    [isHoliday],
  );

  const adjustForSunday = useCallback((date: Date) => {
    if (isSunday(date)) {
      date = addDays(date, 1);
    }

    return date;
  }, []);

  // Update month and year if props change
  useEffect(() => {
    if (month !== undefined) {
      setCurrentMonth(new Date().getMonth());
    }
    if (year !== undefined) {
      setCurrentYear(new Date().getFullYear());
    }
  }, [month, year]);

  const calculateDisconnectionDates = useCallback(
    (date: Date, businessDays: number) => {
      let result = new Date(date);
      let daysAdded = 0;

      while (daysAdded < businessDays) {
        result = addDays(result, 1);

        if (!isWeekend(result) && !isHoliday(result)) {
          daysAdded++;
        }
      }

      if (isWeekend(result) || isHoliday(result)) {
        const daysToAdd = result.getDay() === 0 ? 1 : 2;
        result = addDays(result, daysToAdd);
      }

      return result;
    },
    [isHoliday],
  );

  const getDueAndDisconnectionDates = useCallback(() => {
    const dueDates: DateEntry[] = [];
    const monthStart = startOfMonth(new Date(currentYear, currentMonth));

    let readingDateCount = 1;
    let readingDate = monthStart;
    let dueDate = monthStart;

    while (isHoliday(readingDate) || isSunday(readingDate)) {
      readingDate = adjustForHolidayOrWeekend(readingDate);
    }

    dueDate = addDays(readingDate, 15);

    while (isSameMonth(readingDate, monthStart) && readingDateCount < 22) {
      dueDate = adjustForHolidayOrWeekend(dueDate);

      const disconnectionDate = calculateDisconnectionDates(dueDate, 3);

      readingDate = adjustForSunday(readingDate);

      dueDates.push({
        readingDate: new Date(readingDate),
        dueDate: new Date(dueDate),
        disconnectionDate: new Date(disconnectionDate),
      });

      readingDate = addDays(readingDate, 1);

      dueDate = addDays(dueDate, 1);

      readingDateCount++;
    }

    return dueDates;
  }, [
    adjustForSunday,
    adjustForHolidayOrWeekend,
    calculateDisconnectionDates,
    isHoliday,
    currentMonth,
    currentYear,
  ]);

  const splitDates = useCallback((dates: DateEntry[], selectedDate?: Date): DateEntry[] => {
    if (!selectedDate) {
      return dates;
    }

    // Create deep copies to avoid mutating the original objects
    const datesCopy: DateEntry[] = dates.map(date => ({
      readingDate: new Date(date.readingDate),
      dueDate: Array.isArray(date.dueDate) ? date.dueDate.map(d => new Date(d)) : new Date(date.dueDate),
      disconnectionDate: Array.isArray(date.disconnectionDate)
        ? date.disconnectionDate.map(d => new Date(d))
        : new Date(date.disconnectionDate),
    }));

    // Perform the filtering
    const leadingDates = datesCopy.filter(entry => entry.readingDate <= selectedDate);
    const trailingDates = datesCopy.filter(entry => entry.readingDate > selectedDate);

    // Early return if we don't have enough dates to perform the operation
    if (leadingDates.length < 2 || trailingDates.length < 1) {
      return datesCopy; // Return the original dates without modifications
    }

    // Clone trailing dates to avoid interference
    const trailingResults = trailingDates.map(item => ({ ...item }));

    // Store the original due dates
    const originalDueDates = trailingDates.map(item => ({
      dueDate: item.dueDate,
      disconnectionDate: item.disconnectionDate,
    }));

    // Shift due dates for trailing results
    for (let i = 1; i < trailingResults.length; i++) {
      trailingResults[i]!.dueDate = originalDueDates[i - 1]!.dueDate;
      trailingResults[i]!.disconnectionDate = originalDueDates[i - 1]!.disconnectionDate;
    }

    // Get the relevant dates
    const previousDate = leadingDates[leadingDates.length - 2]!;
    const currentDate = leadingDates[leadingDates.length - 1]!;
    const nextDate = trailingResults[0]!;

    // Update due dates
    nextDate.dueDate = currentDate.dueDate;
    currentDate.dueDate = [previousDate.dueDate, currentDate.dueDate] as Date[];

    nextDate.disconnectionDate = currentDate.disconnectionDate;
    currentDate.disconnectionDate = [previousDate.disconnectionDate, currentDate.disconnectionDate] as Date[];

    return [...leadingDates, ...trailingResults];
  }, []);

  const getFullCalendar = useCallback(
    (dates: Array<DateEntry>) => {
      if (dates.length === 0) return [];

      // Get the target month from the first readingDate
      // const firstReadingDate = parseISO(dates[0].readingDate);
      const firstDayOfMonth = startOfMonth(new Date(currentYear, currentMonth));
      const lastDayOfMonth = endOfMonth(new Date(currentYear, currentMonth));

      // Get the full week range covering the month
      const firstDayOfCalendar = startOfWeek(firstDayOfMonth);
      const lastDayOfCalendar = endOfWeek(lastDayOfMonth);

      // Generate all days in the full calendar range
      const allDays = eachDayOfInterval({
        start: firstDayOfCalendar,
        end: lastDayOfCalendar,
      });

      // Convert to the desired format
      const calendarDays = allDays.map(day => {
        const existingEntry = dates.find(
          entry => formatDate(new Date(entry.readingDate)) === formatDate(day),
        );

        return existingEntry
          ? existingEntry
          : {
              readingDate: day,
              dueDate: null,
              disconnectionDate: null,
            };
      });

      return calendarDays;
    },
    [currentMonth, currentYear],
  );

  // Provide navigation methods
  const goToPreviousMonth = () => {
    if (currentMonth === 0) {
      // If January, go to December of previous year
      setCurrentMonth(11);
      setCurrentYear(prevYear => prevYear - 1);
    } else {
      setCurrentMonth(prevMonth => prevMonth - 1);
    }
  };

  const goToNextMonth = () => {
    if (currentMonth === 11) {
      // If December, go to January of next year
      setCurrentMonth(0);
      setCurrentYear(prevYear => prevYear + 1);
    } else {
      setCurrentMonth(prevMonth => prevMonth + 1);
    }
  };

  const today = () => {
    setCurrentMonth(new Date().getMonth());
    setCurrentYear(new Date().getFullYear());
  };

  const getCurrentMonthRange = () => {
    const monthStart = startOfMonth(new Date(currentYear, currentMonth)); // month is 0-based
    const monthEnd = endOfMonth(monthStart);

    return { monthStart, monthEnd };
  };

  return {
    getDueAndDisconnectionDates,
    getCurrentMonthRange,
    getFullCalendar,
    splitDates,
    formatDate,
    goToPreviousMonth,
    goToNextMonth,
    today,
    setCurrentMonth,
    setCurrentYear,
    week: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    currentMonth,
    month: currentMonthName,
    year: currentYear,
  };
};
