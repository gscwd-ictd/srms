'use client';

import { CalendarDay } from '@srms/components/temp/useCalendarDays';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@srms/components/ui/Sheet';
import { MeterReadingSchedule } from '@srms/lib/MeterReading/services/MeterReadingSchedule';
import { cn } from '@srms/utils/shadcn';
import { format } from 'date-fns';
import { CalendarPlus, StickyNote } from 'lucide-react';
import { memo } from 'react';

type CalendarGridProps = {
  calendarDays: CalendarDay[];
  restDays: string[];
  week: string[];
};

export const holidays = [
  {
    id: '37e628bf-1c01-4030-85a7-3afd20c88ca1',
    name: 'New Year',
    holidayDate: 'January 01, 2025',
    type: 'regular',
  },
  {
    id: '82c7d91e-07c9-4bef-941d-ce5af66f37f0',
    name: 'Chinese New Year',
    holidayDate: 'January 29, 2025',
    type: 'special',
  },
  {
    id: 'fa322f83-7956-4efd-b0f2-21561d0586a3',
    name: 'Kalilangan Festival',
    holidayDate: 'February 27, 2025',
    type: 'special',
  },
  {
    id: '380a86f3-b92a-4d50-aed7-e542baa43cac',
    name: 'Araw ng Kagitingan',
    holidayDate: 'April 09, 2025',
    type: 'regular',
  },
  {
    id: '7b045a79-8260-4edb-b85b-d50838781c72',
    name: 'Maundy Thursday',
    holidayDate: 'April 17, 2025',
    type: 'regular',
  },
  {
    id: '24345c65-f196-4924-a8c4-3814efb6fe16',
    name: 'Good Friday',
    holidayDate: 'April 18, 2025',
    type: 'regular',
  },
  {
    id: 'c4c1376f-8335-47e7-9ecc-dce20d39712d',
    name: 'Black Saturday',
    holidayDate: 'April 19, 2025',
    type: 'special',
  },
  {
    id: '26007302-8bc3-4846-8f3b-afeb8b9ee73c',
    name: 'Labor Day',
    holidayDate: 'May 01, 2025',
    type: 'regular',
  },
  {
    id: '15dd3104-54ba-438b-be79-9261c9239885',
    name: 'Independence Day',
    holidayDate: 'June 12, 2025',
    type: 'regular',
  },
  {
    id: '5292feab-c528-4b88-afab-1fd974f3ce48',
    name: 'Ninoy Aquino Day',
    holidayDate: 'August 21, 2025',
    type: 'special',
  },
  {
    id: '39bc9494-dc50-4a67-a9a4-261be9509603',
    name: 'National Heroes Day',
    holidayDate: 'August 25, 2025',
    type: 'regular',
  },
  {
    id: '19b79099-bdd6-471f-acdb-da0c0c38bb7e',
    name: "All Saints' Day Eve",
    holidayDate: 'October 31, 2025',
    type: 'special',
  },
  {
    id: '493fb24a-b34a-4813-90c9-740178a1f83f',
    name: "All Saints' Day",
    holidayDate: 'November 01, 2025',
    type: 'special',
  },
  {
    id: 'd2889502-ea14-4a7a-be3a-8ece85db89e1',
    name: 'Bonifacio Day',
    holidayDate: 'November 30, 2025',
    type: 'regular',
  },
  {
    id: '4bb38fef-d1d4-4852-8384-81a93d252f25',
    name: 'Feast of the Immaculate Conception of Mary',
    holidayDate: 'December 08, 2025',
    type: 'special',
  },
  {
    id: '4f9f997a-97d9-462c-a124-f82b621ee0a4',
    name: 'Christmas Eve',
    holidayDate: 'December 24, 2025',
    type: 'special',
  },
  {
    id: '0a8584ce-690b-4f76-8127-e364ddd1c5eb',
    name: 'Christmas Day',
    holidayDate: 'December 25, 2025',
    type: 'regular',
  },
  {
    id: 'a062a473-d9d7-4bdc-8ffa-cdc3ef70d2ac',
    name: 'Rizal Day',
    holidayDate: 'December 30, 2025',
    type: 'regular',
  },
  {
    id: 'b5f4672f-f630-4bfd-b84c-3557fbb344c7',
    name: 'Last Day of the Year',
    holidayDate: 'December 31, 2025',
    type: 'special',
  },
];

