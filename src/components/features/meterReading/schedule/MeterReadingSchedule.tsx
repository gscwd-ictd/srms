'use client';

import { useState, useEffect, type FunctionComponent } from 'react';
import { CalendarPlus, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@srms/components/ui/Button';
import { ButtonGroup } from '@srms/components/ui/ButtonGroup';
import { holidays } from '../../meterReadingSchedule/CalendarGrid';
import { endOfMonth, format, startOfMonth } from 'date-fns';
import { useMeterReadingSchedule } from '@srms/components/hooks/useMeterReadingSchedule';
import { cn } from '@srms/utils/shadcn';

export const MeterReadingSchedule: FunctionComponent = () => {
  const meterReadingSchedule = useMeterReadingSchedule(holidays);

  // Don't recalculate on every render, only when buttons are clicked
  const [schedule, setSchedule] = useState(() => meterReadingSchedule.calculateSchedule());
  const [calendarDays, setCalendarDays] = useState(() => meterReadingSchedule.getFullCalendar(schedule));

  useEffect(() => console.log(calendarDays), [calendarDays]);

  useEffect(() => {
    const newSchedule = meterReadingSchedule.calculateSchedule();
    setSchedule(newSchedule);
    setCalendarDays(meterReadingSchedule.getFullCalendar(newSchedule));

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [meterReadingSchedule.currentDate]);

  // Calculate number of rows needed for the calendar
  const numberOfWeeks = Math.ceil(calendarDays.length / 7);

  // Create grid styles using inline style for dynamic row count
  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(7, minmax(0, 1fr))',
    gridTemplateRows: `repeat(${numberOfWeeks}, minmax(0, 1fr))`,
  };

  return (
    <div className="flex h-full flex-col rounded-2xl border">
      <header className="flex items-center justify-between p-4">
        <section className="flex items-center gap-3">
          <div className="flex size-15 flex-col overflow-clip rounded-lg border">
            <div className="bg-primary text-primary-foreground flex flex-1 items-center justify-center border-b text-sm font-bold tracking-wider uppercase">
              {format(new Date(), 'MMM')}
            </div>

            <div className="flex flex-1 items-center justify-center text-lg font-bold">
              {format(new Date(), 'dd')}
            </div>
          </div>

          <div>
            <h1 className="text-xl font-bold">{format(meterReadingSchedule.currentDate, 'MMMM yyyy')}</h1>

            <section className="text-muted-foreground flex items-center gap-1">
              <p>{format(startOfMonth(meterReadingSchedule.currentDate), 'MMM dd, yyyy')}</p>
              <p>{`-`}</p>
              <p>{format(endOfMonth(meterReadingSchedule.currentDate), 'MMM dd, yyyy')}</p>
            </section>
          </div>
        </section>

        <section className="flex items-center gap-2">
          <ButtonGroup>
            <Button variant="outline" onClick={() => meterReadingSchedule.goToPreviousMonth()}>
              <ChevronLeft />
            </Button>
            <Button variant="outline" onClick={() => meterReadingSchedule.today()}>
              Today
            </Button>
            <Button variant="outline" onClick={() => meterReadingSchedule.goToNextMonth()}>
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
          {calendarDays.map((date, index) => {
            return (
              <div
                key={index}
                role="button"
                // onClick={() => {
                //   const newSchedule = meterReadingSchedule.splitDates(schedule, date.readingDate);
                //   setSchedule(newSchedule);
                //   setCalendarDays(meterReadingSchedule.getFullCalendar(newSchedule));
                // }}
                className="col-span-1 overflow-hidden border-t border-l p-2 text-sm [&:nth-child(-n+7)]:border-t-0 [&:nth-child(7n+1)]:border-l-0"
              >
                <div className="flex items-center justify-between">
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

                  <section>
                    <button
                      onClick={() => console.log(date)}
                      className="hover:bg-secondary text-muted-foreground hover:text-primary flex size-8 items-center justify-center rounded-full"
                    >
                      <ChevronDown className="size-4" />
                    </button>
                  </section>
                </div>

                {/* <section className="pt-2">
                  {Array.isArray(date.dueDate) && Array.isArray(date.disconnectionDate) ? (
                    <div className="space-y-2">
                      <section className="flex items-center gap-2">
                        {date.dueDate.map((dueAt, index) => (
                          <div
                            key={index}
                            className="flex w-full items-center gap-1 rounded-md border px-2 py-1"
                          >
                            <p>{format(dueAt, 'MMM dd')}</p>
                          </div>
                        ))}
                      </section>

                      <section className="flex items-center gap-2">
                        {date.disconnectionDate.map((disconnectAt, index) => (
                          <div
                            key={index}
                            className="flex w-full items-center gap-1 rounded-md border px-2 py-1"
                          >
                            <p>{format(disconnectAt, 'MMM dd')}</p>
                          </div>
                        ))}
                      </section>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div
                        className={cn(
                          !date.dueDate && !date.disconnectionDate
                            ? 'bg-transparent'
                            : 'flex w-full items-center gap-1 rounded-md border px-2 py-1',
                        )}
                      >
                        <p>{mrSched.formatDate(date.dueDate as Date, 'MMM dd')}</p>
                      </div>

                      <div
                        className={cn(
                          !date.dueDate && !date.disconnectionDate
                            ? 'bg-transparent'
                            : 'flex w-full items-center gap-1 rounded-md border px-2 py-1',
                        )}
                      >
                        <p>{mrSched.formatDate(date.disconnectionDate as Date, 'MMM dd')}</p>
                      </div>
                    </div>
                  )}
                </section> */}
              </div>
            );
          })}
        </section>
      </main>
    </div>
  );
};
