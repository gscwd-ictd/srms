'use client';

import {
  addDays,
  addMonths,
  compareAsc,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isAfter,
  isBefore,
  isSameMonth,
  isSameYear,
  isSunday,
  isWeekend,
  nextMonday,
  parse,
  startOfMonth,
  startOfWeek,
  subMonths,
} from 'date-fns';
import { useCallback, useEffect, useMemo, useState } from 'react';

type Holiday = {
  id: string;
  name: string;
  holidayDate: string;
  type: string;
};

type DueDate = {
  readingDate: Date;
  dueDate: Date;
};

type DisconnectionDate = {
  readingDate: Date;
  dueDate: Date;
  disconnectionDate: Date;
};

type SplitDate = {
  selectedDate: Date;
  leadingDates: MeterReadingSchedule[];
  trailingDates: MeterReadingSchedule[];
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

  // Utility function to have a uniform format for dates
  const formatDate = (date: Date | undefined, dateFormat?: 'yyyy-MM-dd' | 'MMM dd') => {
    if (!date) return undefined;

    if (!dateFormat) {
      dateFormat = 'yyyy-MM-dd';
    }

    return format(date, dateFormat);
  };

  // Memoize formatted holiday dates for efficient lookups
  const holidayDates = useMemo(
    () =>
      holidays.map(holiday => format(parse(holiday.holidayDate, 'MMMM dd, yyyy', new Date()), 'yyyy-MM-dd')),
    [holidays],
  );

  // Check if a date is a holiday
  const isHoliday = useCallback(
    (date: Date): boolean => holidayDates.includes(formatDate(date) as string),
    [holidayDates],
  );

  const addBusinessDays = useCallback(
    (date: Date, daysToAdd: number) => {
      let daysAdded = 0;

      while (daysAdded < daysToAdd) {
        date = addDays(date, 1);

        if (!isWeekend(date) && !isHoliday(date)) {
          daysAdded++;
        }
      }

      return date;
    },
    [isHoliday],
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

    const calendarDays = eachDayOfInterval({
      start: firstDayOfCalendar,
      end: lastDayOfCalendar,
    });

    return calendarDays;
  }, [currentDate]);

  const getStartingReadingDate = useCallback(() => {
    const monthStart = startOfMonth(currentDate);

    let startOfReadingDate = monthStart;

    //* Use this instead, if starting date requires to skip holidays as well.
    // while (isHoliday(startOfReadingDate) || isSunday(startOfReadingDate)) {
    //   startOfReadingDate = adjustForHolidayOrWeekend(startOfReadingDate);
    // }

    if (isSunday(startOfReadingDate)) {
      startOfReadingDate = nextMonday(startOfReadingDate);
    }

    return { monthStart, startOfReadingDate };
  }, [currentDate]);

  const calculateDueDates = useCallback((): DueDate[] => {
    const { monthStart, startOfReadingDate } = getStartingReadingDate();
    const dueDates: DueDate[] = [];

    let readingDate = startOfReadingDate;
    let dueDate = readingDate;
    let readingCount = 1;

    dueDate = addDays(readingDate, 15);

    while (isSameMonth(readingDate, monthStart) && readingCount < 22) {
      dueDate = adjustForHolidayOrWeekend(dueDate);

      if (isSunday(readingDate)) {
        readingDate = nextMonday(readingDate);
      }

      dueDates.push({ readingDate, dueDate });

      readingDate = addDays(readingDate, 1);
      dueDate = addDays(dueDate, 1);
      readingCount++;
    }

    return dueDates;
  }, [adjustForHolidayOrWeekend, getStartingReadingDate]);

  const calculateDisconnectionDates = useCallback(
    (dueDates: DueDate[]): DisconnectionDate[] => {
      let disconnectionDate = dueDates[0]?.dueDate!;

      const disconnectionDates = dueDates.map((date, index) => {
        if (index === 0) {
          disconnectionDate = addBusinessDays(disconnectionDate, 3);
        } else {
          disconnectionDate = addDays(disconnectionDate, 1);
        }

        disconnectionDate = adjustForHolidayOrWeekend(disconnectionDate);

        return { ...date, disconnectionDate };
      });

      return disconnectionDates;
    },
    [addBusinessDays, adjustForHolidayOrWeekend],
  );

  const calculateSchedule = useCallback((): MeterReadingSchedule[] => {
    const calendarDays = getCalendarDays();
    const dueDates = calculateDueDates();
    const disconnectionDates = calculateDisconnectionDates(dueDates);

    const schedule = calendarDays.map(date => {
      const existingEntry = disconnectionDates.find(
        dateEntry => formatDate(dateEntry.readingDate) === formatDate(date),
      );

      return existingEntry
        ? existingEntry
        : {
            readingDate: date,
            dueDate: undefined,
            disconnectionDate: undefined,
          };
    });

    return schedule;
  }, [calculateDisconnectionDates, calculateDueDates, getCalendarDays]);

  // TODO: Check if selected date is 1 day before the already selected date
  const splitDates = useCallback((selectedDates: Date[], schedule: MeterReadingSchedule[]): SplitDate[] => {
    // Sort the selected dates chronologically
    const sortedSelectedDates = [...selectedDates].sort(compareAsc);

    // Result array
    const result: SplitDate[] = [];

    // Process each selected date
    for (let i = 0; i < sortedSelectedDates.length; i++) {
      const currentSelectedDate = sortedSelectedDates[i]!;
      const previousSelectedDate = sortedSelectedDates[i - 1]; // Will be undefined for the first date
      const nextSelectedDate = sortedSelectedDates[i + 1]; // Will be undefined for the last date

      // Initialize the leading and trailing schedule arrays
      const leadingDates: MeterReadingSchedule[] = [];
      const trailingDates: MeterReadingSchedule[] = [];

      // Get leading dates (all schedule items after the previous selected date until the current selected date)
      schedule.forEach(item => {
        const itemDate = item.readingDate;
        if (isBefore(itemDate, currentSelectedDate)) {
          // If there's a previous selected date, only include dates after it
          if (previousSelectedDate) {
            if (isAfter(itemDate, previousSelectedDate)) {
              leadingDates.push(item);
            }
          }
          // If this is the first selected date, include all dates from the beginning of the month
          else {
            if (isSameMonth(itemDate, currentSelectedDate) && isSameYear(itemDate, currentSelectedDate)) {
              leadingDates.push(item);
            }
          }
        }
      });

      // Sort leading dates chronologically
      leadingDates.sort((a, b) => compareAsc(a.readingDate, b.readingDate));

      // Get trailing dates (all schedule items after the selected date until the next selected date)
      const potentialTrailingDates: MeterReadingSchedule[] = [];

      schedule.forEach(item => {
        const itemDate = item.readingDate;
        if (isAfter(itemDate, currentSelectedDate)) {
          // If there's a next selected date, only include dates before it
          if (nextSelectedDate) {
            if (isBefore(itemDate, nextSelectedDate)) {
              potentialTrailingDates.push(item);
            }
          }
          // If this is the last selected date, include all remaining dates in the same month
          else {
            if (isSameMonth(itemDate, currentSelectedDate) && isSameYear(itemDate, currentSelectedDate)) {
              potentialTrailingDates.push(item);
            }
          }
        }
      });

      // Sort the potential trailing dates chronologically
      potentialTrailingDates.sort((a, b) => compareAsc(a.readingDate, b.readingDate));

      // Process trailing dates with the special rules
      if (potentialTrailingDates.length > 0) {
        // First, handle each trailing date independently, looking back to its own previous date
        for (let i = 0; i < potentialTrailingDates.length; i++) {
          const currentItem = potentialTrailingDates[i]!;

          // 1. Check if the current item's readingDate is a Sunday (day 0)
          const isSunday = currentItem.readingDate.getDay() === 0;

          // For Sundays, always set dueDate and disconnectionDate to undefined
          if (isSunday) {
            const modifiedItem = {
              ...currentItem,
              dueDate: undefined,
              disconnectionDate: undefined,
            };
            trailingDates.push(modifiedItem);
            continue;
          }

          // 2. If both dueDate AND disconnectionDate are undefined, keep them as is
          if (currentItem.dueDate === undefined && currentItem.disconnectionDate === undefined) {
            trailingDates.push({ ...currentItem });
            continue;
          }

          // 3. For dates with defined values, look back for previous non-Sunday date with defined values
          // This time we'll look back to the date immediately before the current one, not comparing by date values

          // Find the schedule item from the previous day
          const previousDate = new Date(currentItem.readingDate);
          previousDate.setDate(previousDate.getDate() - 1);

          let previousItem = schedule.find(
            item =>
              item.readingDate.getFullYear() === previousDate.getFullYear() &&
              item.readingDate.getMonth() === previousDate.getMonth() &&
              item.readingDate.getDate() === previousDate.getDate(),
          );

          // If previous day is a Sunday or has undefined values, look back further
          if (
            !previousItem ||
            previousDate.getDay() === 0 ||
            (previousItem.dueDate === undefined && previousItem.disconnectionDate === undefined)
          ) {
            // Look back up to 31 days to find a suitable item
            let lookbackDays = 2; // Start with 2 days back (already checked 1)

            while (lookbackDays <= 31) {
              const earlierDate = new Date(currentItem.readingDate);
              earlierDate.setDate(earlierDate.getDate() - lookbackDays);

              // Skip if the date is a Sunday
              if (earlierDate.getDay() !== 0) {
                const earlierItem = schedule.find(
                  item =>
                    item.readingDate.getFullYear() === earlierDate.getFullYear() &&
                    item.readingDate.getMonth() === earlierDate.getMonth() &&
                    item.readingDate.getDate() === earlierDate.getDate(),
                );

                if (
                  earlierItem &&
                  (earlierItem.dueDate !== undefined || earlierItem.disconnectionDate !== undefined)
                ) {
                  previousItem = earlierItem;
                  break;
                }
              }

              lookbackDays++;
            }
          }

          // Copy values from the previous item (if found)
          if (
            previousItem &&
            (previousItem.dueDate !== undefined || previousItem.disconnectionDate !== undefined)
          ) {
            const modifiedItem = {
              ...currentItem,
              dueDate: previousItem.dueDate,
              disconnectionDate: previousItem.disconnectionDate,
            };
            trailingDates.push(modifiedItem);
          } else {
            // If no valid previous item was found, keep original values
            trailingDates.push({ ...currentItem });
          }
        }
      }

      // Add this entry to the result
      result.push({
        selectedDate: currentSelectedDate,
        leadingDates,
        trailingDates,
      });
    }

    return result;
  }, []);

  const addSundayReadings = useCallback((schedule: MeterReadingSchedule[]) => {
    // Create a new array to avoid mutating the original
    const updatedSchedule = [...schedule];

    for (let i = 1; i < updatedSchedule.length; i++) {
      const currentReading = updatedSchedule[i]!;
      const previousReading = updatedSchedule[i - 1]!;

      // Parse dates
      const currentDate = currentReading.readingDate;
      const previousDate = previousReading.readingDate;

      // Check if current reading is on a Sunday and is in the same month as previous reading
      if (isSunday(currentDate) && isSameMonth(currentDate, previousDate)) {
        // Copy dueDate and disconnectionDate from previous reading
        currentReading.dueDate = previousReading.dueDate;
        currentReading.disconnectionDate = previousReading.disconnectionDate;
      }
    }

    return updatedSchedule;
  }, []);

  const removeSundayReadings = (schedule: MeterReadingSchedule[]) => {
    // Create a new array to avoid mutating the original
    const updatedSchedule = [...schedule];

    for (let i = 1; i < updatedSchedule.length; i++) {
      const currentReading = updatedSchedule[i]!;
      const previousReading = updatedSchedule[i - 1]!;

      // Parse dates
      const currentDate = currentReading.readingDate;
      const previousDate = previousReading.readingDate;

      // Check if current reading is on a Sunday and is in the same month as previous reading
      if (isSunday(currentDate) && isSameMonth(currentDate, previousDate)) {
        // Reset dueDate and disconnectionDate for Sunday readings
        currentReading.dueDate = undefined;
        currentReading.disconnectionDate = undefined;
      }
    }

    return updatedSchedule;
  };

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
    calculateSchedule,
    addSundayReadings,
    removeSundayReadings,
    splitDates,
    formatDate,
    goToPreviousMonth,
    goToNextMonth,
    today,
    currentDate,
  };
};
