'use client';

import { compareAsc, format } from 'date-fns';
import { type FunctionComponent, memo } from 'react';
import { MeterReadingSchedule } from './useMeterReadingScheduler';
import { cn } from '@srms/utils/shadcn';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@srms/components/ui/DropdownMenu';
import { ChevronDown } from 'lucide-react';
import { useMeterReadingSchedulerProvider } from './MeterReadingSchedulerProvider';

type CalendarDayCellProps = {
  date: MeterReadingSchedule;
  isWithinMonth: boolean;
};

export const CalendarDayCell: FunctionComponent<CalendarDayCellProps> = memo(({ date, isWithinMonth }) => {
  const { setDatesToSplit, datesToSplit, scheduler, restDays, setRestDays } =
    useMeterReadingSchedulerProvider();

  const isToday = format(new Date(), 'MM-dd-yyyy') === format(date.readingDate, 'MM-dd-yyyy');

  const handleDropdownInteraction = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const handleSplitDates = (e: React.MouseEvent) => {
    // Make sure parent action is not fired to prevent expensive re-render
    e.stopPropagation();

    // Copy current datesToSplit
    const dates = [...datesToSplit];

    // Add the current readingDate as a selected date to split
    dates.push(date.readingDate);

    // Make sure that all dates are unique
    const uniqueDates = scheduler.removeDuplicateDates(dates);

    // set a new value for the datesToSplit
    setDatesToSplit(uniqueDates);
  };

  const handleSetRestDay = (e: React.MouseEvent) => {
    e.stopPropagation();

    const updatedRestDays = [...restDays];

    updatedRestDays.push(date.readingDate);

    setRestDays(updatedRestDays);
  };

  return (
    <div
      className={cn(
        isWithinMonth ? 'bg-transparent font-semibold' : 'bg-muted/40 text-muted-foreground/70',
        'col-span-1 overflow-hidden border-t border-l p-2 text-sm [&:nth-child(-n+7)]:border-t-0 [&:nth-child(7n+1)]:border-l-0',
      )}
    >
      <div className="mb-2 flex items-center justify-between">
        <section
          className={cn(
            isToday ? 'bg-primary text-primary-foreground rounded-full' : 'bg-transparent',
            'flex size-7 items-center justify-center text-sm',
          )}
        >
          {format(new Date(date.readingDate), 'dd')}
        </section>

        {isWithinMonth && (
          <DropdownMenu>
            <DropdownMenuTrigger onClick={handleDropdownInteraction}>
              <ChevronDown className="size-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleSplitDates}>Split dates</DropdownMenuItem>
              <DropdownMenuItem onClick={handleSetRestDay}>Mark as rest day</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      {Array.isArray(date.dueDate) && Array.isArray(date.disconnectionDate) ? (
        <div className="flex flex-col font-normal">
          <div className="flex items-center gap-4 text-indigo-500">
            {date.dueDate.sort(compareAsc).map((date, index) => (
              <div key={index}>{scheduler.formatDate(date, 'MMM dd')}</div>
            ))}
          </div>

          <div className="flex items-center gap-4 text-rose-500">
            {date.disconnectionDate.sort(compareAsc).map((date, index) => (
              <div key={index}>{scheduler.formatDate(date, 'MMM dd')}</div>
            ))}
          </div>
        </div>
      ) : (
        <div className="font-normal">
          <div className="text-indigo-500">{scheduler.formatDate(date.dueDate as Date, 'MMM dd')}</div>
          <div className="text-rose-500">
            {scheduler.formatDate(date.disconnectionDate as Date, 'MMM dd')}
          </div>
        </div>
      )}
    </div>
  );
});

// Add display name for debugging
CalendarDayCell.displayName = 'CalendarDayCell';
