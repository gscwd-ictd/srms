import {
  addDays,
  isWeekend,
  parse,
  format,
  isSameDay,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  getDay,
  subDays,
} from 'date-fns';

type Holiday = {
  id: string;
  name: string;
  holidayDate: string;
  type: string;
};

export class MeterReadingSchedule {
  private currentMonth: number;
  private currentYear: number;
  private holidays: Holiday[];

  constructor(currentMonth: number, currentYear: number, holidays: Holiday[]) {
    this.currentMonth = currentMonth;
    this.currentYear = currentYear;
    this.holidays = holidays;
  }

  /**
   * Convert holiday string dates to Date objects
   */
  private parseHolidayDates(): Date[] {
    return this.holidays.map(holiday => {
      return parse(holiday.holidayDate, 'MMMM dd, yyyy', new Date());
    });
  }

  calculateDueDate(readingDate: Date): Date {
    let dueDate = addDays(readingDate, 15);

    // Skip holidays and weekends
    while (this.isHoliday(dueDate) || isWeekend(dueDate)) {
      dueDate = addDays(dueDate, 1);
    }

    // If due date falls on weekend, move to next Monday
    if (isWeekend(dueDate)) {
      dueDate = this.moveToNextMonday(dueDate);
    }

    return dueDate;
  }

  calculateDisconnectionDate(dueDate: Date): Date {
    let disconnectionDate = dueDate;
    let daysCounted = 0;

    while (daysCounted < 3) {
      disconnectionDate = addDays(disconnectionDate, 1);
      if (!this.isHoliday(disconnectionDate) && !isWeekend(disconnectionDate)) {
        daysCounted++;
      }
    }

    // If it falls on a weekend, move to the next weekday
    if (isWeekend(disconnectionDate)) {
      disconnectionDate = this.moveToNextMonday(disconnectionDate);
    }

    return disconnectionDate;
  }

  getCalendarDays(): {
    date: string;
    dueAt: string | null;
    disconnectAt: string | null;
  }[] {
    const startDate = startOfMonth(new Date(this.currentYear, this.currentMonth - 1, 1));
    const endDate = endOfMonth(startDate);
    const daysInMonth = eachDayOfInterval({ start: startDate, end: endDate });

    // Determine leading days (previous month)
    const firstDayOfWeek = getDay(startDate); // 0 = Sunday, 6 = Saturday
    const leadingDays = [];
    if (firstDayOfWeek !== 0) {
      const prevMonthEndDate = subDays(startDate, 1);
      const prevMonthStartDate = subDays(prevMonthEndDate, firstDayOfWeek - 1);
      leadingDays.push(...eachDayOfInterval({ start: prevMonthStartDate, end: prevMonthEndDate }));
    }

    // Determine trailing days (next month)
    const lastDayOfWeek = getDay(endDate);
    const trailingDays = [];
    if (lastDayOfWeek !== 6) {
      const nextMonthStartDate = addDays(endDate, 1);
      const nextMonthEndDate = addDays(nextMonthStartDate, 6 - lastDayOfWeek);
      trailingDays.push(...eachDayOfInterval({ start: nextMonthStartDate, end: nextMonthEndDate }));
    }

    // Map all days into a structured format
    return [
      ...leadingDays.map(day => ({
        date: format(day, 'yyyy-MM-dd'),
        dueAt: null,
        disconnectAt: null,
      })),
      ...daysInMonth.map(day => {
        const dueDate = this.calculateDueDate(day);
        const disconnectDate = this.calculateDisconnectionDate(dueDate);
        return {
          date: format(day, 'yyyy-MM-dd'),
          dueAt: format(dueDate, 'yyyy-MM-dd'),
          disconnectAt: format(disconnectDate, 'yyyy-MM-dd'),
        };
      }),
      ...trailingDays.map(day => ({
        date: format(day, 'yyyy-MM-dd'),
        dueAt: null,
        disconnectAt: null,
      })),
    ];
  }

  /**
   * Check if a date is a holiday
   */
  private isHoliday(date: Date): boolean {
    const holidayDates = this.parseHolidayDates();
    return holidayDates.some(holidayDate => isSameDay(holidayDate, date));
  }

  private moveToNextMonday(date: Date): Date {
    while (isWeekend(date)) {
      date = addDays(date, 1);
    }
    return date;
  }
}
