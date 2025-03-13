"use client";

import { FunctionComponent } from "react";
import { useCalendarDays } from "../temp/useCalendarDays";
import { format } from "date-fns";
// import { Button } from "./Button";
// import { Button } from "./Button";

export const Scheduler: FunctionComponent = () => {
  // const calendarDays = useCalendarDays(new Date().getMonth());

  // console.log(calendarDays);

  // return <></>;

  //const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());

  const calendar = useCalendarDays();

  console.log(calendar);

  return (
    <>
      <div className="h-full w-full rounded-2xl">
        <header className="p-4">Meter Reader Schedule</header>

        {/* 
      <div className="grid grid-cols-7">
        {calendar.week.map((day, index) => (
          <div
            key={index}
            className="col-span-1 border-t border-l p-2 text-center first:border-l-0 last:border-r-0"
          >
            {day}
          </div>
        ))}
      </div> */}

        <div className="grid h-full grid-cols-7">
          {calendar.calendarDays.map((day, index) => (
            <div
              key={index}
              className="col-span-1 flex grow items-center justify-center border-b border-l p-2 text-xs first:border-l last:border-r [:nth-child(7n)]:border-r [&:nth-child(-n+7)]:border-t"
            >
              {format(new Date(day.date), "dd")}
            </div>
          ))}
        </div>
      </div>
    </>
  );

  // const restOnSunday = calendarDays.getRestDays(0);
  // const restOnSaturday = calendarDays.getRestDays(6);

  // console.log({ restOnSaturday });
  // console.log({ restOnSunday });

  // const workingDaysRestOnSaturday = calendarDays.getWorkingDays(6);
  // const workingDaysRestOnSunday = calendarDays.getWorkingDays(0);

  // console.log({ workingDaysRestOnSaturday, workingDaysRestOnSunday });

  // return (
  //   <div className="flex items-center gap-4">
  //     <Button onClick={() => calendarDays.goToPreviousMonth()}>Prev</Button>
  //     <p>{calendarDays.month}</p>
  //     <Button onClick={() => calendarDays.goToNextMonth()}>Next</Button>
  //   </div>
  // );

  // useEffect(() => {
  //   setCalendarDays(getCalendarDays(currentMonth));
  // }, [currentMonth]);

  // return (
  //   <div className="h-full w-full">
  //     {/* <div className="mb-4 flex items-center gap-4">
  //       <Button onClick={() => calendarDays.setMonth(calendarDays.month - 1)}>Prev</Button>
  //       <h1>{format(setMonth(new Date(), calendarDays.month), "MMMM yyy")}</h1>
  //       <Button onClick={() => calendarDays.setMonth(calendarDays.month + 1)}>Next</Button>
  //     </div> */}
  //     <div className="grid w-full grid-cols-7">
  //       {calendarDays.weeks.map((day, index) => (
  //         <div
  //           key={index}
  //           className="text-muted-foreground col-span-1 flex items-center justify-center border-y border-l py-2 text-sm font-medium first:border-l last:border-r"
  //         >
  //           {day}
  //         </div>
  //       ))}
  //     </div>
  //     <div className="grid h-full w-full grid-cols-7">
  //       {calendarDays.allDays.map((date, index) => {
  //         const currentDate = new Date(date.date);
  //         const formattedDay = format(currentDate, "dd");
  //         const sundays = calendarDays.sundays;
  //         const disable =
  //           calendarDays.trailingDays.includes(date.date) ||
  //           calendarDays.leadingDays.includes(date.date) ||
  //           sundays.includes(date.date);
  //         return (
  //           <div
  //             role="button"
  //             key={index}
  //             aria-disabled={disable}
  //             onKeyDown={(e) => {
  //               if (e.key === "Enter") {
  //                 console.log(date); // Trigger the same action as onClick when Enter or Space is pressed
  //               }
  //             }}
  //             onClick={() => console.log(date)}
  //             tabIndex={disable ? -1 : 0}
  //             className={cn(
  //               disable
  //                 ? "aria-disabled:text-muted-foreground cursor-default"
  //                 : "text-primary hover:bg-secondary/40 font-semibold",
  //               "relative col-span-1 flex items-center justify-center border-b border-l p-2 text-xs first:border-l last:border-r [:nth-child(7n)]:border-r",
  //             )}
  //           >
  //             <div
  //               className={cn(
  //                 calendarDays.today === formattedDay &&
  //                   "bg-primary dark:bg-secondary flex h-6 w-6 items-center justify-center rounded-full p-2 text-white",
  //                 "absolute top-2 left-2",
  //               )}
  //             >
  //               {formattedDay}
  //             </div>
  //             {!calendarDays.leadingDays.includes(date.date) &&
  //               !calendarDays.trailingDays.includes(date.date) && (
  //                 <>
  //                   {date.isRestDay ? (
  //                     <div>Rest Day</div>
  //                   ) : (
  //                     <div className="w-full space-y-2">
  //                       <div className="bg-secondary flex items-center gap-2 rounded-lg px-2 py-1">
  //                         <div className="size-2 rounded-full bg-indigo-500" />
  //                         Due: {date.dueDate ? format(date.dueDate, "MMM dd") : ""}
  //                       </div>
  //                       <div className="bg-secondary flex items-center gap-2 rounded-lg px-2 py-1">
  //                         <div className="size-2 rounded-full bg-rose-500" />
  //                         Discon: {date.disconnectionDate ? format(date.disconnectionDate, "MMM dd") : ""}
  //                       </div>
  //                     </div>
  //                   )}
  //                 </>
  //               )}
  //           </div>
  //         );
  //       })}
  //     </div>
  //   </div>
  // );
};
