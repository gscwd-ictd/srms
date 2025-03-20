'use client';

import { FunctionComponent, useState } from 'react';
import { format } from 'date-fns';
import { Button } from '../../ui/Button';
import { ButtonGroup } from '../../ui/ButtonGroup';
import { CalendarPlus, ChevronLeft, ChevronRight } from 'lucide-react';
import { CalendarGrid, holidays } from './CalendarGrid';
import { MeterReaderSelector } from './MeterReaderSelector';
import { DateEntry, useCalendar } from './useCalendar';
import { Popover, PopoverContent, PopoverTrigger } from '@srms/components/ui/Popover';
import { Calendar } from '@srms/components/ui/Calendar';

export const MeterReadingScheduler: FunctionComponent = () => {
  const [selectedMeterReader, setSelectedMeterReader] = useState<string>('');

  const calendar = useCalendar(holidays);

  const dates = calendar.getDueAndDisconnectionDates();

  //const splitDueDates = calendar.splitDates(new Date(2025, 2, 20), dueDates);

  const splitDates = calendar.splitDates(new Date(2025, 2, 20), dates);
  // const splitDates2 = calendar.splitDates(new Date(2025, 0, 13), splitDates);

  //const calendarDays = calendar.getFullCalendar(dates) as unknown as DateEntry[];

  const fullCalendar = calendar.getFullCalendar(splitDates) as unknown as DateEntry[];

  console.log({ fullCalendar, splitDates });

  return (
    <div className="flex h-full w-full flex-col overflow-clip rounded-2xl border">
      <header className="flex items-center justify-between border-b px-5 py-4">
        <section className="flex items-center gap-3">
          <Popover>
            <PopoverTrigger asChild>
              <div role="button" className="flex flex-col overflow-clip rounded-md border">
                <div className="bg-secondary text-secondary-foreground/50 flex flex-1 items-center justify-center border-b px-3 py-1 text-sm font-bold tracking-wide uppercase">
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
                    calendar.setCurrentMonth(date.getMonth());
                    calendar.setCurrentYear(date.getFullYear());
                  }
                }}
              />
            </PopoverContent>
          </Popover>

          <div className="flex h-full flex-col">
            <h3 className="text-lg font-semibold">
              {calendar.month} {calendar.year}
            </h3>
            <p className="text-muted-foreground text-sm">
              {format(calendar.getCurrentMonthRange().monthStart, 'MMM dd')} -{' '}
              {format(calendar.getCurrentMonthRange().monthEnd, 'MMM dd, yyyy')}
            </p>
          </div>
        </section>

        <section className="flex items-center gap-2">
          <ButtonGroup>
            <Button variant="outline" onClick={() => calendar.goToPreviousMonth()}>
              <ChevronLeft />
            </Button>
            <Button variant="outline" onClick={() => calendar.today()}>
              Today
            </Button>
            <Button variant="outline" onClick={() => calendar.goToNextMonth()}>
              <ChevronRight />
            </Button>
          </ButtonGroup>

          {/* Extracted into a separate component */}
          <MeterReaderSelector value={selectedMeterReader} setValue={setSelectedMeterReader} />

          <Button>
            <CalendarPlus />
            Add schedule
          </Button>
        </section>
      </header>

      {/* Memoized calendar grid component */}
      <CalendarGrid
        currentDate={new Date(calendar.year, calendar.currentMonth)}
        calendarDays={fullCalendar}
        week={calendar.week}
      />
    </div>
  );
};
