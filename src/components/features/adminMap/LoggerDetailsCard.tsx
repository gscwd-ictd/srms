import { useCardStore } from "@srms/components/stores/useCardStore";
import { useLoggerStore } from "@srms/components/stores/useLoggerStore";
import { Spinner } from "@srms/components/ui-custom/Spinner";
import { Label } from "@srms/components/ui/Label";
// import { ScrollArea } from "@srms/components/ui/ScrollArea";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@srms/components/ui/Sheet";
import { LatestLoggerEntryFilter, LoggerDetails } from "@srms/lib/pms/types";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { FunctionComponent, useEffect, useState } from "react";

interface LoggerDetailsCardDrops {
  open: boolean;
  featureData: LoggerDetails | undefined;
}

const LoggerDetailsCard: FunctionComponent<LoggerDetailsCardDrops> = ({ open, featureData }) => {
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

  const { setLoggerDetailsCardOpen } = useCardStore();

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
      return (
        <p className="text-xl font-bold">
          {`${Math.round(entries[entries.length - 1]!.value * 1000) / 1000}`} <br />{" "}
          <span className="text-sm font-medium">psi</span>
        </p>
      );
    } else {
      return <p className="text-md text-red-400">No Latest Entries</p>;
    }
  };

  const latestFlowValue = () => {
    if (flowChannelLogs?.data?.length > 0) {
      const entries = flowChannelLogs.data;
      return (
        <p className="text-xl font-bold">
          {`${Math.round(entries[entries.length - 1]!.value * 1000) / 1000}`} <br />{" "}
          <span className="text-sm font-medium">
            m<sup>3</sup>/hr
          </span>
        </p>
      );
    } else {
      return <p className="text-md text-red-400">No Latest Entries</p>;
    }
  };

  const channelChecker = (ch: string) => {
    const isChannelExist = featureData?.channels.some((channel) => channel.index === ch);

    return isChannelExist;
  };

  // Valve type badge design
  // const badgeValveType = (type: string) => {
  //   if (type === ValveCodeTypes.ISO) {
  //     return (
  //       <Badge variant="secondary" className="bg-red-500 text-white dark:bg-red-600">
  //         {ValveNameTypes.ISO}
  //       </Badge>
  //     );
  //   } else if (type === ValveCodeTypes.BOV) {
  //     return (
  //       <Badge variant="secondary" className="bg-violet-500 text-white dark:bg-violet-600">
  //         {ValveNameTypes.BOV}
  //       </Badge>
  //     );
  //   } else if (type === ValveCodeTypes.PROD) {
  //     return (
  //       <Badge variant="secondary" className="bg-yellow-500 text-white dark:bg-yellow-600">
  //         {ValveNameTypes.PROD}
  //       </Badge>
  //     );
  //   } else if (type === ValveCodeTypes.PRV) {
  //     return (
  //       <Badge variant="secondary" className="bg-blue-500 text-white dark:bg-blue-600">
  //         {ValveNameTypes.PRV}
  //       </Badge>
  //     );
  //   } else if (type === ValveCodeTypes.SCV) {
  //     return (
  //       <Badge variant="secondary" className="bg-orange-500 text-white dark:bg-orange-600">
  //         {ValveNameTypes.SCV}
  //       </Badge>
  //     );
  //   } else if (type === ValveCodeTypes.ARV) {
  //     return (
  //       <Badge variant="secondary" className="bg-green-500 text-white dark:bg-green-600">
  //         {ValveNameTypes.ARV}
  //       </Badge>
  //     );
  //   } else {
  //     return (
  //       <Badge variant="secondary" className="bg-gray-500 text-white dark:bg-gray-600">
  //         No Data
  //       </Badge>
  //     );
  //   }
  // };

  // Valve status badge design
  // const badgeValveStatus = (status: string) => {
  //   if (status === ValveStatus.OPEN) {
  //     return (
  //       <Badge variant="secondary" className="bg-blue-500 text-white dark:bg-blue-600">
  //         {ValveStatus.OPEN}
  //       </Badge>
  //     );
  //   } else if (status === ValveStatus.CLOSE) {
  //     return (
  //       <Badge variant="secondary" className="bg-red-500 text-white dark:bg-red-600">
  //         {ValveStatus.CLOSE}
  //       </Badge>
  //     );
  //   } else {
  //     return (
  //       <Badge variant="secondary" className="bg-violet-500 text-white dark:bg-violet-600">
  //         No Data
  //       </Badge>
  //     );
  //   }
  // };

  useEffect(() => {
    const intervalSeconds = Number(process.env.NEXT_PUBLIC_INTERVAL_SECONDS);

    if (open) {
      // For Pressure
      if (channelChecker("A1")) {
        // console.log("A1", channelChecker("A1"));
        const loggerData: LatestLoggerEntryFilter = {
          serialNumber: `${featureData?.serial}`,
          channel: "A1", // pressure
          // startDateTime: `${dayjs().format("YYYY-MM-DD")} 00:00`,
          // endDateTime: `${dayjs().format("YYYY-MM-DD")} 23:59`,
        };

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
          channel: "D1a", // pressure
          // startDateTime: `${dayjs().format("YYYY-MM-DD")} 00:00`,
          // endDateTime: `${dayjs().format("YYYY-MM-DD")} 23:59`,
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

  return (
    <Sheet open={open} onOpenChange={setLoggerDetailsCardOpen} modal={false}>
      <SheetContent
        className="h-[380px] w-full gap-0 border border-stone-300 bg-white text-black"
        side="bottom"
        onInteractOutside={(e) => e.preventDefault()}
      >
        <SheetHeader className="m-5 p-0">
          <SheetTitle className="text-black">{featureData?.serial || "--"}</SheetTitle>
          <SheetDescription className="text-stone-600">{featureData?.name || "--"}</SheetDescription>
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
                  <hr />

                  {loadingLatestPressureLog ? (
                    <div className="pt-4">
                      <Spinner size={"sm"} />
                    </div>
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
                  <hr />

                  {loadingLatestFlowLog ? (
                    <div className="pt-4">
                      <Spinner size={"sm"} />
                    </div>
                  ) : (
                    <div id="flow" className="pt-4 text-center">
                      {latestFlowValue()}
                    </div>
                  )}
                </div>
              </div>
            ) : null}
          </div>

          <div className="w-[70%]">This is where chart be</div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default LoggerDetailsCard;
