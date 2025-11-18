import { useCardStore } from "@srms/components/stores/useCardStore";
import { useLoggerStore } from "@srms/components/stores/useLoggerStore";
import { Label } from "@srms/components/ui/Label";
// import { ScrollArea } from "@srms/components/ui/ScrollArea";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@srms/components/ui/Sheet";
import { LatestLoggerEntryFilter, LoggerDetails } from "@srms/lib/pms/types";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { FunctionComponent, useEffect, useState } from "react";
import Chart from "chart.js/auto";
import { CategoryScale } from "chart.js";
Chart.register(CategoryScale);
import { Line } from "react-chartjs-2";
import dayjs from "dayjs";

interface XilogDetailsCardDrops {
  open: boolean;
  featureData: LoggerDetails | undefined;
}

<<<<<<< HEAD:src/components/features/adminMap/LoggerDetailsCard.tsx
type pressureChartLogs = {
  timestamp: string;
  value: number;
};

const LoggerDetailsCard: FunctionComponent<LoggerDetailsCardDrops> = ({ open, featureData }) => {
=======
const XilogDetailsCard: FunctionComponent<XilogDetailsCardDrops> = ({ open, featureData }) => {
>>>>>>> b99b136e9b58059543e668a4fe9c1d5814eb6d3a:src/components/features/adminMap/XilogDetailsCard.tsx
  const [loadingLatestPressureLog, setLoadingLatestPressureLog] = useState<boolean>(false);
  const [loadingLatestFlowLog, setLoadingLatestFlowLog] = useState<boolean>(false);

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
          startDateTime: `${dayjs().format("YYYY-MM-DD")} 00:00`,
          endDateTime: `${dayjs().format("YYYY-MM-DD")} 23:59`,
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

  // const { data: loggerDataForTheDay, isLoading: loadingLoggerDataForTheDay } = useQuery({
  //   queryKey: ["get-all-pipelines"],
  //   refetchOnReconnect: false,
  //   refetchOnMount: false,
  //   refetchOnWindowFocus: false,
  //   queryFn: async () => {
  //     const { data } = await axios.post(
  //       `${process.env.NEXT_PUBLIC_APP_URL}/api/v1/xilog-/entries`,
  //       {
  //         serialNumber: `${featureData?.serial}`,
  //         channel: `${featureData?.channels[0]?.index}`, // pressure
  //         startDateTime: `${dayjs().format("YYYY-MM-DD")} 00:00`,
  //         endDateTime: `${dayjs().format("YYYY-MM-DD")} 23:59`,
  //       },
  //       {},
  //     );

  //     return data;
  //   },
  //   throwOnError: true,
  // });

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

<<<<<<< HEAD:src/components/features/adminMap/LoggerDetailsCard.tsx
  // Valve type badge design
  // const badgeValveType = (type: string) => {
  //   if (type === ValveCodeTypes.ISO) {
  //     return (
  //       <Badge variant="secondary" className="bg-red-500 text-black dark:bg-red-600">
  //         {ValveNameTypes.ISO}
  //       </Badge>
  //     );
  //   } else if (type === ValveCodeTypes.BOV) {
  //     return (
  //       <Badge variant="secondary" className="bg-violet-500 text-black dark:bg-violet-600">
  //         {ValveNameTypes.BOV}
  //       </Badge>
  //     );
  //   } else if (type === ValveCodeTypes.PROD) {
  //     return (
  //       <Badge variant="secondary" className="bg-yellow-500 text-black dark:bg-yellow-600">
  //         {ValveNameTypes.PROD}
  //       </Badge>
  //     );
  //   } else if (type === ValveCodeTypes.PRV) {
  //     return (
  //       <Badge variant="secondary" className="bg-blue-500 text-black dark:bg-blue-600">
  //         {ValveNameTypes.PRV}
  //       </Badge>
  //     );
  //   } else if (type === ValveCodeTypes.SCV) {
  //     return (
  //       <Badge variant="secondary" className="bg-orange-500 text-black dark:bg-orange-600">
  //         {ValveNameTypes.SCV}
  //       </Badge>
  //     );
  //   } else if (type === ValveCodeTypes.ARV) {
  //     return (
  //       <Badge variant="secondary" className="bg-green-500 text-black dark:bg-green-600">
  //         {ValveNameTypes.ARV}
  //       </Badge>
  //     );
  //   } else {
  //     return (
  //       <Badge variant="secondary" className="bg-gray-500 text-black dark:bg-gray-600">
  //         No Data
  //       </Badge>
  //     );
  //   }
  // };

  // Valve status badge design
  // const badgeValveStatus = (status: string) => {
  //   if (status === ValveStatus.OPEN) {
  //     return (
  //       <Badge variant="secondary" className="bg-blue-500 text-black dark:bg-blue-600">
  //         {ValveStatus.OPEN}
  //       </Badge>
  //     );
  //   } else if (status === ValveStatus.CLOSE) {
  //     return (
  //       <Badge variant="secondary" className="bg-red-500 text-black dark:bg-red-600">
  //         {ValveStatus.CLOSE}
  //       </Badge>
  //     );
  //   } else {
  //     return (
  //       <Badge variant="secondary" className="bg-violet-500 text-black dark:bg-violet-600">
  //         No Data
  //       </Badge>
  //     );
  //   }
  // };

=======
>>>>>>> b99b136e9b58059543e668a4fe9c1d5814eb6d3a:src/components/features/adminMap/XilogDetailsCard.tsx
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
    <Sheet open={open} onOpenChange={setXilogDetailsCardOpen} modal={false}>
      <SheetContent
        className="h-[380px] w-full gap-0 border border-stone-300 bg-white/70 text-black backdrop-blur"
        side="bottom"
        onInteractOutside={(e) => e.preventDefault()}
      >
        <SheetHeader className="m-5 p-0">
          <SheetTitle className="text-black">{featureData?.serial || "--"}</SheetTitle>
<<<<<<< HEAD:src/components/features/adminMap/LoggerDetailsCard.tsx
          <SheetDescription className="text-black">{featureData?.name || "--"}</SheetDescription>
=======
          <SheetDescription className="text-stone-600">
            {featureData?.name || "--"} | Xilog Source
          </SheetDescription>
>>>>>>> b99b136e9b58059543e668a4fe9c1d5814eb6d3a:src/components/features/adminMap/XilogDetailsCard.tsx
        </SheetHeader>

        {/* <div className="mx-3">
            <Alert className="text-center uppercase">
              <AlertTitle>{selectedWaterMeter.properties?.status || "--"}</AlertTitle>
            </Alert>
          </div> */}
        <div className="mx-5 flex gap-5">
          <div className="grid w-[30%] grid-rows-2 gap-4">
            {channelChecker("A1") ? (
              <div className="h-[120px] rounded-md border-1 border-stone-200 p-3 shadow-md">
                <div className="flex flex-col space-x-1.5 text-sm">
                  <Label className="w-full pb-2 text-center">Discharge Pressure</Label>
                  <hr className="h-px border-none bg-gray-300" />

                  {loadingLatestPressureLog ? (
                    <div className="pt-4 text-center">--</div>
                  ) : (
                    <div id="pressure" className="pt-4 text-center">
                      {latestPressureValue()}
                    </div>
                  )}
                </div>
              </div>
            ) : null}

            {channelChecker("D1a") ? (
              <div className="h-[120px] rounded-md border-1 border-stone-200 p-3 shadow-md">
                <div className="flex flex-col space-x-1.5 text-sm">
                  <Label className="w-full pb-2 text-center">Flow Meter</Label>
                  <hr className="h-px border-none bg-gray-300" />

                  {loadingLatestFlowLog ? (
                    <div className="pt-4 text-center">--</div>
                  ) : (
                    <div id="flow" className="pt-4 text-center">
                      {latestFlowValue()}
                    </div>
                  )}
                </div>
              </div>
            ) : null}
          </div>

          <div className="h-[250px] w-[65%] bg-gray-200/60">
            <Line
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
            />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default XilogDetailsCard;
