import { useCardStore } from "@srms/components/stores/useCardStore";
import { useLoggerStore } from "@srms/components/stores/useLoggerStore";
import { Label } from "@srms/components/ui/Label";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@srms/components/ui/Sheet";
import { LatestLoggerEntryFilter, LoggerDetails } from "@srms/lib/pms/types";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { FunctionComponent, useEffect, useState } from "react";
import Chart from "chart.js/auto";
import { CategoryScale } from "chart.js";
Chart.register(CategoryScale);
// import { Line } from "react-chartjs-2";
import dayjs from "dayjs";
import { ChartConfig, ChartContainer } from "@srms/components/ui/Chart";
import { Legend, Line, LineChart, Tooltip, XAxis, YAxis } from "recharts";
import { Popover, PopoverContent, PopoverTrigger } from "@srms/components/ui/Popover";
import { Button } from "@srms/components/ui/Button";
import { CalendarIcon } from "lucide-react";
import { format, isWithinInterval } from "date-fns";
import { cn } from "@srms/utils/shadcn";
import { DateRange } from "react-day-picker";
import { Calendar } from "@srms/components/ui/Calendar";

interface XilogDetailsCardDrops {
  open: boolean;
  featureData: LoggerDetails | undefined;
}

type pressureChartLogs = {
  timestamp: string;
  value: number;
};

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

