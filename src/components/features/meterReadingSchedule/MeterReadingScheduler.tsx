'use client';

import { FunctionComponent, useState } from 'react';
import { useCalendarDays } from '../../temp/useCalendarDays';
import { format } from 'date-fns';
import { Button } from '../../ui/Button';
import { ButtonGroup } from '../../ui/ButtonGroup';
import { CalendarPlus, ChevronLeft, ChevronRight } from 'lucide-react';
import { CalendarGrid, holidays } from './CalendarGrid';
import { MeterReaderSelector } from './MeterReaderSelector';

export const MeterReadingScheduler: FunctionComponent = () => {
  const [value, setValue] = useState<string>('');

  const calendar = useCalendarDays(holidays);

  //console.log(calendar.calendarDays);

  // console.log(calendar.getRestDays(6));

  return (
    <div className="flex h-full w-full flex-col overflow-clip rounded-2xl border">
      <header className="flex items-center justify-between border-b px-5 py-4">
        <section className="flex items-center gap-3">
          <div
            role="button"
            className="flex flex-col overflow-clip rounded-md border"
            onClick={() => calendar.today()}
          >
            <div className="bg-secondary text-secondary-foreground/50 flex flex-1 items-center justify-center border-b px-3 py-1 text-sm font-bold tracking-wide uppercase">
              {format(new Date(), 'MMM')}
            </div>

            <div className="flex flex-1 justify-center text-lg font-extrabold">
              {format(new Date(), 'dd')}
            </div>
          </div>

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
          <MeterReaderSelector value={value} setValue={setValue} />

          <Button>
            <CalendarPlus />
            Add schedule
          </Button>
        </section>
      </header>

      {/* Memoized calendar grid component */}
      <CalendarGrid
        calendarDays={calendar.calendarDays}
        week={calendar.week}
        restDays={calendar.getRestDays(6)}
      />
    </div>
  );
};
