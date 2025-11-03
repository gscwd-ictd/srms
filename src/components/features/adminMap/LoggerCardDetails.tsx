import { Spinner } from "@srms/components/ui-custom/Spinner";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@srms/components/ui/Accordion";
import { Label } from "@srms/components/ui/Label";
import { ScrollArea } from "@srms/components/ui/ScrollArea";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@srms/components/ui/Sheet";
import { LoggerDetails } from "@srms/lib/pms/types";
import { isEmpty } from "@srms/utils/isEmpty";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Dispatch, FunctionComponent, SetStateAction } from "react";

interface LoggerCardDetailsDrops {
  open: boolean;
  onOpenChange: Dispatch<SetStateAction<boolean>>;
  featureData: LoggerDetails | undefined;
}

const LoggerCardDetails: FunctionComponent<LoggerCardDetailsDrops> = ({
  open,
  onOpenChange,
  featureData,
}) => {
  // const { data: loggerEntries, fetchStatus: fStatusLoggerEntries } = useQuery({
  //   queryKey: ["logger-entries"],
  //   refetchOnReconnect: false,
  //   enabled: !!open,
  //   retry: 5,
  //   queryFn: async () => {
  //     const response = await axios.post(
  //       `${process.env.NEXT_PUBLIC_APP_URL}/api/v1/iot-logger/entries`,
  //       {
  //         serialNumber: featureData?.serial,
  //         channel: "",
  //         startDateTime: "2025-09-30 00:01",
  //         endDateTime: "2025-09-30 23:59",
  //       },
  //       {

  //       },
  //     );

  //     return response.data;
  //   },
  //   throwOnError: true,
  // });

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

  return (
    <Sheet key="right" open={open} onOpenChange={onOpenChange} modal={false}>
      <SheetContent
        className="bg-primary-color/70 m-1.5 h-[98vh] w-[400px] gap-0 rounded-lg border-0 text-white backdrop-blur"
        onInteractOutside={(e) => e.preventDefault()}
        side="right"
      >
        <SheetHeader className="m-6 p-0">
          <SheetTitle className="text-white">{featureData?.serial || "--"}</SheetTitle>
          <SheetDescription className="text-white">{featureData?.name || "--"}</SheetDescription>
        </SheetHeader>

        <ScrollArea className="h-full">
          {/* <div className="mx-3">
            <Alert className="text-center uppercase">
              <AlertTitle>{selectedWaterMeter.properties?.status || "--"}</AlertTitle>
            </Alert>
          </div> */}

          <div className="m-4 rounded-md border-1 border-stone-100 p-3">
            {/* <h3 className="pb-2 font-bold">Device</h3> */}
            <div className="grid gap-2">
              <div className="flex space-x-1.5 text-sm">
                <Label htmlFor="gnss" className="w-[50%]">
                  Address
                </Label>
                <p id="gnss" className="w-[50%] text-right font-bold">
                  {/* {selectedWaterMeter.properties?.address || "--"} */}
                </p>
              </div>

              <div className="flex space-x-1.5 text-sm">
                <Label htmlFor="gpsNum" className="w-[50%]">
                  Date Connected
                </Label>
                <p id="gpsNum" className="w-[50%] text-right font-bold">
                  {/* {dayjs(selectedWaterMeter.properties?.datecon).format("YYYY-MM-DD") || "--/--/----"} */}
                </p>
              </div>
            </div>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};

export default LoggerCardDetails;
