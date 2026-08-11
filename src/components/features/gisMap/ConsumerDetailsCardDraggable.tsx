// import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@srms/components/ui/Sheet";
import { FunctionComponent, useEffect, useState } from "react";
import { Alert, AlertTitle } from "@srms/components/ui/Alert";
import { useCardStore } from "@srms/components/stores/useCardStore";
import { useWaterMeterStore } from "@srms/components/stores/useWaterMeterStore";
import { isEmpty } from "@srms/utils/isEmpty";
import { Label } from "@srms/components/ui/Label";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { useConsumerStore } from "@srms/components/stores/useConsumerStore";
import { DateFormatter } from "@srms/utils/dateFormatter";
// import { ScrollArea } from "@srms/components/ui/ScrollArea";
import { Button } from "@srms/components/ui/Button";
import { Consumer } from "@srms/lib/tcms/types";
import { ReceiptText, Wrench } from "lucide-react";
import ConsumerLedgerCard from "./ConsumerLedgerCard";
import ConsumerServiceRequestCard from "./ConsumerServiceRequestCard";
import VectorSource from "ol/source/Vector";
import VectorLayer from "ol/layer/Vector";
import { FeatureManager } from "@srms/lib/mapstudio/featureManager";
import { Point } from "ol/geom";
import { IconStyles } from "@srms/server/types";
import WaterMeterIcon from "../../../../public/images/water-meter.svg";
import { createIconStyles } from "./utils/createIconStyles";
import { Spinner } from "@srms/components/ui-custom/Spinner";

import { ScrollArea } from "@srms/components/ui/ScrollArea";
import {
  DraggableModal,
  DraggableModalBody,
  DraggableModalContent,
  DraggableModalDescription,
  // DraggableModalFooter,
  DraggableModalHeader,
  DraggableModalTitle,
} from "@srms/components/ui/DraggableModal";
import { useGisMap } from "./contexts/useGisMapContext";
import { useMapStore } from "@srms/components/stores/useMapStore";
// import Draggable from "react-draggable";

interface ConsumerDetailsCardProps {
  open: boolean;
  onOpenChange?(open: boolean): void;
}
const featureManager = new FeatureManager();

