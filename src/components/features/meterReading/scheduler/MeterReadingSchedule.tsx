'use client';

import { useState, useEffect, type FunctionComponent } from 'react';
import {
  CalendarPlus,
  CalendarX2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  FilePen,
  FilePlus2,
  SquareSplitHorizontal,
  UserPen,
} from 'lucide-react';
import { Button } from '@srms/components/ui/Button';
import { ButtonGroup } from '@srms/components/ui/ButtonGroup';
import { endOfMonth, format, isSameMonth, startOfMonth } from 'date-fns';
import { cn } from '@srms/utils/shadcn';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@srms/components/ui/DropdownMenu';
import { holidays } from './holidays';
import { useMeterReadingSchedule } from './useMeterReadingSchedule';

export const MeterReadingSchedule: FunctionComponent = () => {
  // const meterReadingSchedule = useMeterReadingSchedule(holidays);

  // // Don't recalculate on every render, only when buttons are clicked
  // const [schedule, setSchedule] = useState(() => meterReadingSchedule.calculateSchedule());
  // const [calendarDays, setCalendarDays] = useState(() => meterReadingSchedule.getFullCalendar(schedule));

  // useEffect(() => console.log(calendarDays), [calendarDays]);

  // useEffect(() => {
  //   const newSchedule = meterReadingSchedule.calculateSchedule();
  //   setSchedule(newSchedule);
  //   setCalendarDays(meterReadingSchedule.getFullCalendar(newSchedule));

  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [meterReadingSchedule.currentDate]);

  const scheduler = useMeterReadingSchedule(holidays);
  const [schedule, setSchedule] = useState(scheduler.calculateSchedule());
  const [selectedDatesToSplit, setSelectedDatesToSplit] = useState<Date[]>([]);

  // Example usage:
  const march2025SelectedDates = [
    // new Date(2025, 2, 5), // March 5th
    // new Date(2025, 2, 15), // March 15th
    new Date(2025, 2, 20), // March 25th
    // new Date(2025, 1, 13),
    // new Date(2025, 1, 19),
  ];

  const splitResult = scheduler.splitDates(march2025SelectedDates, schedule);

  console.log({ splitResult, schedule });

  // When the currentDate changes, update the schedule
  useEffect(() => {
    const newSchedule = scheduler.calculateSchedule();
    setSchedule(newSchedule);
  }, [scheduler.currentDate]);

  // Calculate number of rows needed for the calendar
  const numberOfWeeks = Math.ceil(schedule.length / 7);

  // Create grid styles using inline style for dynamic row count
  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(7, minmax(0, 1fr))',
    gridTemplateRows: `repeat(${numberOfWeeks}, minmax(0, 1fr))`,
  };

  return (
    <div className="flex h-full flex-col rounded-2xl border">
      <header className="flex items-center justify-between p-4">
        <section className="flex items-start gap-3">
          <div className="flex size-14 flex-col overflow-clip rounded-lg border">
            <div className="bg-secondary text-secondary-foreground/70 flex flex-1 items-center justify-center border-b text-xs font-semibold tracking-wider uppercase">
              {format(new Date(), 'MMM')}
            </div>

            <div className="flex flex-1 items-center justify-center text-lg font-bold">
              {format(new Date(), 'dd')}
            </div>
          </div>

          <div className="-space-y-1">
            <h1 className="text-lg font-bold">{format(scheduler.currentDate, 'MMMM yyyy')}</h1>

            <section className="text-muted-foreground flex items-center gap-1 text-sm">
              <p>{format(startOfMonth(scheduler.currentDate), 'MMM dd, yyyy')}</p>
              <p>{`-`}</p>
              <p>{format(endOfMonth(scheduler.currentDate), 'MMM dd, yyyy')}</p>
            </section>
          </div>
        </section>

        <section className="flex items-center gap-2">
          <ButtonGroup>
            <Button variant="outline" onClick={() => scheduler.goToPreviousMonth()}>
              <ChevronLeft />
            </Button>
            <Button variant="outline" onClick={() => scheduler.today()}>
              Today
            </Button>
            <Button variant="outline" onClick={() => scheduler.goToNextMonth()}>
              <ChevronRight />
            </Button>
          </ButtonGroup>

          <Button>
            <CalendarPlus />
            Add schedule
          </Button>
        </section>
      </header>

      <main className="flex flex-1 flex-col overflow-hidden">
        <div className="space-x-2 p-2">
          <Button variant="outline" onClick={() => setSchedule(scheduler.addSundayReadings(schedule))}>
            Add Sundays
          </Button>
          <Button variant="outline" onClick={() => setSchedule(scheduler.removeSundayReadings(schedule))}>
            Remove Sundays
          </Button>
        </div>
        <section className="grid grid-cols-7 border-y">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, index) => (
            <div
              key={index}
              className="border-l py-2 text-center text-xs font-semibold uppercase first:border-l-0"
            >
              {day}
            </div>
          ))}
        </section>

        <section className="flex-1" style={gridStyle}>
          {schedule.map((date, index) => {
            const withinThisMonth = isSameMonth(date.readingDate, startOfMonth(scheduler.currentDate));

            return (
              <div
                key={index}
                onClick={() => {
                  const selectedDates = [...selectedDatesToSplit];
                  selectedDates.push(date.readingDate);
                  setSelectedDatesToSplit(selectedDates);
                }}
                className={cn(
                  withinThisMonth ? 'bg-transparent' : 'bg-muted/40 text-muted-foreground/70',
                  'col-span-1 overflow-hidden border-t border-l p-2 text-sm [&:nth-child(-n+7)]:border-t-0 [&:nth-child(7n+1)]:border-l-0',
                )}
              >
                <div className="mb-2 flex items-center justify-between">
                  <section
                    className={cn(
                      format(new Date(), 'MM-dd-yyyy') === format(date.readingDate, 'MM-dd-yyyy')
                        ? 'bg-primary text-primary-foreground rounded-full'
                        : 'bg-transparent',
                      'flex size-7 items-center justify-center text-sm font-semibold',
                    )}
                  >
                    {format(new Date(date.readingDate), 'dd')}
                  </section>
                </div>
                {withinThisMonth && date.dueDate && date.disconnectionDate && (
                  <section className="flex flex-col space-y-1">
                    <div className="bg-muted/30 dark:border-muted border-muted-foreground/10 flex items-center gap-1 rounded border px-2 py-0.5 text-xs">
                      <div className="size-2 rounded-full bg-indigo-400" />
                      {scheduler.formatDate(date.dueDate as Date, 'MMM dd')}
                    </div>

                    <div className="bg-muted/30 dark:border-muted border-muted-foreground/10 flex items-center gap-1 rounded border px-2 py-0.5 text-xs">
                      <div className="size-2 rounded-full bg-rose-400" />
                      {scheduler.formatDate(date.disconnectionDate as Date, 'MMM dd')}
                    </div>
                  </section>
                )}
              </div>
            );
          })}
        </section>
      </main>
    </div>
  );
};
