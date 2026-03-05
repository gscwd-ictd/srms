import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@srms/components/ui/Sheet";
import { FunctionComponent, useEffect } from "react";
import { Alert, AlertTitle } from "@srms/components/ui/Alert";
import { useCardStore } from "@srms/components/stores/useCardStore";
import { useWaterMeterStore } from "@srms/components/stores/useWaterMeterStore";
import { isEmpty } from "@srms/utils/isEmpty";
import { useFleetMap } from "./contexts/useFleetMapContext";
import { Label } from "@srms/components/ui/Label";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { useConsumerStore } from "@srms/components/stores/useConsumerStore";
import { DateFormatter } from "@srms/utils/dateFormatter";
import { ScrollArea } from "@srms/components/ui/ScrollArea";
import { Button } from "@srms/components/ui/Button";
import { Consumer } from "@srms/lib/tcms/types";
import { ReceiptText, Wrench } from "lucide-react";
import ConsumerLedgerCard from "./ConsumerLedgerCard";

interface WaterMeterDetailsCardProps {
  open: boolean;
  onOpenChange?(open: boolean): void;
}

const WaterMeterDetailsCard: FunctionComponent<WaterMeterDetailsCardProps> = ({ open, onOpenChange }) => {
  // zustand initialization
  const { selectedWaterMeter } = useWaterMeterStore();
  const {
    layerToggleCardOpen,
    setWaterMeterTableCardOpen,
    waterMeterTableCardOpen,
    ledgerCardOpen,
    setLedgerCardOpen,
  } = useCardStore();
  const { setConsumerInformation, consumerInformation } = useConsumerStore();

  const fleetMap = useFleetMap();

  const { mutateAsync: getConsumerInformation } = useMutation({
    mutationKey: ["consumer-information"],
    mutationFn: async (accountNo: string) => {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_APP_URL}/api/v1/consumer/information/${accountNo}`,
        {},
      );

      return response.data;
    },
    onSuccess: async (data) => {
      console.log(data);
      setConsumerInformation(data);
    },
    onError: (error: AxiosError<{ message: string }>) => {
      console.log(error);
    },
  });

  useEffect(() => {
    setConsumerInformation({} as Consumer);

    // open table card if details card is closed
    if (!open && !isEmpty(selectedWaterMeter)) {
      fleetMap.mapManager.getLayerManager().removeLayer(`water-meter-${selectedWaterMeter.id}`);
      if (!layerToggleCardOpen) {
        setWaterMeterTableCardOpen(!waterMeterTableCardOpen);
      }
    } else {
      getConsumerInformation(selectedWaterMeter.properties?.accountno);
    }
  }, [open]);

  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange} modal={false}>
        <SheetContent
          className="ui-color-base primary-text-color m-1.5 h-[98vh] w-[400px] gap-0 rounded-lg border-0 backdrop-blur"
          onInteractOutside={(e) => e.preventDefault()}
          side="right"
        >
          <SheetHeader className="m-6 p-0">
            <SheetTitle className="primary-text-color">
              {consumerInformation.consumer_name || "--"}
            </SheetTitle>
            <SheetDescription className="primary-text-color">
              Account No: {consumerInformation.account_no || "--"} | Meter No:{" "}
              {consumerInformation.meter_no || "--"}
            </SheetDescription>
          </SheetHeader>

          <ScrollArea className="h-full">
            <div className="mx-3">
              <Alert
                className={`${consumerInformation.status === "ACTIVE" ? "bg-green-500" : consumerInformation.status === "WRITE-OFF" ? "bg-yellow-600" : "bg-red-600"} border-none text-center uppercase shadow`}
              >
                <AlertTitle>{consumerInformation.status || "--"}</AlertTitle>
              </Alert>
            </div>

            <div className="m-4 rounded-md border-1 border-indigo-400 p-3 shadow">
              <div className="grid gap-2">
                <div className="flex space-x-1.5 text-sm">
                  <Label htmlFor="gps-time" className="w-[50%]">
                    Consumer Type
                  </Label>
                  <p id="gps-time" className="w-[50%] text-right font-bold">
                    {consumerInformation.description || "--"}
                  </p>
                </div>

                <div className="flex space-x-1.5 text-sm">
                  <Label htmlFor="gnss" className="w-[50%]">
                    Address
                  </Label>
                  <p id="gnss" className="w-[50%] text-right font-bold">
                    {consumerInformation.address || "--"}
                  </p>
                </div>

                <div className="flex space-x-1.5 text-sm">
                  <Label htmlFor="gps-time" className="w-[50%]">
                    Contact No.
                  </Label>
                  <p id="gps-time" className="w-[50%] text-right font-bold">
                    {consumerInformation.contact_no || "--"}
                  </p>
                </div>

                <div className="flex space-x-1.5 text-sm">
                  <Label htmlFor="gpsNum" className="w-[50%]">
                    Date Connected
                  </Label>
                  <p id="gpsNum" className="w-[50%] text-right font-bold">
                    {DateFormatter(consumerInformation.date_connected, "YYYY-MM-DD", "--")}
                  </p>
                </div>

                <div className="flex space-x-1.5 text-sm">
                  <Label htmlFor="gpsSignal" className="w-[50%]">
                    Date Disconnected
                  </Label>
                  <div id="gpsSignal" className="w-[50%] text-right font-bold">
                    {DateFormatter(selectedWaterMeter.properties?.datediscon, "YYYY-MM-DD", "--")}
                  </div>
                </div>

                <div className="flex space-x-1.5 text-sm">
                  <Label htmlFor="last-online" className="w-[50%]">
                    Zone Code | Book Code
                  </Label>
                  <p id="last-online" className="w-[50%] text-right font-bold">
                    {`${consumerInformation.zone_code} | ${consumerInformation.book_code}` || "-- | --"}
                  </p>
                </div>

                <div className="flex space-x-1.5 text-sm">
                  <Label htmlFor="gps-time" className="w-[50%]">
                    Meter Brand | Meter Size
                  </Label>
                  <p id="gps-time" className="w-[50%] text-right font-bold">
                    {`${selectedWaterMeter.properties?.meterbrnd} | ${consumerInformation.meter_size}` ||
                      "-- | --"}
                  </p>
                </div>

                {/* <div className="flex space-x-1.5 text-sm">
                <Label htmlFor="gps-time" className="w-[50%]">
                  Cubic Meter/Hour
                </Label>
                <p id="gps-time" className="w-[50%] text-right font-bold">
                  {selectedWaterMeter.properties?.m3perhr || "--"}
                </p>
              </div> */}

                <div className="flex space-x-1.5 text-sm">
                  <Label htmlFor="gps-time" className="w-[50%]">
                    Average Usage
                  </Label>
                  <p id="gps-time" className="w-[50%] text-right font-bold">
                    {consumerInformation.AverageUsage || "--"} m<sup>3</sup>/month
                  </p>
                </div>

                <div className="flex space-x-1.5 text-sm">
                  <Label htmlFor="gps-time" className="w-[50%]">
                    Billed Volume
                  </Label>
                  <p id="gps-time" className="w-[50%] text-right font-bold">
                    {consumerInformation.usage || "--"} m<sup>3</sup>/month
                  </p>
                </div>

                <div className="flex space-x-1.5 text-sm">
                  <Label htmlFor="gps-time" className="w-[50%]">
                    Billed Amount
                  </Label>
                  <p id="gps-time" className="w-[50%] text-right font-bold">
                    {`₱ ${consumerInformation.bill_amount}` || "--"}
                  </p>
                </div>
              </div>
            </div>

            <div className="mx-3 flex flex-col gap-2">
              <Button className="solid w-full" onClick={() => setLedgerCardOpen(true)}>
                <ReceiptText /> Ledger
              </Button>

              <Button className="solid w-full">
                <Wrench /> Service Request
              </Button>
            </div>
          </ScrollArea>
        </SheetContent>
      </Sheet>

      <ConsumerLedgerCard open={ledgerCardOpen} onOpenChange={setLedgerCardOpen} />
    </>
  );
};

export default WaterMeterDetailsCard;
