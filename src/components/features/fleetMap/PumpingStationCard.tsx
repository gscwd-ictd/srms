import { useCardStore } from "@srms/components/stores/useCardStore";
import { usePumpingStationStore } from "@srms/components/stores/usePumpingStationStore";
import { Button } from "@srms/components/ui/Button";
import { Calendar } from "@srms/components/ui/Calendar";
import { ChartConfig, ChartContainer } from "@srms/components/ui/Chart";
import { Popover, PopoverContent, PopoverTrigger } from "@srms/components/ui/Popover";
// import { ChartContainer, ChartTooltip } from "@srms/components/ui/Chart";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@srms/components/ui/Sheet";
import { PumpData } from "@srms/lib/pumpstation/pumpStationType";
import { cn } from "@srms/utils/shadcn";
import { addHours, format, isWithinInterval } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { FunctionComponent, useEffect, useState } from "react";
import { DateRange } from "react-day-picker";
import { Legend, Line, LineChart, Tooltip, XAxis, YAxis } from "recharts";
import { Label } from "@srms/components/ui/Label";
// import { Bar, BarChart } from "recharts";

// const chartData = [
//   { month: "January", desktop: 186, mobile: 80 },
//   { month: "February", desktop: 305, mobile: 200 },
//   { month: "March", desktop: 237, mobile: 120 },
//   { month: "April", desktop: 73, mobile: 190 },
//   { month: "May", desktop: 209, mobile: 130 },
//   { month: "June", desktop: 214, mobile: 140 },
// ];

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

interface PumpingStationCardProps {
  open: boolean;
  ps: PumpData;
}

