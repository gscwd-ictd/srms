import { useCardStore } from "@srms/components/stores/useCardStore";
import { useLoggerStore } from "@srms/components/stores/useLoggerStore";
import { Label } from "@srms/components/ui/Label";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@srms/components/ui/Sheet";
import { MultilogLogger } from "@srms/lib/pms/types";
import { FunctionComponent, useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { isEmpty } from "@srms/utils/isEmpty";
import { Calendar } from "@srms/components/ui/Calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@srms/components/ui/Popover";
import { Button } from "@srms/components/ui/Button";
import { CalendarIcon } from "lucide-react";
import { cn } from "@srms/utils/shadcn";
import { DateRange } from "react-day-picker";
import { format, isWithinInterval } from "date-fns";
import { Legend, Line, LineChart, Tooltip, XAxis, YAxis } from "recharts";
import { ChartConfig, ChartContainer } from "@srms/components/ui/Chart";
import dayjs from "dayjs";
import { Switch } from "@srms/components/ui/Switch";
import StreetView from "../streetView/StreetView";
import { usePositionStore } from "@srms/components/stores/usePositionStore";

interface MultilogDetailsCardDrops {
  open: boolean;
  featureData: MultilogLogger | undefined;
}

// type PressureChartLogs = {
//   timestamp: string;
//   value: number;
// };

type TransformedPressure = {
  timestamp: string;
  Pressure: number;
  FlowMeter: number;
};

const MultilogDetailsCard: FunctionComponent<MultilogDetailsCardDrops> = ({ open, featureData }) => {
  const [loadingLatestLog, setLoadingLatestLog] = useState<boolean>(false);

  const { latestMultilogPressureFlowLog, setLatestMultilogPressureFlowLog } = useLoggerStore();
  const [isStreetView, setIsStreetView] = useState(false);
  const { setMultilogDetailsCardOpen } = useCardStore();
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    to: new Date(Date.now()),
  });

  // const setLat = usePositionStore((state) => state.setLat);
  // const setLng = usePositionStore((state) => state.setLng);
  const selectedLat = usePositionStore((state) => state.lat);
  const selectedLng = usePositionStore((state) => state.lng);

  const pressureChartLogs: TransformedPressure[] = [
    {
      timestamp: "2025-11-28 00:00:00",
      Pressure: -0.221,
      FlowMeter: 9.52,
    },
    {
      timestamp: "2025-11-28 01:00:00",
      Pressure: -0.132,
      FlowMeter: 9.52,
    },
    {
      timestamp: "2025-11-30 02:00:00",

      Pressure: -0.396,
      FlowMeter: 9.52,
    },
    {
      timestamp: "2025-12-01 03:00:00",

      Pressure: -0.351,
      FlowMeter: 8.52,
    },
    {
      timestamp: "2025-12-01 04:00:00",
      Pressure: -0.551,
      FlowMeter: 7.52,
    },
    {
      timestamp: "2025-12-03 05:00:00",
      Pressure: -0.159,
      FlowMeter: 8.82,
    },
    {
      timestamp: "2025-12-04 06:00:00",
      Pressure: -0.236,
      FlowMeter: 9.22,
    },
    {
      timestamp: "2025-12-05 07:00:00",
      Pressure: -0.351,
      FlowMeter: 8.29,
    },
    {
      timestamp: "2025-12-05 08:00:00",
      Pressure: -0.671,
      FlowMeter: 7.63,
    },
    {
      timestamp: "2025-12-05 09:00:00",
      Pressure: -0.485,
      FlowMeter: 8.52,
    },
  ];
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

  const latestFlowPressureLogMutation = useMutation({
    mutationKey: ["latest-pressure-log"],
    mutationFn: async (serialNumber: string) => {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_APP_URL}/api/v1/multilog-iot-loggers/entry/latest/${serialNumber}`,
        {},
      );
      return response.data;
    },
    onMutate: () => {
      setLoadingLatestLog(true);
    },
    onSuccess: async (data) => {
      setLoadingLatestLog(false);
      setLatestMultilogPressureFlowLog(data);
    },
    onError: (error: AxiosError<{ message: string }>) => {
      setLoadingLatestLog(false);

      console.log(error);
    },
  });

  // function transformPressureData(logs: PressureChartLogs[]): TransformedPressure[] {
  //   return logs.map((item) => ({
  //     timestamp: item.timestamp,
  //     Pressure: item.value, // rename value → Pressure
  //   }));
  // }

  const channelChecker = (ch: string) => {
    const isChannelExist = latestMultilogPressureFlowLog[0]?.channels.some(
      (channel) => channel.measurement?.name === ch,
    );

    return isChannelExist;
  };

  const latestPressureValue = () => {
    if (
      latestMultilogPressureFlowLog[0]?.channels !== undefined &&
      latestMultilogPressureFlowLog[0]?.channels?.length > 0
    ) {
      const entry = latestMultilogPressureFlowLog[0]?.channels.find(
        (channel) => channel.measurement.name === "Pressure",
      );
      console.log(entry);
      return (
        <p className="text-xl font-bold">
          {entry?.lastValue} <br /> <span className="text-sm font-medium">psi</span>
        </p>
      );
    } else {
      return <p className="text-md text-red-400">No Latest Entries</p>;
    }
  };

  const latestFlowValue = () => {
    if (
      latestMultilogPressureFlowLog[0]?.channels !== undefined &&
      latestMultilogPressureFlowLog[0]?.channels?.length > 0
    ) {
      const entry = latestMultilogPressureFlowLog[0]?.channels.find(
        (channel) => channel.measurement.name === "Flow",
      );

      return (
        <p className="text-xl font-bold">
          {entry?.lastValue} <br />{" "}
          <span className="text-sm font-medium">
            m<sup>3</sup>/hr
          </span>
        </p>
      );
    } else {
      return <p className="text-md text-red-400">No Latest Entries</p>;
    }
  };

  useEffect(() => {
    const intervalSeconds = Number(process.env.NEXT_PUBLIC_INTERVAL_SECONDS);

    if (open && !isEmpty(featureData?.serialNumber)) {
      latestFlowPressureLogMutation.mutate(featureData!.serialNumber);

      // every 10 seconds, fetch data from selected logger
      const intervalId = setInterval(() => {
        latestFlowPressureLogMutation.mutate(featureData!.serialNumber);
      }, intervalSeconds);

      // if (featureData?.latitude && featureData?.longitude) {
      //   setLat(Number(featureData.latitude));
      //   setLng(Number(featureData.longitude));
      // } else {
      //   setLat(0);
      //   setLng(0);
      // }

      return () => clearInterval(intervalId);
    }
  }, [open, featureData]);

  // // options for line chart design/UI
  // const lineChartOptions = {
  //   responsive: true,
  //   maintainAspectRatio: false, // key for stretching
  //   plugins: {
  //     legend: {
  //       display: true,
  //       labels: {
  //         color: "#1a1919ff", // Set the desired color here
  //         font: {
  //           size: 14,
  //         },
  //       },
  //     },
  //   },
  //   scales: {
  //     x: {
  //       ticks: {
  //         color: "#000000ff", // color of x labels
  //         font: {
  //           size: 10,
  //         },
  //       },
  //       grid: {
  //         color: "#d1d1d1ff", // color of x grid
  //       },
  //     },
  //     y: {
  //       ticks: {
  //         color: "#000000ff", // color of y labels
  //       },
  //       grid: {
  //         color: "#d1d1d1ff", // color of y grid
  //       },
  //     },
  //   },
  // };

  const handleStreetView = () => {
    if (isStreetView) {
      setIsStreetView(false);
    } else {
      setIsStreetView(true);
    }
  };

  return (
    <Sheet open={open} onOpenChange={setMultilogDetailsCardOpen} modal={false}>
      <SheetContent
        className="h-[380px] w-full gap-0 border border-stone-300 bg-white/90 text-black backdrop-blur"
        side="bottom"
        onInteractOutside={(e) => e.preventDefault()}
      >
        <SheetHeader className="m-5 p-0">
          <SheetTitle className="text-black">
            <div className="flex flex-row">
              <div>{featureData?.serialNumber || "--"}</div>
              <div className="flex items-center space-x-2 px-4">
                <Switch
                  id="data-mode"
                  checked={isStreetView}
                  onCheckedChange={handleStreetView}
                  className="data-[state=checked]:bg-lime-400 data-[state=unchecked]:bg-slate-300"
                />

                <Label htmlFor="data-mode">{!isStreetView ? "Street View" : "Street View"}</Label>
              </div>
            </div>
          </SheetTitle>
          <SheetDescription className="flex flex-row gap-4 text-stone-600">
            <label className="w-[30%]"> {featureData?.siteName || "--"} | Multilog Source</label>

            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="default"
                  className={cn(
                    "w-[280px] justify-start text-left font-normal text-black",
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
            <div className="h-[120px] rounded-md border-1 border-stone-200 p-3 shadow-md">
              <div className="flex flex-col space-x-1.5 text-sm">
                <Label className="w-full pb-2 text-center">Discharge Pressure</Label>
                <hr />
                {channelChecker("Pressure") ? (
                  loadingLatestLog ? (
                    <div className="pt-4 text-center">--</div>
                  ) : (
                    <div id="pressure" className="pt-4 text-center">
                      {latestPressureValue()}
                    </div>
                  )
                ) : (
                  <div className="pt-4 text-center text-red-400">Pressure Channel Not Registered</div>
                )}
              </div>
            </div>

            <div className="h-[120px] rounded-md border-1 border-stone-200 p-3 shadow-md">
              <div className="flex flex-col space-x-1.5 text-sm">
                <Label className="w-full pb-2 text-center">Flow Meter</Label>
                <hr />

                {channelChecker("Flow") ? (
                  loadingLatestLog ? (
                    <div className="pt-4 text-center">--</div>
                  ) : (
                    <div id="pressure" className="pt-4 text-center">
                      {latestFlowValue()}
                    </div>
                  )
                ) : (
                  <div className="pt-4 text-center text-red-400">Flow Channel Not Registered</div>
                )}
              </div>
            </div>
          </div>

          <div className="h-[250px] w-[65%] bg-gray-200/60">
            {isStreetView ? (
              <div className="flex h-full w-full items-center justify-center bg-stone-300 text-black">
                <StreetView lat={selectedLat} lng={selectedLng} />
              </div>
            ) : (
              <ChartContainer config={chartConfig} className="h-1/3 min-h-[250px] w-full px-4">
                <LineChart
                  accessibilityLayer
                  data={pressureChartLogs.filter((lps) => {
                    const ts = new Date(lps.timestamp);
                    const startDate = date?.from
                      ? `${dayjs(date.from).format("YYYY-MM-DD")} 00:00`
                      : `${dayjs().format("YYYY-MM-DD")} 00:00`;
                    const endDate = date?.to
                      ? `${dayjs(date.to).format("YYYY-MM-DD")} 23:59`
                      : date?.from
                        ? `${dayjs(date.from).format("YYYY-MM-DD")} 23:59`
                        : `${dayjs().format("YYYY-MM-DD")} 23:59`;

                    return isWithinInterval(ts, { start: startDate, end: endDate });
                  })}
                >
                  <XAxis
                    dataKey="timestamp"
                    tickFormatter={(value) => {
                      // Format ISO to HH:MM:SS or whatever format you like
                      const date = new Date(value);
                      // return `${date.getMonth()}/${date.getDate()}`;
                      return `${dayjs(date).format("MM/DD")}`;
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
                  <Line dataKey="Pressure" stroke={chartConfig.pressure.color} dot={false} />
                  <Line dataKey="FlowMeter" stroke={chartConfig.flowMeter.color} dot={false} />
                </LineChart>
              </ChartContainer>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MultilogDetailsCard;
