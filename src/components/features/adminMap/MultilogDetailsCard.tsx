import { useCardStore } from "@srms/components/stores/useCardStore";
import { useLoggerStore } from "@srms/components/stores/useLoggerStore";
import { Label } from "@srms/components/ui/Label";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@srms/components/ui/Sheet";
import { MultilogLogger } from "@srms/lib/pms/types";
import { FunctionComponent, useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { isEmpty } from "@srms/utils/isEmpty";
import { Line } from "react-chartjs-2";

interface MultilogDetailsCardDrops {
  open: boolean;
  featureData: MultilogLogger | undefined;
}

type pressureChartLogs = {
  timestamp: string;
  value: number;
};

const MultilogDetailsCard: FunctionComponent<MultilogDetailsCardDrops> = ({ open, featureData }) => {
  const [loadingLatestLog, setLoadingLatestLog] = useState<boolean>(false);

  const { latestMultilogPressureFlowLog, setLatestMultilogPressureFlowLog } = useLoggerStore();

  const { setMultilogDetailsCardOpen } = useCardStore();

  const [pressureChartLogs, setPressureChartLogs] = useState<pressureChartLogs[]>([
    {
      timestamp: "2025-11-20 00:00:00",
      value: -0.221,
    },
    {
      timestamp: "2025-11-20 01:00:00",
      value: -0.132,
    },
    {
      timestamp: "2025-11-20 02:00:00",
      value: -0.256,
    },
    {
      timestamp: "2025-11-20 03:00:00",
      value: -0.351,
    },
    {
      timestamp: "2025-11-20 04:00:00",
      value: -0.187,
    },
    {
      timestamp: "2025-11-20 05:00:00",
      value: -0.187,
    },
    {
      timestamp: "2025-11-20 06:00:00",
      value: -0.126,
    },
    {
      timestamp: "2025-11-20 07:00:00",
      value: -0.156,
    },
    {
      timestamp: "2025-11-20 08:00:00",
      value: -0.146,
    },
    {
      timestamp: "2025-11-20 09:00:00",
      value: -0.148,
    },
  ]);

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

      return () => clearInterval(intervalId);
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
          font: {
            size: 14,
          },
        },
      },
    },
    scales: {
      x: {
        ticks: {
          color: "#000000ff", // color of x labels
          font: {
            size: 10,
          },
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
    <Sheet open={open} onOpenChange={setMultilogDetailsCardOpen} modal={false}>
      <SheetContent
        className="h-[380px] w-full gap-0 border border-stone-300 bg-white/90 text-black backdrop-blur"
        side="bottom"
        onInteractOutside={(e) => e.preventDefault()}
      >
        <SheetHeader className="m-5 p-0">
          <SheetTitle className="text-black">{featureData?.serialNumber || "--"}</SheetTitle>
          <SheetDescription className="text-stone-600">
            {featureData?.siteName || "--"} | Multilog Source
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

          <div className="w-[70%]">
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

export default MultilogDetailsCard;