const ConsumerDetailsCard: FunctionComponent<ConsumerDetailsCardProps> = ({ open, onOpenChange }) => {
  // zustand initialization
  const { selectedWaterMeter } = useWaterMeterStore();
  const { polygonSelectionMode } = useMapStore();
  const {
    setConsumersTableCardOpen,
    setConsumersTableCardAreaOfInterestOpen,
    // consumersTableCardOpen,
    ledgerCardOpen,
    setLedgerCardOpen,
    serviceRequestCardOpen,
    setServiceRequestCardOpen,
    // layerToggleCardOpen,
    // vehicleDetailsCardOpen,
    setLayerToggleCardOpen,
  } = useCardStore();
  const { setConsumerInformation, consumerInformation, consumerInit } = useConsumerStore();
  const [consumerIsLoading, setConsumerIsLoading] = useState<boolean>(false);
  const [consumbersTableInitialized, setConsumbersTableInitialized] = useState<boolean>(false); // counter for making sure consumbers table doesn't pop up at initial load
  const fleetMap = useGisMap();

  const { mutateAsync: getConsumerInformation } = useMutation({
    mutationKey: ["consumer-information"],
    mutationFn: async (accountNo: string) => {
      setConsumerIsLoading(true);
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_APP_URL}/api/v1/consumer/information/${accountNo}`,
        {},
      );

      return response.data;
    },
    onSuccess: async (data) => {
      setConsumerInformation(data);
      setConsumerIsLoading(false);
    },
    onError: (error: AxiosError<{ message: string }>) => {
      console.log(error);
      setConsumerIsLoading(false);
    },
  });

  // Panning function to water meter location
  const panToMeterLocation = () => {
    const vectorSource = new VectorSource();

    const vectorLayer = new VectorLayer();

    const feature = featureManager.createFeature(new Point(selectedWaterMeter.geometry?.coordinates));

    vectorSource.addFeature(feature);

    const meterStyles = { src: WaterMeterIcon.src!, anchor: [0.5, 0.5], scale: 0.15 };

    const featureStyle = createIconStyles(meterStyles as IconStyles);
    feature.setStyle(featureStyle.iconStyle);

    vectorLayer.setSource(vectorSource);

    vectorLayer.setVisible(true);

    vectorLayer.setZIndex(996);

    vectorLayer.setProperties({ id: selectedWaterMeter.id });

    //check if layer exist already to avoid error
    const existingLayer = fleetMap.mapManager
      .getLayerManager()
      .getLayer(`water-meter-${selectedWaterMeter.id}`);

    //if it doesn't exist yet, add it
    if (!existingLayer) {
      fleetMap.mapManager.getLayerManager().addLayer(`water-meter-${selectedWaterMeter.id}`, vectorLayer);
    }

    // move the screen view to the water meter location as center
    // const wmCoordinates = new View({
    //   center: [selectedWaterMeter.geometry.coordinates[0]!, selectedWaterMeter.geometry.coordinates[1]!],
    //   zoom: 18,
    // });
    // fleetMap.mapManager.getMap().setView(wmCoordinates);

    const map = fleetMap.mapManager.getMap();
    const view = map.getView();

    view.animate({
      center: [selectedWaterMeter.geometry.coordinates[0]!, selectedWaterMeter.geometry.coordinates[1]!],
      zoom: 18,
      duration: 500,
    });
  };

  useEffect(() => {
    setConsumerInformation({} as Consumer);

    //initial page load will not display the consumers table
    if (!open && !consumbersTableInitialized) {
      setConsumbersTableInitialized(true);
    }
    // open table card if details card is closed
    else if (!open && consumbersTableInitialized) {
      if (!isEmpty(selectedWaterMeter)) {
        fleetMap.mapManager.getLayerManager().removeLayer(`water-meter-${selectedWaterMeter.id}`);
      }

      //if water meter selection is thru area of interest, open the area of interest consumer table instead of the regular consumer table
      if (polygonSelectionMode) {
        setConsumersTableCardAreaOfInterestOpen(true);
      } else {
        setConsumersTableCardOpen(true);
      }

      setLayerToggleCardOpen(false); //close layer nav if its open to give way to consumer table card
    } else {
      // get consumer information
      getConsumerInformation(consumerInit.account_no);
    }
  }, [open]);

  useEffect(() => {
    if (!isEmpty(selectedWaterMeter)) {
      // Pan map view to water meter location
      panToMeterLocation();
    }
  }, [selectedWaterMeter]);

  return (
    <>
      <DraggableModal open={open} onOpenChange={onOpenChange}>
        <DraggableModalContent className="top-2 right-2 h-auto w-[520px]">
          {consumerIsLoading || !open ? (
            <Spinner size={"lg"} className="my-8" />
          ) : (
            <>
              <DraggableModalHeader>
                <DraggableModalTitle>{consumerInformation.consumer_name || "--"}</DraggableModalTitle>
                <DraggableModalDescription>
                  Account No: {consumerInit.account_no} | Meter No: {consumerInit.meter_no}
                </DraggableModalDescription>
              </DraggableModalHeader>

              <DraggableModalBody>
                <ScrollArea className="text-md ui-color-base primary-text-color 3xl:h-auto h-[72vh] rounded-lg">
                  <div className="mx-3 grid gap-1">
                    <Alert
                      className={`${consumerInformation.status === "ACTIVE" ? "bg-green-500" : consumerInformation.status === "WRITE-OFF" ? "bg-yellow-600" : "bg-red-600"} border-none text-center uppercase shadow`}
                    >
                      <AlertTitle className="text-md">{consumerInformation.status || "--"}</AlertTitle>
                    </Alert>

                    {isEmpty(selectedWaterMeter) ? (
                      <Alert className="border-none bg-blue-500 text-center uppercase shadow">
                        <AlertTitle className="text-md">NOT GEO-TAGGED</AlertTitle>
                      </Alert>
                    ) : null}
                  </div>

                  <div className="m-4 rounded-md border border-indigo-400 p-3 shadow">
                    <div className="grid gap-2 gap-y-4">
                      <div className="flex space-x-1.5">
                        <Label htmlFor="gps-time" className="w-[50%]">
                          Consumer Type
                        </Label>
                        <p id="gps-time" className="w-[50%] text-right font-bold">
                          {consumerInformation.description || "--"}
                        </p>
                      </div>

                      <div className="flex space-x-1.5">
                        <Label htmlFor="gnss" className="w-[50%]">
                          Address
                        </Label>
                        <p id="gnss" className="w-[50%] text-right font-bold">
                          {consumerInformation.address || "--"}
                        </p>
                      </div>

                      <div className="flex space-x-1.5">
                        <Label htmlFor="gps-time" className="w-[50%]">
                          Contact No.
                        </Label>
                        <p id="gps-time" className="w-[50%] text-right font-bold">
                          {consumerInformation.contact_no || "--"}
                        </p>
                      </div>

                      <div className="flex space-x-1.5">
                        <Label htmlFor="gps-time" className="w-[50%]">
                          Senior
                        </Label>
                        <p id="gps-time" className="w-[50%] text-right font-bold">
                          {consumerInformation.IsSenior ? "Yes" : "No"}
                        </p>
                      </div>

                      <div className="flex space-x-1.5">
                        <Label htmlFor="gpsNum" className="w-[50%]">
                          Date Connected
                        </Label>
                        <p id="gpsNum" className="w-[50%] text-right font-bold">
                          {!isEmpty(consumerInformation.date_connected)
                            ? DateFormatter(consumerInformation.date_connected, "YYYY-MM-DD", "--")
                            : "--"}
                        </p>
                      </div>

                      <div className="flex space-x-1.5">
                        <Label htmlFor="gpsSignal" className="w-[50%]">
                          Date Disconnected
                        </Label>
                        <div id="gpsSignal" className="w-[50%] text-right font-bold">
                          {!isEmpty(selectedWaterMeter)
                            ? DateFormatter(selectedWaterMeter.properties?.datediscon, "YYYY-MM-DD", "--")
                            : "--"}
                        </div>
                      </div>

                      <div className="flex space-x-1.5">
                        <Label htmlFor="last-online" className="w-[50%]">
                          Zone Code | Book Code
                        </Label>
                        <p id="last-online" className="w-[50%] text-right font-bold">
                          {`${consumerInformation.zone_code} | ${consumerInformation.book_code}` || "-- | --"}
                        </p>
                      </div>

                      <div className="flex space-x-1.5">
                        <Label htmlFor="gps-time" className="w-[50%]">
                          Meter Brand | Meter Size
                        </Label>
                        <p id="gps-time" className="w-[50%] text-right font-bold">
                          {!isEmpty(selectedWaterMeter)
                            ? `${selectedWaterMeter.properties?.meterbrnd} |`
                            : "-- |"}

                          {` ${consumerInformation.meter_size}` || " --"}
                        </p>
                      </div>

                      {/* <div className="flex space-x-1.5 ">
                <Label htmlFor="gps-time" className="w-[50%]">
                  Cubic Meter/Hour
                </Label>
                <p id="gps-time" className="w-[50%] text-right font-bold">
                  {selectedWaterMeter.properties?.m3perhr || "--"}
                </p>
              </div> */}

                      <div className="flex space-x-1.5">
                        <Label htmlFor="gps-time" className="w-[50%]">
                          Average Usage
                        </Label>
                        <p id="gps-time" className="w-[50%] text-right font-bold">
                          {consumerInformation.AverageUsage || "--"} m<sup>3</sup>/month
                        </p>
                      </div>

                      <div className="flex space-x-1.5">
                        <Label htmlFor="gps-time" className="w-[50%]">
                          Billed Volume
                        </Label>
                        <p id="gps-time" className="w-[50%] text-right font-bold">
                          {consumerInformation.usage || "--"} m<sup>3</sup>/month
                        </p>
                      </div>

                      <div className="flex space-x-1.5">
                        <Label htmlFor="gps-time" className="w-[50%]">
                          Billed Amount
                        </Label>
                        <p id="gps-time" className="w-[50%] text-right font-bold">
                          {`₱ ${consumerInformation.bill_amount}` || "--"}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mx-3 mb-10 flex flex-col gap-2">
                    <Button
                      className="solid w-full"
                      disabled={selectedWaterMeter ? false : true}
                      onClick={() => {
                        setLedgerCardOpen(true);
                      }}
                    >
                      <ReceiptText /> Ledger
                    </Button>

                    <Button
                      className="solid w-full"
                      disabled={selectedWaterMeter ? false : true}
                      onClick={() => setServiceRequestCardOpen(true)}
                    >
                      <Wrench /> Service Request
                    </Button>
                  </div>
                </ScrollArea>
              </DraggableModalBody>
            </>
          )}
          {/* <DraggableModalFooter>
            <Button variant="default" onClick={() => onOpenChange?.(false)}>
              Close
            </Button>
          </DraggableModalFooter> */}
        </DraggableModalContent>
      </DraggableModal>

      <ConsumerLedgerCard open={ledgerCardOpen} onOpenChange={setLedgerCardOpen} />

      <ConsumerServiceRequestCard open={serviceRequestCardOpen} onOpenChange={setServiceRequestCardOpen} />
    </>
  );
};

export default ConsumerDetailsCard;
