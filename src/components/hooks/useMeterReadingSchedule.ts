'use client';

import {
  addDays,
  addMonths,
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
  subMonths,
} from 'date-fns';
import { useCallback, useEffect, useMemo, useState } from 'react';

export type Holiday = {
  id: string;
  name: string;
  holidayDate: string;
  type: string;
};

export type MeterReadingSchedule = {
  readingDate: Date;
  dueDate: Date | Date[] | undefined;
  disconnectionDate: Date | Date[] | undefined;
};

export const useMeterReadingSchedule = (holidays: Holiday[], date?: Date) => {
  const [currentDate, setCurrentDate] = useState(date ?? new Date());

  useEffect(() => {
    if (date !== undefined && date.getTime() !== currentDate.getTime()) {
      setCurrentDate(date);
    }
  }, [currentDate, date]);

  // Memoize formatted holiday dates for efficient lookups
  const holidayDates = useMemo(() => {
    return holidays.map(holiday =>
      format(parse(holiday.holidayDate, 'MMMM dd, yyyy', new Date()), 'yyyy-MM-dd'),
    );
  }, [holidays]);

  // Utility function to have a uniform format for dates
  const formatDate = (date: Date | undefined, dateFormat?: 'yyyy-MM-dd' | 'MMM dd') => {
    if (!date) {
      return undefined;
    }

    if (!dateFormat) {
      dateFormat = 'yyyy-MM-dd';
    }

    return format(date, dateFormat);
  };

  // Check if a date is a holiday
  const isHoliday = useCallback(
    (date: Date): boolean => holidayDates.includes(formatDate(date) as string),
    [holidayDates],
  );

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

  const getCalendarDays = useCallback(() => {
    const firstDayOfMonth = startOfMonth(currentDate);
    const lastDayOfMonth = endOfMonth(currentDate);

    const firstDayOfCalendar = startOfWeek(firstDayOfMonth);
    const lastDayOfCalendar = endOfWeek(lastDayOfMonth);

    const allDays = eachDayOfInterval({
      start: firstDayOfCalendar,
      end: lastDayOfCalendar,
    });

    return allDays;
  }, [currentDate]);

  // const calculateDisconnectionDates = useCallback(
  //   (date: Date, businessDays: number) => {
  //     let result = new Date(date);
  //     let daysAdded = 0;

  //     while (daysAdded < businessDays) {
  //       result = addDays(result, 1);

  //       if (!isWeekend(result) && !isHoliday(result)) {
  //         daysAdded++;
  //       }
  //     }

  //     if (isWeekend(result) || isHoliday(result)) {
  //       const daysToAdd = result.getDay() === 0 ? 1 : 2;
  //       result = addDays(result, daysToAdd);
  //     }

  //     return result;
  //   },
  //   [isHoliday],
  // );
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

  const calculateSchedule = useCallback(() => {
    const dates: MeterReadingSchedule[] = [];
    const monthStart = startOfMonth(currentDate);

    let readingDateCount = 1;
    let readingDate = monthStart;
    let dueDate = readingDate;

    // while (isHoliday(readingDate) || isSunday(readingDate)) {
    //   readingDate = adjustForHolidayOrWeekend(readingDate);
    // }

    if (isSunday(readingDate)) {
      readingDate = nextMonday(readingDate);
    }

    dueDate = addDays(readingDate, 15);

    while (isSameMonth(readingDate, monthStart) && readingDateCount < 22) {
      dueDate = adjustForHolidayOrWeekend(dueDate);

      const disconnectionDate = calculateDisconnectionDates(dueDate, 3);

      if (isSunday(readingDate)) {
        readingDate = nextMonday(readingDate);
      }

      dates.push({ readingDate, dueDate, disconnectionDate });

      readingDate = addDays(readingDate, 1);
      dueDate = addDays(dueDate, 1);
      readingDateCount++;
    }

    return dates;
  }, [adjustForHolidayOrWeekend, calculateDisconnectionDates, currentDate]);

  const getFullCalendar = useCallback(
    (dates: MeterReadingSchedule[]) => {
      if (dates.length === 0) return [];

      const allDays = getCalendarDays();

      // Convert to the desired format
      const calendarDays = allDays.map(day => {
        const existingEntry = dates.find(
          entry => formatDate(new Date(entry.readingDate)) === formatDate(day),
        );

        return existingEntry
          ? existingEntry
          : {
              readingDate: day,
              dueDate: undefined,
              disconnectionDate: undefined,
            };
      });

      return calendarDays;
    },
    [getCalendarDays],
  );

  const splitDates = useCallback(
    (dates: MeterReadingSchedule[], selectedDate: Date): MeterReadingSchedule[] => {
      if (!selectedDate) {
        return dates;
      }

      // Perform the filtering
      const leadingDates = dates.filter(entry => entry.readingDate <= selectedDate);
      const trailingDates = dates.filter(entry => entry.readingDate > selectedDate);

      // Early return if we don't have enough dates to perform the operation
      if (leadingDates.length < 2 || trailingDates.length < 1) {
        return dates; // Return the original dates without modifications
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
      const prev = leadingDates[leadingDates.length - 2]!;
      const curr = leadingDates[leadingDates.length - 1]!;
      const next = trailingResults[0]!;

      // Update due dates
      next.dueDate = curr.dueDate;
      curr.dueDate = [prev.dueDate, curr.dueDate] as Date[];

      next.disconnectionDate = curr.disconnectionDate;
      curr.disconnectionDate = [prev.disconnectionDate, curr.disconnectionDate] as Date[];

      return [...leadingDates, ...trailingResults];
    },
    [],
  );

  // Provide navigation methods
  const goToPreviousMonth = () => {
    setCurrentDate(subMonths(currentDate, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1));
  };

  const today = () => {
    setCurrentDate(new Date());
  };

  return {
    getCalendarDays,
    calculateSchedule,
    splitDates,
    getFullCalendar,
    isHoliday,
    formatDate,
    goToPreviousMonth,
    goToNextMonth,
    today,
    setCurrentDate,
    currentDate,
  };
};