const PumpingStationCard: FunctionComponent<PumpingStationCardProps> = ({ ps, open }) => {
  const [openChange, setOpenChange] = useState(open);
  const { layerToggleCardOpen, setLayerToggleCardOpen, setPumpingStationCardOpen } = useCardStore();
  const { pumpData, setPumpData } = usePumpingStationStore();
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(2025, 9, 1), // October 1, 2025
    to: new Date(2025, 10, 13), // November 13, 2025
  });

  useEffect(() => {
    setLayerToggleCardOpen(!layerToggleCardOpen);
    const existingIndex = pumpData.findIndex((p) => p.name === ps.name);
    if (existingIndex >= 0) {
      const updatedPumpData = [...pumpData];
      updatedPumpData[existingIndex] = ps;
      setPumpData(updatedPumpData);
    } else {
      setPumpData([...pumpData, ps]);
    }
  }, []);

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
          className="ui-color-base h-[380px] w-full gap-0 border border-stone-300 bg-white text-black"
          side="bottom"
          onInteractOutside={(e) => e.preventDefault()}
        >
          <SheetHeader className="m-5 p-0">
            <SheetTitle className="text-black">
              {ps.name.replace(/ps/i, "Pumping Station ").toUpperCase()}
            </SheetTitle>
            <SheetDescription className="flex flex-row gap-4 text-stone-600">
              <label className="w-[30%]">{ps.name.replace(/ps/i, "Pumping Station ").toUpperCase()}</label>

              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="default"
                    className={cn(
                      "primary-text-color w-[280px] justify-start text-left font-normal",
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
          <div className="mx-5 flex gap-5">
            <div className="grid w-[30%] grid-rows-2 gap-4">
              <div className="h-[250px] rounded-md border-1 border-stone-200 p-3 shadow-md">
                <div className="flex h-full w-full flex-wrap items-center justify-center gap-4 text-sm text-gray-700">
                  <div className="flex h-24 w-[30%] flex-col justify-center rounded-md border-1 border-stone-200 p-3 text-sm shadow-md">
                    <Label className="w-full pb-2 text-center">💧 Water Level</Label>
                    <hr />

                    <div className="pt-1 text-center">
                      <p>{ps.waterlevel.toFixed(2)}</p>{" "}
                    </div>
                  </div>
                  <div className="flex h-24 w-[30%] flex-col justify-center rounded-md border-1 border-stone-200 p-3 text-sm shadow-md">
                    <Label className="w-full pb-2 text-center">⚙️ Pressure</Label>
                    <hr />

                    <div className="pt-1 text-center">
                      <p>{ps.pressure.toFixed(2)}</p>{" "}
                    </div>
                  </div>

                  <div className="flex h-24 w-[30%] flex-col justify-center rounded-md border-1 border-stone-200 p-3 text-sm shadow-md">
                    <Label className="w-full pb-2 text-center">🌊 Flowmeter</Label>
                    <hr />

                    <div className="pt-1 text-center">
                      <p>{ps.flowmeter.toFixed(2)}</p>{" "}
                    </div>
                  </div>
                  <div className="flex h-24 w-[30%] flex-col justify-center rounded-md border-1 border-stone-200 p-3 text-sm shadow-md">
                    <Label className="w-full pb-2 text-center">🔬 Turbidity</Label>
                    <hr />

                    <div className="pt-1 text-center">
                      <p>{ps.turbidity.toFixed(2)}</p>{" "}
                    </div>
                  </div>

                  <div className="flex h-24 w-[30%] flex-col justify-center rounded-md border-1 border-stone-200 p-3 text-sm shadow-md">
                    <Label className="w-full pb-2 text-center">💨 Humidity</Label>
                    <hr />

                    <div className="pt-1 text-center">
                      <p>{ps.humidity.toFixed(2)}</p>{" "}
                    </div>
                  </div>
                  <div className="flex h-24 w-[30%] flex-col justify-center rounded-md border-1 border-stone-200 p-3 text-sm shadow-md">
                    <Label className="w-full pb-2 text-center">☣️ Chlorine</Label>
                    <hr />

                    <div className="pt-1 text-center">
                      <p>{ps.chlorine.toFixed(2)}</p>{" "}
                    </div>
                  </div>
                </div>
              </div>
              {/* <ChartContainer config={chartConfig} className="h-1/3 min-h-[200px] px-4">
                <LineChart
                  accessibilityLayer
                  data={pumpData.filter((lps) => {
                    if (lps.name === ps.name) {
                      const ts = new Date(lps.timestamp);

                      const startDate = date?.from
                        ? date.from
                        : new Date(2025, 9, 1);

                      const endDate = date?.to ? addHours(date.to, 24) : addHours(new Date(2025, 10, 13), 24);

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
                        var formattedTime = "NAN";
                        try {
                          // format time for Philippine timezone
                          formattedTime = new Intl.DateTimeFormat("en-PH", {
                            hour: "2-digit",
                            minute: "2-digit",
                            second: "2-digit",
                            timeZone: "Asia/Manila",
                          }).format(new Date(label));
                        } catch (e) {}

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
                  /> */}

              {/* 🟩 Add legend here */}
              {/* <Legend verticalAlign="top" align="center" />
                  <Line dataKey="waterlevel" stroke={chartConfig.waterLevel.color} dot={false} />
                  <Line dataKey="pressure" stroke={chartConfig.pressure.color} dot={false} />
                  <Line dataKey="flowmeter" stroke={chartConfig.flowMeter.color} dot={false} />
                  <Line dataKey="turbidity" stroke={chartConfig.turbidity.color} dot={false} />
                  <Line dataKey="humidity" stroke={chartConfig.humidity.color} dot={false} />
                  <Line dataKey="chlorine" stroke={chartConfig.chlorine.color} dot={false}/>
                </LineChart>
               
              </ChartContainer> */}
            </div>
            <div className="h-[250px] w-[65%] bg-gray-200/60">
              <ChartContainer config={chartConfig} className="h-1/3 min-h-[250px] w-full px-4">
                <LineChart
                  accessibilityLayer
                  data={pumpData.filter((lps) => {
                    if (lps.name.toLowerCase() === ps.name.toLowerCase()) {
                      const ts = new Date(lps.timestamp);

                      const startDate = date?.from ? date.from : new Date(2025, 9, 1);

                      const endDate = date?.to ? addHours(date.to, 24) : addHours(new Date(2025, 10, 13), 24);

                      return isWithinInterval(ts, { start: startDate, end: endDate });
                    }
                  })}
                >
                  <XAxis
                    dataKey="timestamp"
                    tickFormatter={(value) => {
                      // Format ISO to HH:MM:SS or whatever format you like
                      const date = new Date(value);
                      return `${date.getMonth() + 1}/${date.getDate()}`;
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
                  <Line dataKey="waterlevel" stroke={chartConfig.waterLevel.color} dot={false} />
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
        </SheetContent>
      </Sheet>
    </>
  );
};

export default PumpingStationCard;
