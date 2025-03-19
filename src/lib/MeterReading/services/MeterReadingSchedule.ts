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
  isSameMonth,
  lastDayOfMonth,
} from 'date-fns';

type Holiday = {
  id: string;
  name: string;
  holidayDate: string;
  type: string;
};

type CalendarDay = {
  date: string;
  dueAt: string | string[] | null;
  disconnectAt: string | string[] | null;
};

export class MeterReadingSchedule {
  private currentMonth: number;
  private currentYear: number;
  private holidays: Holiday[];
  public calendarDays: CalendarDay[];

  constructor(currentMonth: number, currentYear: number, holidays: Holiday[]) {
    this.currentMonth = currentMonth;
    this.currentYear = currentYear;
    this.holidays = holidays;
    this.calendarDays = this.getCalendarDays();
  }

  /**
   * Convert holiday string dates to Date objects
   */
  private parseHolidayDates(): Date[] {
    return this.holidays.map(holiday => {
      return parse(holiday.holidayDate, 'MMMM dd, yyyy', new Date());
    });
  }

  private formatDate(date: Date) {
    return format(date, 'yyyy-MM-dd');
  }

  splitDatesExperimental(index: number) {
    const dueDates = this.calculateDueDateExperimental();

    const monthStart = startOfMonth(new Date(this.currentYear, this.currentMonth - 1, 1));

    const monthEnd = endOfMonth(monthStart);

    if (dueDates) {
      const currentDay = dueDates[index]!;

      const previousDay = dueDates[index - 1]!;

      const nextDay = dueDates[index + 1]!;

      dueDates[index + 1]!.dueAt = dueDates[index]!.dueAt;

      dueDates[index]!.dueAt = [previousDay.dueAt, nextDay.dueAt] as string[]; //

      let currentDate = subDays(new Date(currentDay.date), 1);

      // console.log(isSameMonth(currentDate, monthStart));

      let dueDate = addDays(new Date(nextDay.dueAt as string), 1);

      eachDayOfInterval({
        start: nextDay?.date,
        end: monthEnd,
      }).forEach(day => {
        console.log(day);
      });

      // while (isSameMonth(currentDate, monthStart)) {
      //   if (currentDate < monthEnd) {
      //     currentDate = addDays(currentDate, 1);

      //     if (currentDate.getDay() === 0) {
      //       currentDate = addDays(currentDate, 1);
      //     }

      //     if (!this.isHoliday(currentDate)) {
      //       dueDate = addDays(dueDate, 1);
      //     }

      //     if (isWeekend(dueDate)) {
      //       dueDate = this.moveToNextMonday(dueDate);
      //     }

      //     dueDates.push({ date: this.formatDate(currentDate), dueAt: this.formatDate(dueDate) });
      //   }
      // }
    }
  }

  calculateDueDateExperimental() {
    const dueDates: Array<{ date: string; dueAt: string | string[] }> = [];
    const monthStart = startOfMonth(new Date(this.currentYear, this.currentMonth - 1, 1));
    // const monthEnd = endOfMonth(monthStart);
    // const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

    let currentDate = monthStart;
    let dueDate = monthStart;

    while (this.isHoliday(currentDate)) {
      currentDate = this.moveToNextMonday(currentDate);
      dueDate = addDays(currentDate, 15);
      dueDates.push({ date: this.formatDate(currentDate), dueAt: this.formatDate(dueDate) });
    }

    while (isSameMonth(currentDate, monthStart)) {
      currentDate = addDays(currentDate, 1);

      if (currentDate.getDay() === 0) {
        currentDate = addDays(currentDate, 1);
      }

      if (this.isHoliday(currentDate)) {
        dueDate = addDays(dueDate, 1);
      }

      if (isWeekend(dueDate)) {
        dueDate = this.moveToNextMonday(dueDate);
      }

      // if (dueDate instanceof Array) {
      //   console.log('yes');
      // }

      dueDates.push({ date: this.formatDate(currentDate), dueAt: this.formatDate(dueDate) });
    }

    // console.log(isSameMonth(currentDate, monthStart));
    // console.log({ currentDate, monthStart });

    return dueDates;
  }

  calculateDueDate(readingDate: Date, previousDueDates: Set<string>): Date | null {
    if (getDay(readingDate) === 0) return null; // If reading date is Sunday, return null

    if (this.isHoliday(readingDate)) return null;

    let dueDate = addDays(readingDate, 15);

    // Ensure uniqueness: If the due date is already used, shift forward
    while (
      previousDueDates.has(format(dueDate, 'yyyy-MM-dd')) ||
      isWeekend(dueDate) ||
      this.isHoliday(dueDate)
    ) {
      dueDate = addDays(dueDate, 1);
    }

    // Move to next Monday if necessary
    if (isWeekend(dueDate)) {
      dueDate = this.moveToNextMonday(dueDate);
    }

    return dueDate;
  }

