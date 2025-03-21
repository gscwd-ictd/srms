'use client';

import { type FunctionComponent } from 'react';
import { CalendarPlus, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '../../../ui/Button';
import { ButtonGroup } from '../../../ui/ButtonGroup';
import { holidays } from '../../meterReadingSchedule/CalendarGrid';
import { format } from 'date-fns';
import { useMeterReadingSchedule } from '@srms/components/hooks/useMeterReadingSchedule';
import { cn } from '@srms/utils/shadcn';

export const MeterReadingSchedule: FunctionComponent = () => {
  //   const schedule = useCalendar(holidays);
  //   const dueAndDisconnectionDates = schedule.getDueAndDisconnectionDates();
  //  const calendarDays = schedule.getFullCalendar(dueAndDisconnectionDates);

  const mrSched = useMeterReadingSchedule(holidays);

  const calendarDays = mrSched.getCalendarDays();

  //console.log(mrSched.calculateDueDate(new Date(2025, 2, 1)));

  // Calculate number of rows needed for the calendar
  // Each week is a row, so we divide by 7 and round up
  const numberOfWeeks = Math.ceil(calendarDays.length / 7);

  // Create grid styles using inline style for dynamic row count
  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(7, minmax(0, 1fr))',
    gridTemplateRows: `repeat(${numberOfWeeks}, minmax(0, 1fr))`,
  };

  return (
    <div className="flex h-full flex-col rounded-2xl border">
      <header className="flex items-center justify-between px-4 py-3">
        {/* <section className="flex items-center gap-3">
          <Popover>
            <PopoverTrigger asChild>
              <div role="button" className="flex flex-col overflow-clip rounded-md border">
                <div className="bg-primary text-primary-foreground flex flex-1 items-center justify-center border-b px-3 py-1 text-sm font-bold tracking-wide uppercase">
                  {format(new Date(), 'MMM')}
                </div>

                <div className="flex flex-1 justify-center text-lg font-extrabold">
                  {format(new Date(), 'dd')}
                </div>
              </div>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                onSelect={date => {
                  if (date) {
                    schedule.setCurrentMonth(date.getMonth());
                    schedule.setCurrentYear(date.getFullYear());
                  }
                }}
              />
            </PopoverContent>
          </Popover>

          <div className="flex h-full flex-col">
            <h3 className="text-lg font-semibold">
              {schedule.month} {schedule.year}
            </h3>
            <p className="text-muted-foreground text-sm">
              {format(schedule.getCurrentMonthRange().monthStart, 'MMM dd')} -{' '}
              {format(schedule.getCurrentMonthRange().monthEnd, 'MMM dd, yyyy')}
            </p>
          </div>
        </section> */}

        <section className="flex items-center gap-2">
          <ButtonGroup>
            <Button variant="outline">
              <ChevronLeft />
            </Button>
            <Button variant="outline">Today</Button>
            <Button variant="outline">
              <ChevronRight />
            </Button>
          </ButtonGroup>

          {/* Extracted into a separate component */}
          {/* <MeterReaderSelector value={selectedMeterReader} setValue={setSelectedMeterReader} /> */}

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
              className="border-l p-1 text-center text-sm font-semibold uppercase first:border-l-0"
            >
              {day}
            </div>
          ))}
        </section>

        <section className="flex-1" style={gridStyle}>
          {calendarDays.map((day, index) => {
            const dueDate = mrSched.calculateDueDate(day);

            return (
              <div
                key={index}
                role="button"
                className="col-span-1 overflow-hidden border-t border-l p-2 text-sm [&:nth-child(-n+7)]:border-t-0 [&:nth-child(7n+1)]:border-l-0"
              >
                <section
                  className={cn(
                    format(new Date(), 'MM-dd-yyyy') === format(day, 'MM-dd-yyyy')
                      ? 'bg-primary text-primary-foreground rounded-full'
                      : 'bg-transparent',
                    'flex size-7 items-center justify-center text-sm font-semibold',
                  )}
                >
                  {format(new Date(day), 'dd')}
                </section>

                <section>{dueDate}</section>
              </div>
            );
          })}
        </section>
      </main>
    </div>
  );
};
