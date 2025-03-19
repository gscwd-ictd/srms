/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { addDays, format, isSameDay, isSameMonth, isWeekend, parse, startOfMonth } from 'date-fns';
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

  const moveToNextMonday = useCallback((date: Date) => {
    while (isWeekend(date)) {
      date = addDays(date, 1);
    }
    return date;
  }, []);

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
    const dues: string[] = [];
    const monthStart = startOfMonth(new Date(currentYear, currentMonth - 1, 1));
    let currentDate = monthStart;
    let dueDate = monthStart;

    while (isHoliday(currentDate) || currentDate.getDay() === 0) {
      currentDate = addDays(currentDate, 1);
    }

    dueDate = addDays(currentDate, 15);

    while (isSameMonth(currentDate, monthStart)) {
      currentDate = addDays(currentDate, 1);

      if (dueDate.getDay() === 0) {
        dueDate = addDays(currentDate, 1);
      }

      console.log(dueDate);
    }

    //console.log(dues); //
  }, [currentMonth, currentYear, isHoliday]);

  return {
    calculateDueDates,
  };
};