  calculateDisconnectionDate(dueDate: Date | null, previousDisconnectionDates: Set<string>): Date | null {
    if (!dueDate) return null; // If due date is null, return null

    let disconnectionDate = dueDate;
    let daysCounted = 0;

    while (daysCounted < 3) {
      disconnectionDate = addDays(disconnectionDate, 1);
      if (!this.isHoliday(disconnectionDate) && !isWeekend(disconnectionDate)) {
        daysCounted++;
      }
    }

    // Ensure uniqueness: If the disconnection date is already used, shift forward
    while (
      previousDisconnectionDates.has(format(disconnectionDate, 'yyyy-MM-dd')) ||
      isWeekend(disconnectionDate) ||
      this.isHoliday(disconnectionDate)
    ) {
      disconnectionDate = addDays(disconnectionDate, 1);
    }

    return disconnectionDate;
  }

  splitDates(selectedCalendarDay: string) {
    const foundIndex = this.calendarDays.findIndex(day => day.date === selectedCalendarDay);

    if (foundIndex === -1) {
      console.warn(`Date ${selectedCalendarDay} not found in the calendar.`);
      return;
    }

    const currentDay = this.calendarDays[foundIndex]!;

    const previousDay = this.calendarDays[foundIndex - 1];

    // const nextDay = this.calendarDays[foundIndex + 1]!;

    // this.calendarDays[foundIndex + 1] = {
    //   ...nextDay,
    //   dueAt: currentDay.dueAt,
    //   disconnectAt: currentDay.disconnectAt,
    // };

    this.calendarDays[foundIndex] = {
      ...currentDay,
      dueAt: [currentDay.dueAt as string, previousDay?.dueAt as string],
      disconnectAt: [currentDay.disconnectAt as string, previousDay?.disconnectAt as string],
    };

    // eachDayOfInterval({
    //   start: nextDay?.date,
    //   end: lastDayOfMonth(new Date().setMonth(new Date(selectedCalendarDay).getMonth())).setFullYear(
    //     this.currentYear,
    //   ),
    // }).forEach(date => {
    //   const subsequentDate = format(date, 'yyyy-MM-dd');

    //   //const index = this.calendarDays.findIndex(day => day.date === subsequentDate);
    //   //this.calculateDueDate(new Date(subsequentDate), new Set<string>());

    //   // if (index) {
    //   //   if (this.calendarDays[index] && this.calendarDays[index - 1]) {
    //   //     this.calendarDays[index]!.dueAt = this.calendarDays[index - 1]!.dueAt;
    //   //   }

    //   //   if (this.calendarDays[index] && this.calendarDays[index - 1]) {
    //   //     this.calendarDays[index]!.disconnectAt = this.calendarDays[index - 1]!.disconnectAt;
    //   //   }
    //   // }
    // });

    console.log({ currentDay, previousDay, calendarDays: this.calendarDays });

    //console.log({ range });
  }

  getCalendarDays(): CalendarDay[] {
    const startDate = startOfMonth(new Date(this.currentYear, this.currentMonth - 1, 1));
    const endDate = endOfMonth(startDate);
    const daysInMonth = eachDayOfInterval({ start: startDate, end: endDate });

    // Determine leading days (previous month)
    const firstDayOfWeek = getDay(startDate);
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

    const previousDueDates = new Set<string>();
    const previousDisconnectionDates = new Set<string>();

    return [
      ...leadingDays.map(day => ({
        date: format(day, 'yyyy-MM-dd'),
        dueAt: null,
        disconnectAt: null,
      })),
      ...daysInMonth.map(day => {
        const dueDate = this.calculateDueDate(day, previousDueDates);
        const disconnectDate = this.calculateDisconnectionDate(dueDate, previousDisconnectionDates);

        if (dueDate) previousDueDates.add(format(dueDate, 'yyyy-MM-dd'));
        if (disconnectDate) previousDisconnectionDates.add(format(disconnectDate, 'yyyy-MM-dd'));

        return {
          date: format(day, 'yyyy-MM-dd'),
          dueAt: dueDate ? format(dueDate, 'yyyy-MM-dd') : null,
          disconnectAt: disconnectDate ? format(disconnectDate, 'yyyy-MM-dd') : null,
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
    return holidayDates.some(holidayDate => isSameDay(format(holidayDate, 'yyyy-MM-dd'), date));
  }

  private moveToNextMonday(date: Date): Date {
    while (isWeekend(date)) {
      date = addDays(date, 1);
    }
    return date;
  }
}
