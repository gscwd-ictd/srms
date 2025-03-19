import { MeterReadingScheduler } from '@srms/components/features/meterReadingSchedule/MeterReadingScheduler';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Meter Reading Schdule',
};

export default function TemporaryPage() {
  return <MeterReadingScheduler />;
}
