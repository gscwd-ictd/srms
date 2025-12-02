// Utility: random number with 2 decimals
const randomInRange = (min: number, max: number) =>
  Number((Math.random() * (max - min) + min).toFixed(2));

// Utility: smooth random fluctuation based on previous value
const fluctuate = (value: number, min: number, max: number, delta = 5) => {
  let newValue = value + (Math.random() * 2 - 1) * delta;
  newValue = Math.max(min, Math.min(max, newValue));
  return Number(newValue.toFixed(2));
};

// Generate hourly timestamps from start to end date
const generateTimestamps = (start: Date, end: Date): string[] => {
  const timestamps: string[] = [];
  const current = new Date(start);
  while (current <= end) {
    timestamps.push(new Date(current).toISOString());
    current.setHours(current.getHours() + 1);
  }
  return timestamps;
};

// Generate PumpData for one station
export const generatePumpDataForStation = (stationName: string, start: Date, end: Date): PumpData[] => {
  const timestamps = generateTimestamps(start, end);

  // Start with base readings
  let waterlevel = randomInRange(30, 80);
  let pressure = randomInRange(40, 90);
  let flowmeter = randomInRange(2, 8);
  let turbidity = randomInRange(40, 80);
  let humidity = randomInRange(5, 15);
  let chlorine = randomInRange(0.3, 0.9);

  return timestamps.map((ts) => {
    // Gradually change values over time
    waterlevel = fluctuate(waterlevel, 20, 100, 2);
    pressure = fluctuate(pressure, 30, 100, 3);
    flowmeter = fluctuate(flowmeter, 1, 10, 0.2);
    turbidity = fluctuate(turbidity, 20, 100, 4);
    humidity = fluctuate(humidity, 1, 20, 0.5);
    chlorine = fluctuate(chlorine, 0.1, 1.5, 0.05);

    return {
      name: stationName,
      waterlevel,
      pressure,
      flowmeter,
      turbidity,
      humidity,
      chlorine,
      timestamp: ts,
    };
  });
};

// Generate ReservoirData
export const generateReservoirData = (reservoirName: string, start: Date, end: Date): ReservoirWSData[] => {
  const timestamps = generateTimestamps(start, end);

  // Start with base readings
  let waterlevel = randomInRange(30, 80);
  let flowmeter = randomInRange(2, 8);
  let volume = randomInRange(500, 2000);

  return timestamps.map((ts) => {
    // Gradually change values over time
    waterlevel = fluctuate(waterlevel, 20, 100, 2);
    flowmeter = fluctuate(flowmeter, 1, 10, 0.2);
    volume = fluctuate(flowmeter, 1, 10, 0.2);

    return {
      name: reservoirName,
      waterlevel,
      flowmeter,
      volume,
      timestamp: ts,
    };
  });
};

// Define your date range (GMT+8 for PH)
const startDate = new Date("2025-10-01T00:00:00+08:00");
const endDate = new Date("2025-11-13T23:00:00+08:00");

// Combine all stations’ data
export const mockPumpData: PumpData[] = [
  ...generatePumpDataForStation("ps1", startDate, endDate),
  ...generatePumpDataForStation("ps2", startDate, endDate),
  ...generatePumpDataForStation("ps3", startDate, endDate),
  ...generatePumpDataForStation("ps4", startDate, endDate),
  ...generatePumpDataForStation("ps5", startDate, endDate),
];

export interface ReservoirWSData {
  name: string;
  waterlevel: number;
  flowmeter: number;
  volume: number;
  timestamp: string;
}

export interface PumpData {
  name: string;
  waterlevel: number;
  pressure: number;
  flowmeter: number;
  turbidity: number;
  humidity: number;
  chlorine: number;
  timestamp: string;
}