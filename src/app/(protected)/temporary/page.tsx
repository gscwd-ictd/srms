import { MeterReadingSchedule } from '@srms/components/features/meterReading/schedule/MeterReadingSchedule';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Meter Reading Schdule',
};

export default function TemporaryPage() {
  return <MeterReadingSchedule />;
}