// Memoized Calendar component with TypeScript props
export const CalendarGrid = memo<CalendarGridProps>(({ calendarDays, week, restDays }) => {
  const meterSchedule = new MeterReadingSchedule(2, new Date().getFullYear(), holidays);

  console.log({ meterSchedule: meterSchedule.getCalendarDays() });

  return (
    <>
      <div className="grid h-[4vh] w-full grid-cols-7 border-b">
        {week.map((weekName, index) => (
          <div
            key={index}
            className="text-muted-foreground col-span-1 flex items-center justify-center border-l text-xs font-bold tracking-wide uppercase first:border-l-0"
          >
            {weekName}
          </div>
        ))}
      </div>

      <div className="grid flex-1 grid-cols-7 overflow-y-auto">
        {calendarDays.map((day, index) => {
          const isHoliday = holidays.some(
            holiday => holiday.holidayDate === format(day.date, 'MMMM dd, yyyy'),
          );

          const isRestDay = restDays.includes(day.date);

          return (
            <Sheet key={index}>
              <SheetTrigger asChild>
                <div
                  role="button"
                  className={cn(
                    !day.dueAt || !day.disconnectAt || isHoliday || isRestDay
                      ? 'bg-muted/60 dark:bg-muted/30 text-muted-foreground/30 cursor-default'
                      : 'bg-background text-muted-foreground/85',

                    'col-span-1 flex h-full min-h-16 flex-col justify-between border-t border-l p-2 [&:nth-child(-n+7)]:border-t-0 [&:nth-child(7n+1)]:border-l-0',
                  )}
                >
                  <section className="flex items-center justify-between">
                    <div
                      className={cn(
                        format(new Date(), 'MM-dd-yyyy') === format(day.date, 'MM-dd-yyyy')
                          ? 'bg-primary text-primary-foreground rounded-full'
                          : 'bg-transparent',
                        'flex size-7 items-center justify-center text-sm font-semibold',
                      )}
                    >
                      {format(new Date(day.date), 'dd')}
                    </div>

                    {(day.dueAt || day.disconnectAt) && !isHoliday && !isRestDay ? (
                      <div className="flex items-center gap-2 pr-4">
                        <button>
                          <CalendarPlus className="size-4" />
                        </button>

                        <button>
                          <StickyNote className="size-4" />
                        </button>
                      </div>
                    ) : null}
                  </section>

                  {/* <section>
                    {(day.dueAt || day.disconnectAt) && !restDays.includes(day.date) ? (
                      <div className="space-y-1 text-xs">
                        <div className="bg-secondary dark:border-primary/10 flex items-center gap-1 rounded border px-2 py-1">
                          <div className="size-2 rounded-full bg-indigo-500" />
                          <p className="font-semibold">{format(day.dueAt!, 'MMM dd')}</p>
                        </div>
                        <div className="bg-secondary dark:border-primary/10 flex items-center gap-1 rounded border px-2 py-1">
                          <div className="size-2 rounded-full bg-rose-500" />
                          <p className="font-semibold">{format(day.disconnectAt!, 'MMM dd')}</p>
                        </div>
                      </div>
                    ) : null}
                  </section> */}

                  {/* <section>
                  {day.dueAt || day.disconnectAt ? <StackedAvatars users={users} size="sm" limit={3} /> : null}
                </section> */}
                </div>
              </SheetTrigger>

              {day.dueAt && day.disconnectAt ? (
                <SheetContent>
                  <SheetHeader>
                    <SheetTitle>Edit profile</SheetTitle>
                    <SheetDescription>Make changes to your profile here.</SheetDescription>
                  </SheetHeader>

                  <div>{day.date}</div>
                </SheetContent>
              ) : null}
            </Sheet>
          );
        })}
      </div>
    </>
  );
});

CalendarGrid.displayName = 'CalendarGrid';
