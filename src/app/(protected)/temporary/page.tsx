import { MeterReadingScheduler } from '@srms/components/features/meterReading/scheduler/MeterReadingScheduler';
import { MeterReadingSchedulerProvider } from '@srms/components/features/meterReading/scheduler/MeterReadingSchedulerProvider';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Meter Reading Schdule',
};

export default function TemporaryPage() {
  return (
    <MeterReadingSchedulerProvider>
      <MeterReadingScheduler />
    </MeterReadingSchedulerProvider>
  );
}
