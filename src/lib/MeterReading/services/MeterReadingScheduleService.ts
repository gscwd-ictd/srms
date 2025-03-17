import { addDays, format, getDay, parse } from 'date-fns';

type Holiday = {
  id: string;
  name: string;
  holidayDate: string;
  type: string;
};

export class MeterReadingSchedule {
  private holidayDates: string[];

  constructor(private readonly holidays: Holiday[]) {
    this.holidayDates = holidays.map(holiday =>
      format(parse(holiday.holidayDate, 'MMMM dd, yyyy', new Date()), 'yyyy-MM-dd'),
    );
  }

  private isWeekEnd(day: number) {
    if (day === 0) {
      return true;
    }

    if (day === 6) {
      return true;
    }

    return false;
  }

  public calculateDueDate(readingDate: Date) {
    let dueDate = readingDate;

    let count = 0;

    while (count < 15) {
      dueDate = addDays(dueDate, 1);
      const dueDay = getDay(dueDate);

      if (!this.holidayDates.includes(format(dueDate, 'yyyy-MM-dd')) || !this.isWeekEnd(dueDay)) {
        count++;
      }
    }

    const dueDay = getDay(dueDate);

    if (dueDay === 6) {
      // If Saturday, move to Monday
      dueDate = addDays(dueDate, 2);
    } else if (dueDay === 0) {
      // If Sunday, move to Monday
      dueDate = addDays(dueDate, 1);
    }

    return format(dueDate, 'yyyy-MM-dd');
  }

  public calculateDisconnectionDate(dueDate: Date) {
    let disconnectionDate = dueDate;
    let count = 0;

    while (count < 3) {
      disconnectionDate = addDays(disconnectionDate, 1);
      const disconnectionDay = getDay(disconnectionDate);

      if (
        !this.holidayDates.includes(format(disconnectionDate, 'yyyy-MM-dd')) ||
        !this.isWeekEnd(disconnectionDay)
      ) {
        count++;
      }
    }

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

    return format(disconnectionDate, 'yyyy-MM-dd');
  }
}
