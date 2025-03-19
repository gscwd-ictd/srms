/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import {
  addDays,
  format,
  isSameDay,
  isSameMonth,
  isSunday,
  isWeekend,
  nextMonday,
  parse,
  startOfMonth,
} from 'date-fns';
import { useCallback, useEffect, useMemo, useState } from 'react';

type Holiday = {
  id: string;
  name: string;
  holidayDate: string;
  type: string;
};

export const useCalendar = (holidays: Holiday[], month?: number, year?: number) => {
  const [currentMonth, setCurrentMonth] = useState(month ?? new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(year ?? new Date().getFullYear());

  const formatDate = (date: Date) => {
    return format(date, 'yyyy-MM-dd');
  };

  const holidayDates = useMemo(
    () =>
      holidays.map(holiday => format(parse(holiday.holidayDate, 'MMMM dd, yyyy', new Date()), 'yyyy-MM-dd')),
    [holidays],
  );

  const adjustForHolidayOrWeekend = (date: Date) => {
    while (isWeekend(date) || isHoliday(date)) {
      if (isWeekend(date)) {
        date = nextMonday(date);
      } else {
        date = addDays(date, 1);
      }
    }
    return date;
  };

  const adjustForHolidayOrSunday = (date: Date) => {
    if (isSunday(date) || isHoliday(date)) {
      date = addDays(date, 1);
    }

    return date;
  };

  const isHoliday = useCallback(
    (date: Date) => holidayDates.some(holidayDate => isSameDay(format(holidayDate, 'yyyy-MM-dd'), date)),
    [holidayDates],
  );

  // Update month and year if props change
  useEffect(() => {
    if (month !== undefined) {
      setCurrentMonth(month);
    }
    if (year !== undefined) {
      setCurrentYear(year);
    }
  }, [month, year]);

  const calculateDueDates = useCallback(() => {
    const dueDates = [];
    const monthStart = startOfMonth(new Date(currentYear, currentMonth));
    let currentDate = monthStart;
    let dueDate = monthStart;

    while (isHoliday(currentDate) || isSunday(currentDate)) {
      currentDate = adjustForHolidayOrWeekend(currentDate);
    }

    dueDate = addDays(currentDate, 15);

    while (isSameMonth(currentDate, monthStart)) {
      dueDate = adjustForHolidayOrWeekend(dueDate);

      currentDate = adjustForHolidayOrSunday(currentDate);

      dueDates.push({ currentDate, dueDate });

      currentDate = addDays(currentDate, 1);
      dueDate = addDays(dueDate, 1);
    }

    return dueDates;
  }, [currentMonth, currentYear, isHoliday]);

  const splitDates = useCallback((selectedDate: Date, dates: Array<{ currentDate: Date; dueDate: Date }>) => {
    const leadingDates = dates
      .filter(entry => new Date(entry.currentDate) <= selectedDate)
      .map(entry => ({ ...entry })); // Ensure we don't mutate the original array

    // Filter dates greater than selectedDate
    const trailingDates = dates
      .filter(entry => new Date(entry.currentDate) > selectedDate)
      .map(entry => ({ ...entry })); // Ensure we don't mutate the original array

    const result = [...trailingDates];

    // Store the original due dates
    const originalDueDates = trailingDates.map(item => item.dueDate);

    // Iterate starting from index 1 (second element)
    for (let i = 1; i < result.length; i++) {
      // Use the non-null assertion operator since we know i-1 is valid
      // (we start at i=1 and we've checked arr.length > 1)
      result[i]!.dueDate = originalDueDates[i - 1]!;
    }

    const previousDate = leadingDates[leadingDates.length - 2]!;
    const currentDate = leadingDates[leadingDates.length - 1]!;
    const nextDate = trailingDates[0]!;

    nextDate.dueDate = currentDate.dueDate;
    currentDate.dueDate = [formatDate(previousDate.dueDate), formatDate(currentDate.dueDate)] as string[];

    return [...leadingDates, ...result];
  }, []);

  return {
    calculateDueDates,
    splitDates,
    formatDate,
  };
};
