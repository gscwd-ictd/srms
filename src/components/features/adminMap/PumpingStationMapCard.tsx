import { useCardStore } from "@srms/components/stores/useCardStore";
import { usePumpingStationStore } from "@srms/components/stores/usePumpingStationStore";
import { Button } from "@srms/components/ui/Button";
import { Calendar } from "@srms/components/ui/Calendar";
import { ChartConfig, ChartContainer } from "@srms/components/ui/Chart";
import { Label } from "@srms/components/ui/Label";
import { Popover, PopoverContent, PopoverTrigger } from "@srms/components/ui/Popover";
// import { ChartContainer, ChartTooltip } from "@srms/components/ui/Chart";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@srms/components/ui/Sheet";
import { Switch } from "@srms/components/ui/Switch";
import { PumpingStationData, PumpingStationProperties } from "@srms/lib/pms/types";
import { generatePumpDataForStation, mockPumpData, PumpData } from "@srms/lib/pumpstation/pumpStationType";
import { cn } from "@srms/utils/shadcn";
import { addHours, format, isWithinInterval } from "date-fns";
import { real } from "drizzle-orm/gel-core";
import { CalendarIcon } from "lucide-react";
import React from "react";
import { FunctionComponent, useEffect, useRef, useState } from "react";
import { DateRange } from "react-day-picker";
import { Legend, Line, LineChart, Tooltip, XAxis, YAxis } from "recharts";
import { Line as LineReactChart } from "react-chartjs-2";
// import { Bar, BarChart } from "recharts";

const chartConfig = {
  pressure: {
    color: "#13e062ff",
  },
  waterLevel: {
    color: "#1613c2ff",
  },
  flowMeter: {
    color: "#1dc2b4ff",
  },
  turbidity: {
    color: "#5f5e5dff",
  },
  humidity: {
    color: "#dfe21fff",
  },
  chlorine: {
    color: "#e93d09ff",
  },
} satisfies ChartConfig;

interface PumpingStationMapCardProps {
  open: boolean;
  ps: PumpingStationProperties;
}

