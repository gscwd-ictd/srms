'use client';

import {
  addDays,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  getDay,
  isSameMonth,
  parseISO,
  startOfMonth,
  startOfWeek,
} from 'date-fns';
import { useEffect, useState, useMemo } from 'react';

export type CalendarDay = {
  date: string;
  dueAt: string | undefined;
  disconnectAt: string | undefined;
};

type UseCalendarHook = {
  calendarDays: CalendarDay[];
  month: string;
  year: number;
  week: string[];
  getLeadingDays: () => string[];
  getTrailingDays: () => string[];
  goToPreviousMonth: () => void;
  goToNextMonth: () => void;
  getCurrentMonthRange: () => {
    monthStart: Date;
    monthEnd: Date;
  };
  getRestDays: (restDay: 0 | 6) => string[];
  getWorkingDays: (restDay: 0 | 6) => string[];
  today: () => void;
};

export const useCalendarDays = (month?: number, year?: number): UseCalendarHook => {
  const [currentYear, setCurrentYear] = useState(year ?? new Date().getFullYear());
  const [currentMonth, setCurrentMonth] = useState(month ?? new Date().getMonth());
  const [calendarDays, setCalendarDays] = useState<CalendarDay[]>([]);

  // Update month and year if props change
  useEffect(() => {
    if (month !== undefined) {
      setCurrentMonth(month);
    }
    if (year !== undefined) {
      setCurrentYear(year);
    }
  }, [month, year]);

  // Pure functions for date calculations - defined before they're used
  const calculateDueDate = (day: Date): string => {
    let dueDate = addDays(day, 15);
    const dueDay = getDay(dueDate);

    // Adjust for weekends
    if (dueDay === 6) {
      // Saturday
      dueDate = addDays(dueDate, 2);
    } else if (dueDay === 0) {
      // Sunday
      dueDate = addDays(dueDate, 1);
    }

    return format(dueDate, 'yyyy-MM-dd');
  };

  const calculateDisconnectionDate = (dueDate: Date): string => {
    let disconnectionDate = addDays(dueDate, 3);
    const disconnectionDay = getDay(disconnectionDate);

    // Adjust for weekends and Friday (to avoid weekend disconnections)
    if (disconnectionDay === 5) {
      // Friday
      disconnectionDate = addDays(disconnectionDate, 3);
    } else if (disconnectionDay === 6) {
      // Saturday
      disconnectionDate = addDays(disconnectionDate, 2);
    } else if (disconnectionDay === 0) {
      // Sunday
      disconnectionDate = addDays(disconnectionDate, 1);
    }

    return format(disconnectionDate, 'yyyy-MM-dd');
  };

  /**
   * Calculate a date that is 21 working days from the start of the month,
   * excluding the specified rest day (either Saturday or Sunday)
   * @param restDay - Day to exclude: 6 for Saturday, 0 for Sunday
   * @returns Date object representing the 21st working day
   */
  const getRestDays = (restDay: 0 | 6): string[] => {
    const startOfCurrentMonth = startOfMonth(new Date(currentYear, currentMonth));
    const endOfCurrentMonth = endOfMonth(new Date(currentYear, currentMonth));

    // Find the 22nd working day
    let currentDate = startOfCurrentMonth;
    let workingDaysCount = 0;

    // Count until we reach 21 working days (the day before our start date)
    while (workingDaysCount < 21) {
      // Check if current day is not the rest day
      if (getDay(currentDate) !== restDay) {
        workingDaysCount++;
      }

      // Move to next day if we haven't reached 21 yet
      if (workingDaysCount < 21) {
        currentDate = addDays(currentDate, 1);
      }
    }

    // currentDate is now the 21st working day
    // Move to the 22nd working day (might need to skip the rest day)
    do {
      currentDate = addDays(currentDate, 1);
    } while (getDay(currentDate) === restDay);

    // Generate the range from 22nd working day to end of month
    const daysInRange = eachDayOfInterval({
      start: currentDate,
      end: endOfCurrentMonth,
    });

    // Filter out rest days
    const restDays = daysInRange.filter(date => getDay(date) !== restDay);

    return restDays.map(day => format(day, 'yyyy-MM-dd'));
  };

  /**
   * Calculate a range of dates from the start of the month to the 21st working day,
   * excluding the specified rest day (either Saturday or Sunday)
   * @param restDay - Day to exclude: 6 for Saturday, 0 for Sunday
   * @returns Array of Date objects representing the range (start of month to 21st working day)
   */
  const getWorkingDays = (restDay: 0 | 6): string[] => {
    const startOfCurrentMonth = startOfMonth(new Date(currentYear, currentMonth));

    // Find the 21st working day
    let currentDate = startOfCurrentMonth;
    let workingDaysCount = 0;
    let day21: Date | null = null;

    // Generate all dates until we reach the 21st working day
    while (workingDaysCount < 21) {
      // Only count if not a rest day
      if (getDay(currentDate) !== restDay) {
        workingDaysCount++;

        // Save the 21st working day when we reach it
        if (workingDaysCount === 21) {
          day21 = new Date(currentDate);
          break;
        }
      }

      // Move to the next day if we haven't reached 21 yet
      if (workingDaysCount < 21) {
        currentDate = addDays(currentDate, 1);
      }
    }

    if (!day21) {
      return []; // Should never happen unless the month is too short
    }

    // Generate the range from start of month to 21st working day
    const daysInRange = eachDayOfInterval({
      start: startOfCurrentMonth,
      end: day21,
    });

    // Filter out rest days
    const workingDays = daysInRange.filter(date => getDay(date) !== restDay);

    return workingDays.map(day => format(day, 'yyyy-MM-dd'));
  };

  // Memoize calendar days calculation
  const calculatedCalendarDays = useMemo(() => {
    const monthStart = startOfMonth(new Date(currentYear, currentMonth));
    const monthEnd = endOfMonth(monthStart);
    const calendarStart = startOfWeek(monthStart);
    const calendarEnd = endOfWeek(monthEnd);

    // Generate all days within the interval
    const days = eachDayOfInterval({
      start: calendarStart,
      end: calendarEnd,
    });

    // Create detailed day objects
    return days.map(date => {
      const formattedDate = format(date, 'yyyy-MM-dd');
      const isInCurrentMonth = isSameMonth(date, monthStart);

      // Only calculate dates for current month
      if (!isInCurrentMonth) {
        return {
          date: formattedDate,
          dueAt: undefined,
          disconnectAt: undefined,
        };
      }

      const dueDate = calculateDueDate(date);
      const dueDateObj = parseISO(dueDate);
      const disconnectionDate = calculateDisconnectionDate(dueDateObj);

      return {
        date: formattedDate,
        dueAt: dueDate,
        disconnectAt: disconnectionDate,
      };
    });
  }, [currentMonth, currentYear]);

  // Update state when memoized value changes
  useEffect(() => {
    setCalendarDays(calculatedCalendarDays);
  }, [calculatedCalendarDays]);

  // Get current month name
  const currentMonthName = useMemo(() => {
    return format(new Date(currentYear, currentMonth), 'MMMM');
  }, [currentMonth, currentYear]);

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

  const getLeadingDays = () => {
    const monthStart = startOfMonth(new Date(currentYear, currentMonth)); // month is 0-based

    return calendarDays
      .filter(day => !isSameMonth(day.date, monthStart) && new Date(day.date) < monthStart)
      .map(day => day.date);
  };

  const getTrailingDays = () => {
    const monthStart = startOfMonth(new Date(currentYear, currentMonth)); // month is 0-based
    const monthEnd = endOfMonth(monthStart);

    return calendarDays
      .filter(day => !isSameMonth(day.date, monthStart) && new Date(day.date) > monthEnd)
      .map(day => day.date);
  };

  const getCurrentMonthRange = () => {
    const monthStart = startOfMonth(new Date(currentYear, currentMonth)); // month is 0-based
    const monthEnd = endOfMonth(monthStart);

    return { monthStart, monthEnd };
  };

  // Return data and utility functions
  return {
    calendarDays,
    month: currentMonthName,
    year: currentYear,
    week: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    getLeadingDays,
    getTrailingDays,
    goToPreviousMonth,
    goToNextMonth,
    getCurrentMonthRange,
    getRestDays,
    getWorkingDays,
    today,
  };
};
