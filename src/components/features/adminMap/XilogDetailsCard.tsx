import { useCardStore } from "@srms/components/stores/useCardStore";
import { useLoggerStore } from "@srms/components/stores/useLoggerStore";
import { Label } from "@srms/components/ui/Label";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@srms/components/ui/Sheet";
import { LatestLoggerEntryFilter, LoggerDetails } from "@srms/lib/pms/types";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { FunctionComponent, useEffect, useState } from "react";

interface XilogDetailsCardDrops {
  open: boolean;
  featureData: LoggerDetails | undefined;
}

const XilogDetailsCard: FunctionComponent<XilogDetailsCardDrops> = ({ open, featureData }) => {
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

  useEffect(() => {
    const intervalSeconds = Number(process.env.NEXT_PUBLIC_INTERVAL_SECONDS);

    if (open) {
      // For Pressure
      if (channelChecker("A1")) {
        const loggerData: LatestLoggerEntryFilter = {
          serialNumber: `${featureData?.serial}`,
          channel: "A1", // pressure
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

  return (
    <Sheet open={open} onOpenChange={setXilogDetailsCardOpen} modal={false}>
      <SheetContent
        className="h-[380px] w-full gap-0 border border-stone-300 bg-white text-black"
        side="bottom"
        onInteractOutside={(e) => e.preventDefault()}
      >
        <SheetHeader className="m-5 p-0">
          <SheetTitle className="text-black">{featureData?.serial || "--"}</SheetTitle>
          <SheetDescription className="text-stone-600">
            {featureData?.name || "--"} | Xilog Source
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

          <div className="w-[70%]">This is where chart be</div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default XilogDetailsCard;