const PumpingStationMapCard: FunctionComponent<PumpingStationMapCardProps> = ({ ps, open }) => {
  const [openChange, setOpenChange] = useState(open);
  const { layerToggleCardOpen, setLayerToggleCardOpen, setPumpingStationCardOpen } = useCardStore();
  const { pumpData, setPumpData } = usePumpingStationStore();
  const [psName, setPsName] = useState("");
  const [realTime, setRealTime] = useState(false);
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(2025, 9, 1), // October 1, 2025
    to: new Date(2025, 10, 13), // November 13, 2025
  });

  const [data, setData] = useState<Record<string, PumpData>>({});
  const [latestData, setLatestData] = useState<PumpData[]>([]);
  const wsRef = useRef<WebSocket | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const [wsUrl, setWsUrl] = useState("ws://172.20.10.58:7575");
  const [isConnected, setIsConnected] = useState(false);

  const handleConnect = () => {
    if (isConnected) {
      setRealTime(false);
      setIsConnected(false);
      console.log("🔴 Disconnected");
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }
    setRealTime(true);
    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;

    ws.onopen = () => {
      setIsConnected(true);
      console.log("🟢 Connected to", wsUrl);

      // Send "hello" every 200ms
      intervalRef.current = setInterval(() => {
        if (ws.readyState === WebSocket.OPEN) {
          ws.send("hello");
        }
      }, 1500);
    };

    ws.onmessage = (event) => {
      try {
        const jsonData = JSON.parse(event.data);
        const timestamp = new Date().toLocaleString("en-PH", {
          timeZone: "Asia/Manila",
        });
        // Update local data (for UI)
        setData(jsonData);

        // ✅ Append new pump readings to store
        setPumpData((prev) => {
          const newEntries = Object.values(jsonData) as PumpData[];
          const entriesWithTimestamp = newEntries.map((entry) => ({
            ...entry,
            timestamp,
          }));

          const updated = [...prev, ...entriesWithTimestamp];
          return updated.slice(-500);
        });
      } catch (err) {
        console.warn("Non-JSON message ignored:", event.data);
      }
    };

    ws.onerror = (err) => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      setRealTime(false);
      console.error("⚠️ WebSocket Error:", err);
    };

    ws.onclose = () => {
      setIsConnected(false);
      console.log("🔴 Disconnected");
      setData({});
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  };

  const loadData = async (stationName: string) => {
    const startDate = new Date("2025-10-01T00:00:00+08:00");
    const endDate = new Date("2025-11-13T23:00:00+08:00");
    // setPumpingStationCardOpen(0);
    setPumpData(generatePumpDataForStation(stationName, startDate, endDate));
    // Get all unique station names
    const stationNames = Array.from(
      new Set(generatePumpDataForStation(stationName, startDate, endDate).map((d) => d.name)),
    );

    // For each station, find the latest timestamp record
    const latestPerStation = stationNames
      .map((station) => {
        const stationData = generatePumpDataForStation(stationName, startDate, endDate)
          .filter((d) => d.name === station)
          .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
        return stationData[0] ?? generatePumpDataForStation(stationName, startDate, endDate)[0]; // The latest one
      })
      .filter((d): d is PumpData => d !== undefined); // ✅ removes undefined safely

    setLatestData(latestPerStation);
    console.log(
      `✅ Loaded mock pump data for WebSocketMockTest component. ${latestPerStation.length} stations loaded.`,
    );
    console.log("✅ Loaded mock pump data for WebSocketMockTest component.");
  };

  useEffect(() => {
    setLayerToggleCardOpen(!layerToggleCardOpen);
    const str = ps.ps_name;
    const match = str.match(/\((.*?)\)/);
    const result = match ? match[1] : "";
    setPsName(result ?? "");
    loadData(result ?? "ps");
  }, []);

  // options for line chart design/UI
  const lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false, // key for stretching
    plugins: {
      legend: {
        display: true,
        labels: {
          color: "#1a1919ff", // Set the desired color here
        },
      },
    },
    scales: {
      x: {
        ticks: {
          color: "#000000ff", // color of x labels
        },
        grid: {
          color: "#d1d1d1ff", // color of x grid
        },
      },
      y: {
        ticks: {
          color: "#000000ff", // color of y labels
        },
        grid: {
          color: "#d1d1d1ff", // color of y grid
        },
      },
    },
  };

  return (
    <>
      <Sheet
        open={openChange}
        onOpenChange={(o: boolean) => {
          setLayerToggleCardOpen(!layerToggleCardOpen);
          setPumpingStationCardOpen(0);
          setOpenChange(o);
        }}
        modal={false}
      >
        <SheetContent
          className="h-[380px] w-full gap-0 border border-stone-300 bg-white/90 text-black backdrop-blur"
          side="bottom"
          onInteractOutside={(e) => e.preventDefault()}
        >
          <SheetHeader className="m-5 p-0">
            <SheetTitle className="text-black">
              <div className="flex flex-row">
                <div>{psName.replace(/ps/i, "Pumping Station ").toUpperCase()}</div>
                <div className="flex items-center space-x-2 px-4">
                  <Switch
                    id="data-mode"
                    checked={realTime}
                    onCheckedChange={handleConnect}
                    className="data-[state=checked]:bg-green-500 data-[state=unchecked]:bg-red-500"
                  />

                  <Label htmlFor="data-mode">{!realTime ? "Mock Data Mode" : "Real-time Data Mode"}</Label>
                </div>
              </div>
            </SheetTitle>
            <SheetDescription className="flex flex-row gap-4 text-stone-600">
              <label className="w-[30%]">{psName.replace(/ps/i, "Pumping Station ").toUpperCase()}</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-[280px] justify-start text-left font-normal text-white",
                      !date && "text-muted-foreground",
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date?.from ? (
                      date.to ? (
                        <>
                          {format(date.from, "LLL dd, y")} - {format(date.to, "LLL dd, y")}
                        </>
                      ) : (
                        format(date.from, "LLL dd, y")
                      )
                    ) : (
                      <span>Pick a date range</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="range"
                    defaultMonth={date?.from}
                    selected={date}
                    onSelect={setDate}
                    numberOfMonths={2}
                  />
                </PopoverContent>
              </Popover>
            </SheetDescription>
          </SheetHeader>
          {realTime ? (
            <></>
          ) : (
            <>
              <div className="mx-5 flex gap-5">
                <div className="grid w-[30%] grid-rows-2 gap-4">
                  <div className="h-[250px] rounded-md border-1 border-stone-200 p-3 shadow-md">
                    {Object.keys(realTime ? data : latestData).length === 0 ? (
                      <p className="mt-4 text-gray-500 italic">Waiting for JSON data...</p>
                    ) : (
                      <>
                        {Object.values(realTime ? data : latestData).map((ps: PumpData, index: number) => (
                          <div key={index} className="h-1/2 w-1/2 px-4">
                            <div className="mt-2 space-y-1 text-sm text-gray-700">
                              {" "}
                              <p>💧 Water Level: {ps.waterlevel.toFixed(2)}</p>{" "}
                              <p>⚙️ Pressure: {ps.pressure.toFixed(2)}</p>{" "}
                              <p>🌊 Flowmeter: {ps.flowmeter.toFixed(2)}</p>{" "}
                              <p>🔬 Turbidity: {ps.turbidity.toFixed(2)}</p>{" "}
                              <p>💨 Humidity: {ps.humidity.toFixed(2)}</p>{" "}
                              <p>☣️ Chlorine: {ps.chlorine.toFixed(2)}</p>{" "}
                            </div>{" "}
                          </div>
                        ))}
                      </>
                    )}
                  </div>
                </div>

                <div className="h-[250px] w-[65%] bg-gray-200/60">
                  {/* <LineReactChart
                    options={lineChartOptions}
                    data={{
                      labels: pressureChartLogs.map((item) => item.timestamp),
                      datasets: [
                        {
                          label: "PSI",
                          data: pressureChartLogs.map((item) => item.value),
                          borderColor: "#2b85ff", // color of line
                          backgroundColor: "#2b85ff", // color of dots
                        },
                      ],
                    }}
                  /> */}

                  <ChartContainer config={chartConfig} className="h-1/3 min-h-[250px] w-full px-4">
                    <LineChart
                      accessibilityLayer
                      data={pumpData.filter((lps) => {
                        if (lps.name.toLowerCase() === psName.toLowerCase()) {
                          const ts = new Date(lps.timestamp);

                          const startDate = date?.from ? date.from : new Date(2025, 9, 1);

                          const endDate = date?.to
                            ? addHours(date.to, 24)
                            : addHours(new Date(2025, 10, 13), 24);

                          return isWithinInterval(ts, { start: startDate, end: endDate });
                        }
                      })}
                    >
                      <XAxis
                        dataKey="timestamp"
                        tickFormatter={(value) => {
                          // Format ISO to HH:MM:SS or whatever format you like
                          const date = new Date(value);
                          return `${date.getMonth()}/${date.getDate()}`;
                        }}
                        tick={{ fill: "#555", fontSize: 12 }}
                      />
                      <YAxis display="Pressure" tickLine={false} tickMargin={20} axisLine={false} />
                      <Tooltip
                        content={({ active, payload, label }) => {
                          if (active && payload && payload.length) {
                            // sort descending by value
                            const sorted = [...payload].sort(
                              (a, b) => Number(b.value ?? 0) - Number(a.value ?? 0),
                            );
                            let formattedTime = "NAN";
                            try {
                              // format time for Philippine timezone
                              formattedTime = new Intl.DateTimeFormat("en-PH", {
                                hour: "2-digit",
                                minute: "2-digit",
                                second: "2-digit",
                                timeZone: "Asia/Manila",
                              }).format(new Date(label));
                            } catch (e) {
                              console.log(e);
                            }

                            return (
                              <div
                                className="rounded-md border bg-white p-2 text-sm shadow-md"
                                style={{ lineHeight: "1.2em" }}
                              >
                                <p className="mb-1 font-semibold">{formattedTime}</p>
                                {sorted.map((entry, index) => (
                                  <p key={index} style={{ color: entry.color }}>
                                    {entry.name} : {Number(entry.value).toFixed(2)}
                                  </p>
                                ))}
                              </div>
                            );
                          }
                          return null;
                        }}
                      />

                      {/* 🟩 Add legend here */}
                      <Legend verticalAlign="top" align="center" />
                      <Line dataKey="water level" stroke={chartConfig.waterLevel.color} dot={false} />
                      <Line dataKey="pressure" stroke={chartConfig.pressure.color} dot={false} />
                      <Line dataKey="flowmeter" stroke={chartConfig.flowMeter.color} dot={false} />
                      <Line dataKey="turbidity" stroke={chartConfig.turbidity.color} dot={false} />
                      <Line dataKey="humidity" stroke={chartConfig.humidity.color} dot={false} />
                      <Line dataKey="chlorine" stroke={chartConfig.chlorine.color} dot={false} />
                    </LineChart>
                    {/* <BarChart accessibilityLayer data={chartData}>
                  <Bar dataKey="desktop" fill="var(--color-desktop)" radius={4} />
                  <Bar dataKey="mobile" fill="var(--color-mobile)" radius={4} />
                </BarChart> */}
                  </ChartContainer>
                </div>
              </div>

              <div className="mb-4 flex px-30"></div>
            </>
          )}
          <div className="flex flex-row">
            <div className="flex h-1/3 min-h-[200px] w-1/2 flex-col px-4"></div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
};

export default PumpingStationMapCard;
