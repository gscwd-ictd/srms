'use client';

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type FunctionComponent,
  type PropsWithChildren,
} from 'react';
import { MeterReadingSchedule, Scheduler, useMeterReadingScheduler } from './useMeterReadingScheduler';
import { holidays } from './holidays';

type MeterReadingSchedulerContextProps = PropsWithChildren & {};

type MeterReadingSchedulerContextState = {
  scheduler: Scheduler;
  schedule: MeterReadingSchedule[];
  datesToSplit: Date[];
  setDatesToSplit: (datesToSplit: Date[]) => void;
  restDays: Date[];
  setRestDays: (restDays: Date[]) => void;
};

const MeterReadingSchedulerContext = createContext<MeterReadingSchedulerContextState | undefined>(undefined);

export const MeterReadingSchedulerProvider: FunctionComponent<MeterReadingSchedulerContextProps> = ({
  children,
}) => {
  const [restDays, setRestDays] = useState<Date[]>([]);
  const scheduler = useMeterReadingScheduler(holidays, restDays);
  const [schedule, setSchedule] = useState(scheduler.calculateSchedule());
  const [datesToSplit, setDatesToSplit] = useState<Date[]>([]);

  useEffect(() => {
    const newSchedule = scheduler.calculateSchedule();
    setSchedule(newSchedule);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scheduler.currentDate, restDays]);

  useEffect(() => {
    const splitDates = scheduler.splitDates(datesToSplit);
    setSchedule(splitDates);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [datesToSplit]);

  // useEffect(() => console.log(schedule), [schedule]);

  return (
    <MeterReadingSchedulerContext.Provider
      value={{ scheduler, schedule, datesToSplit, setDatesToSplit, restDays, setRestDays }}
    >
      {children}
    </MeterReadingSchedulerContext.Provider>
  );
};

export const useMeterReadingSchedulerProvider = () => {
  const context = useContext(MeterReadingSchedulerContext);

  if (!context) {
    throw new Error('Child element must be inside the context');
  }

  return context;
};
