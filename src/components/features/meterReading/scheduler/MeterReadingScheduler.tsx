'use client';

import { type FunctionComponent } from 'react';
import { CalendarPlus, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@srms/components/ui/Button';
import { ButtonGroup } from '@srms/components/ui/ButtonGroup';
import { endOfMonth, format, isSameMonth, startOfMonth } from 'date-fns';
import { CalendarDayCell } from './CalendarDayCell';
import { useMeterReadingSchedulerProvider } from './MeterReadingSchedulerProvider';

export const MeterReadingScheduler: FunctionComponent = () => {
  const { schedule, scheduler, setDatesToSplit } = useMeterReadingSchedulerProvider();

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
            <Button
              variant="outline"
              onClick={() => {
                scheduler.goToPreviousMonth();
                setDatesToSplit([]);
              }}
            >
              <ChevronLeft />
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                scheduler.today();
                setDatesToSplit([]);
              }}
            >
              Today
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                scheduler.goToNextMonth();
                setDatesToSplit([]);
              }}
            >
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
          {schedule.map((date, index) => {
            const isWithinMonth = isSameMonth(date.readingDate, startOfMonth(scheduler.currentDate));

            return <CalendarDayCell key={index} date={date} isWithinMonth={isWithinMonth} />;
          })}
        </section>
      </main>
    </div>
  );
};
