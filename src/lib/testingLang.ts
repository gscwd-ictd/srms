import { addDays, isWeekend, nextMonday, format, isSameDay } from 'date-fns';

type DueDatesMap = { [key: string]: string[] };

const HOLIDAYS: string[] = [
  '2025-03-31',
  '2025-04-01', // Example holiday
  '2025-04-10', // Example holiday
];

function adjustForWeekendOrHoliday(date: Date): Date {
  while (isWeekend(date) || HOLIDAYS.includes(format(date, 'yyyy-MM-dd'))) {
    if (isWeekend(date)) {
      date = nextMonday(date);
    } else {
      date = addDays(date, 1);
    }
  }
  return date;
}

export function calculateDueDates(year: number, month: number): DueDatesMap {
  const dueDates: DueDatesMap = {};
  let previousDueDate: Date | null = null;

  for (let day = 1; day <= 31; day++) {
    const currentDate = new Date(year, month - 1, day);
    if (currentDate.getMonth() !== month - 1) break; // Ensure valid days
    if (currentDate.getDay() === 0) continue; // Skip Sundays

    let dueDate = addDays(currentDate, 15);
    dueDate = adjustForWeekendOrHoliday(dueDate);

    if (previousDueDate && isSameDay(dueDate, previousDueDate)) {
      dueDate = adjustForWeekendOrHoliday(addDays(dueDate, 1));
    }

    const formattedDueDate = format(dueDate, 'yyyy-MM-dd');
    dueDates[format(currentDate, 'yyyy-MM-dd')] = [formattedDueDate];
    previousDueDate = dueDate;
  }
  return dueDates;
}

export function splitDates(selectedDate: Date, dueDates: DueDatesMap): string[] {
  const formattedDate = format(selectedDate, 'yyyy-MM-dd');
  if (!dueDates[formattedDate]) return [];

  const currentDueDate = dueDates[formattedDate][0];
  const previousMonth = new Date(selectedDate);
  previousMonth.setMonth(previousMonth.getMonth() - 1);
  const previousMonthDueDate = dueDates[format(previousMonth, 'yyyy-MM-dd')]?.[0];

  const splitDueDates = previousMonthDueDate ? [previousMonthDueDate, currentDueDate] : [currentDueDate];
  let adjustedDates: string[] = [];

  splitDueDates.forEach(dateStr => {
    let date = new Date(dateStr as string);
    date = adjustForWeekendOrHoliday(addDays(date, -1));
    adjustedDates.push(format(date, 'yyyy-MM-dd'));
  });

  return adjustedDates;
}