const XilogDetailsCard: FunctionComponent<XilogDetailsCardDrops> = ({ open, featureData }) => {
  const [loadingLatestPressureLog, setLoadingLatestPressureLog] = useState<boolean>(false);
  const [loadingLatestFlowLog, setLoadingLatestFlowLog] = useState<boolean>(false);
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    to: new Date(Date.now()),
  });

  const {
    // pressureChannelLogs,
    // setPressureChannelLogs,
    latestPressureLog,
    setLatestPressureLog,
    flowChannelLogs,
    setFlowChannelLogs,
  } = useLoggerStore();

  const { setXilogDetailsCardOpen } = useCardStore();

  const [pressureChartLogs, setPressureChartLogs] = useState<pressureChartLogs[]>([]);

  const pressureChartLog = useMutation({
    mutationKey: ["latest-pressurechart-log"],
    mutationFn: async (loggerData: LatestLoggerEntryFilter) => {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_APP_URL}/api/v1/xilog-iot-logger/entries`,
        {
          serialNumber: `${loggerData?.serialNumber}`,
          channel: `${loggerData?.channel}`, // pressure
          startDateTime: date?.from
            ? `${dayjs(date.from).format("YYYY-MM-DD")} 00:00`
            : `${dayjs().format("YYYY-MM-DD")} 00:00`,
          endDateTime: date?.to
            ? `${dayjs(date.to).format("YYYY-MM-DD")} 23:59`
            : `${dayjs().format("YYYY-MM-DD")} 23:59`,
        },
        {},
      );
      return response.data;
    },
    onMutate: () => {
      // setLoadingLatestPressureLog(true);
    },
    onSuccess: async (data) => {
      // setLoadingLatestPressureLog(false);
      setPressureChartLogs(data.data);
    },
    onError: (error: AxiosError<{ message: string }>) => {
      // setLoadingLatestPressureLog(false);
      console.log(error);
    },
  });

  useEffect(() => {
    console.log(
      `${dayjs(date?.from).format("YYYY-MM-DD")} 00:00`,
      `${dayjs(date?.to).format("YYYY-MM-DD")} 23:59`,
    );
  }, [date]);

  useEffect(() => {
    console.log(pressureChartLog);
  }, [pressureChartLog]);

  const latestPressureLogMutation = useMutation({
    mutationKey: ["latest-pressure-log"],
    mutationFn: async (loggerData: LatestLoggerEntryFilter) => {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_APP_URL}/api/v1/xilog-iot-logger/entries/latest/${loggerData?.serialNumber}/${loggerData.channel}`,
        {},
      );
      return response.data;
    },
    onMutate: () => {
      setLoadingLatestPressureLog(true);
    },
    onSuccess: async (data) => {
      setLoadingLatestPressureLog(false);

      setLatestPressureLog(data);
    },
    onError: (error: AxiosError<{ message: string }>) => {
      setLoadingLatestPressureLog(false);

      console.log(error);
    },
  });

  const latestFlowLogMutation = useMutation({
    mutationKey: ["latest-flow-log"],
    mutationFn: async (loggerData: LatestLoggerEntryFilter) => {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_APP_URL}/api/v1/xilog-iot-logger/entries/latest/${loggerData?.serialNumber}/${loggerData.channel}`,
        {},
      );
      return response.data;
    },
    onMutate: () => {
      setLoadingLatestFlowLog(true);
    },
    onSuccess: async (data) => {
      setLoadingLatestFlowLog(false);

      setFlowChannelLogs(data);
    },
    onError: (error: AxiosError<{ message: string }>) => {
      setLoadingLatestFlowLog(false);

      console.log(error);
    },
  });

  const latestPressureValue = () => {
    if (latestPressureLog?.data?.length > 0) {
      const entries = latestPressureLog.data;
      // console.log(latestPressureLog.data);
      // AddPressure(Math.round(entries[entries.length - 1]!.value * 1000) / 1000);
      return (
        <p className="text-xl font-bold">
          {`${Math.round(entries[entries.length - 1]!.value * 1000) / 1000}`} <br />{" "}
          <span className="text-sm font-medium">psi</span>
        </p>
      );
    } else {
      return <p className="text-md text-black">No Latest Entries</p>;
    }
  };

  const latestFlowValue = () => {
    if (flowChannelLogs?.data?.length > 0) {
      const entries = flowChannelLogs.data;
      // console.log(flowChannelLogs.data);
      // AddFlow(Math.round(entries[entries.length - 1]!.value * 1000) / 1000);

      return (
        <p className="text-xl font-bold">
          {`${Math.round(entries[entries.length - 1]!.value * 1000) / 1000}`} <br />{" "}
          <span className="text-sm font-medium">
            m<sup>3</sup>/hr
          </span>
        </p>
      );
    } else {
      return <p className="text-md text-black">No Latest Entries</p>;
    }
  };

  const channelChecker = (ch: string) => {
    const isChannelExist = featureData?.channels.some((channel) => channel.index === ch);

    return isChannelExist;
  };

  useEffect(() => {
    const intervalSeconds = Number(process.env.NEXT_PUBLIC_INTERVAL_SECONDS);

    if (open) {
      // For Pressure
      if (channelChecker("A1")) {
        const loggerData: LatestLoggerEntryFilter = {
          serialNumber: `${featureData?.serial}`,
          channel: "A1", // pressure
        };

        pressureChartLog.mutate(loggerData);
        latestPressureLogMutation.mutate(loggerData);
        // every 10 seconds, fetch data from selected logger
        const intervalId = setInterval(() => {
          latestPressureLogMutation.mutate(loggerData);
        }, intervalSeconds);

        return () => clearInterval(intervalId);
      }
    }
  }, [open, featureData]);

  useEffect(() => {
    const intervalSeconds = Number(process.env.NEXT_PUBLIC_INTERVAL_SECONDS);

    if (open) {
      // For Flow
      if (channelChecker("D1a")) {
        // console.log("D1a", channelChecker("D1a"));
        const loggerData: LatestLoggerEntryFilter = {
          serialNumber: `${featureData?.serial}`,
          channel: "D1a", // flow
        };

        latestFlowLogMutation.mutate(loggerData);
        // every 10 seconds, fetch data from selected logger
        const intervalId = setInterval(() => {
          latestFlowLogMutation.mutate(loggerData);
        }, intervalSeconds);

        return () => clearInterval(intervalId);
      }
    }
  }, [open, featureData]);

  useEffect(() => {
    //reset line chart
    // setPressureChartLogs([]);
  }, [open, featureData]);

  return (
    <Sheet open={open} onOpenChange={setXilogDetailsCardOpen} modal={false}>
      <SheetContent
        className="h-[380px] w-full gap-0 border border-stone-300 bg-white/90 text-black backdrop-blur"
        side="bottom"
        onInteractOutside={(e) => e.preventDefault()}
      >
        <SheetHeader className="m-5 p-0">
          <SheetTitle className="text-black">{featureData?.serial || "--"}</SheetTitle>
          <SheetDescription className="flex flex-row gap-4 text-stone-600">
            <label className="w-[30%]"> {featureData?.name || "--"} | Xilog Source</label>
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

        <div className="mx-5 flex gap-5">
          <div className="grid w-[30%] grid-rows-2 gap-4">
            <div className="h-[120px] rounded-md border-1 border-stone-200 p-3 shadow-md">
              <div className="flex flex-col space-x-1.5 text-sm">
                <Label className="w-full pb-2 text-center">Discharge Pressure</Label>
                <hr />

                {channelChecker("A1") ? (
                  loadingLatestPressureLog ? (
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

                {channelChecker("D1a") ? (
                  loadingLatestFlowLog ? (
                    <div className="pt-4 text-center">--</div>
                  ) : (
                    <div id="flow" className="pt-4 text-center">
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
                      const sorted = [...payload].sort((a, b) => Number(b.value ?? 0) - Number(a.value ?? 0));
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
                <Line dataKey="value" stroke={chartConfig.waterLevel.color} dot={false} />
                {/* <Line dataKey="pressure" stroke={chartConfig.pressure.color} dot={false} />
                <Line dataKey="flowmeter" stroke={chartConfig.flowMeter.color} dot={false} />
                <Line dataKey="turbidity" stroke={chartConfig.turbidity.color} dot={false} />
                <Line dataKey="humidity" stroke={chartConfig.humidity.color} dot={false} />
                <Line dataKey="chlorine" stroke={chartConfig.chlorine.color} dot={false} /> */}
              </LineChart>
            </ChartContainer>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default XilogDetailsCard;
