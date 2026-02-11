import { ScrollArea } from "@radix-ui/react-scroll-area";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@srms/components/ui/Sheet";
import { FunctionComponent, useEffect } from "react";
import { Alert, AlertTitle } from "@srms/components/ui/Alert";
import { useCardStore } from "@srms/components/stores/useCardStore";
import { useWaterMeterStore } from "@srms/components/stores/useWaterMeterStore";
import { isEmpty } from "@srms/utils/isEmpty";
import { useFleetMap } from "./contexts/useFleetMapContext";
import { Label } from "@srms/components/ui/Label";
import dayjs from "dayjs";

interface WaterMeterDetailsCardProps {
  open: boolean;
  onOpenChange?(open: boolean): void;
}

const WaterMeterDetailsCard: FunctionComponent<WaterMeterDetailsCardProps> = ({ open, onOpenChange }) => {
  // zustand initialization
  const { selectedWaterMeter } = useWaterMeterStore();
  const { layerToggleCardOpen, setWaterMeterTableCardOpen, waterMeterTableCardOpen } = useCardStore();

  const fleetMap = useFleetMap();

  useEffect(() => {
    // open table card if details card is closed
    if (!open && !isEmpty(selectedWaterMeter)) {
      fleetMap.mapManager.getLayerManager().removeLayer(`water-meter-${selectedWaterMeter.id}`);
      if (!layerToggleCardOpen) {
        setWaterMeterTableCardOpen(!waterMeterTableCardOpen);
      }
    }
  }, [open]);

  return (
    <Sheet open={open} onOpenChange={onOpenChange} modal={false}>
      <SheetContent
        className="ui-color-base primary-text-color m-1.5 h-[98vh] w-[400px] gap-0 rounded-lg border-0 backdrop-blur"
        onInteractOutside={(e) => e.preventDefault()}
        side="right"
      >
        <SheetHeader className="m-6 p-0">
          <SheetTitle className="primary-text-color">
            {selectedWaterMeter.properties?.consumern || "--"}
          </SheetTitle>
          <SheetDescription className="primary-text-color">
            Account No: {selectedWaterMeter.properties?.accountno || "--"} | Meter No:{" "}
            {selectedWaterMeter.properties?.meterno || "--"}
          </SheetDescription>
        </SheetHeader>

        <ScrollArea className="h-full">
          <div className="mx-3">
            <Alert
              className={`${selectedWaterMeter.properties?.status === "Connected" ? "bg-green-500" : "bg-red-600"} border-none text-center uppercase shadow`}
            >
              <AlertTitle>{selectedWaterMeter.properties?.status || "--"}</AlertTitle>
            </Alert>
          </div>

          <div className="m-4 rounded-md border-1 border-indigo-400 p-3 shadow">
            {/* <h3 className="pb-2 font-bold">Device</h3> */}
            <div className="grid gap-2">
              <div className="flex space-x-1.5 text-sm">
                <Label htmlFor="gnss" className="w-[50%]">
                  Address
                </Label>
                <p id="gnss" className="w-[50%] text-right font-bold">
                  {selectedWaterMeter.properties?.address || "--"}
                </p>
              </div>

              <div className="flex space-x-1.5 text-sm">
                <Label htmlFor="gpsNum" className="w-[50%]">
                  Date Connected
                </Label>
                <p id="gpsNum" className="w-[50%] text-right font-bold">
                  {dayjs(selectedWaterMeter.properties?.datecon).format("YYYY-MM-DD") || "--/--/----"}
                  {}
                </p>
              </div>

              <div className="flex space-x-1.5 text-sm">
                <Label htmlFor="gpsSignal" className="w-[50%]">
                  Date Disconnected
                </Label>
                <div id="gpsSignal" className="w-[50%] text-right font-bold">
                  {dayjs(selectedWaterMeter.properties?.datediscon).format("YYYY-MM-DD") || "--/--/----"}
                </div>
              </div>

              <div className="flex space-x-1.5 text-sm">
                <Label htmlFor="last-online" className="w-[50%]">
                  Zone Code | Book Code
                </Label>
                <p id="last-online" className="w-[50%] text-right font-bold">
                  {`${selectedWaterMeter.properties?.zonecode} | ${selectedWaterMeter.properties?.bookcode}` ||
                    "-- | --"}
                </p>
              </div>

              <div className="flex space-x-1.5 text-sm">
                <Label htmlFor="gps-time" className="w-[50%]">
                  Consumer Type
                </Label>
                <p id="gps-time" className="w-[50%] text-right font-bold">
                  {selectedWaterMeter.properties?.consumert || "--"}
                </p>
              </div>

              <div className="flex space-x-1.5 text-sm">
                <Label htmlFor="gps-time" className="w-[50%]">
                  Meter Brand | Meter Size
                </Label>
                <p id="gps-time" className="w-[50%] text-right font-bold">
                  {`${selectedWaterMeter.properties?.meterbrnd} | ${selectedWaterMeter.properties?.metersize}` ||
                    "-- | --"}
                </p>
              </div>

              <div className="flex space-x-1.5 text-sm">
                <Label htmlFor="gps-time" className="w-[50%]">
                  Average Usage
                </Label>
                <p id="gps-time" className="w-[50%] text-right font-bold">
                  {selectedWaterMeter.properties?.aveusage || "--"}
                </p>
              </div>

              <div className="flex space-x-1.5 text-sm">
                <Label htmlFor="gps-time" className="w-[50%]">
                  Cubic Meter/Hour
                </Label>
                <p id="gps-time" className="w-[50%] text-right font-bold">
                  {selectedWaterMeter.properties?.m3perhr || "--"}
                </p>
              </div>

              <div className="flex space-x-1.5 text-sm">
                <Label htmlFor="gps-time" className="w-[50%]">
                  Contact No.
                </Label>
                <p id="gps-time" className="w-[50%] text-right font-bold">
                  {selectedWaterMeter.properties?.contactno || "--"}
                </p>
              </div>

              <div className="flex space-x-1.5 text-sm">
                <Label htmlFor="gps-time" className="w-[50%]">
                  Billed Volume | Billed Amount
                </Label>
                <p id="gps-time" className="w-[50%] text-right font-bold">
                  {`${selectedWaterMeter.properties?.billedvol} | Php${selectedWaterMeter.properties?.billed}` ||
                    "-- | --"}
                </p>
              </div>
            </div>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};

export default WaterMeterDetailsCard;
