import { Label } from "@radix-ui/react-label";
import { ScrollArea } from "@srms/components/ui/ScrollArea";
import { AccStatus, GPSSignal } from "@srms/components/enums";
import { useTsDeviceStore } from "@srms/components/stores/useTsDeviceStore";
import { Token } from "@srms/components/types";
import { Spinner } from "@srms/components/ui-custom/Spinner";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@srms/components/ui/Sheet";
import { TrackSolidDeviceDetail, TrackSolidDeviceLocation } from "@srms/lib/tracksolid/types";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import dayjs from "dayjs";
import { SignalHigh, SignalLow, SignalMedium, SignalZero } from "lucide-react";
import { Dispatch, FunctionComponent, SetStateAction, useEffect } from "react";
import { isEmpty } from "@srms/utils/isEmpty";

interface VehicleDetailsCardProps {
  accessToken: Token;
  open: boolean;
  onOpenChange: Dispatch<SetStateAction<boolean>>;
}

const VehicleDetailsCard: FunctionComponent<VehicleDetailsCardProps> = ({
  accessToken,
  open,
  onOpenChange,
}) => {
  // zustand initialization
  const { selectedDevice, tsDeviceDetails, setTsDeviceDetails, tsDeviceLocation, setTsDeviceLocation } =
    useTsDeviceStore();

  const { data: deviceDetails, fetchStatus: fStatusDeviceDetails } = useQuery({
    queryKey: ["device-details"],
    refetchOnReconnect: false,
    enabled: !!open,
    retry: 5,
    queryFn: async () => {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_APP_URL}/api/v1/tracksolid/device-detail`,
        {
          imeis: selectedDevice.imei,
          beginTime: dayjs().startOf("day").format("YYYY-MM-DD HH:mm:ss"),
          endTime: dayjs().subtract(30, "minutes").format("YYYY-MM-DD HH:mm:ss"),
        },
        {
          headers: { "access-token": accessToken.value },
        },
      );

      return response.data;
    },
    throwOnError: true,
  });

  const { data: deviceLocation, fetchStatus: fStatusDeviceLocation } = useQuery({
    queryKey: ["device-location"],
    enabled: !!open,
    retry: 5,
    queryFn: async () => {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_APP_URL}/api/v1/tracksolid/devices-location`,
        {
          imeis: selectedDevice.imei,
        },
        {
          headers: { "access-token": accessToken.value },
        },
      );

      return response.data[0];
    },
    throwOnError: true,
  });

  // vehicle/engine status
  const checkAccStatus = () => {
    if (tsDeviceLocation?.accStatus === "1" && parseInt(tsDeviceLocation?.speed) > 0) {
      return AccStatus.MOVING;
    } else if (tsDeviceLocation?.accStatus === "0") {
      return AccStatus.PARKED;
    } else {
      return AccStatus.IDLING;
    }
  };

  // render GPS signal icon and status
  const renderSignalIcon = (gpsNum: string) => {
    if (gpsNum === "1") {
      return (
        <p className="flex w-full justify-end text-right">
          {GPSSignal.EXTREMELY_WEAK} <SignalZero size={22} className="pl-1 text-red-500" />
        </p>
      );
    } else if (gpsNum === "2") {
      return (
        <p className="flex w-full justify-end text-right">
          {GPSSignal.WEAK} <SignalLow size={22} className="pl-1 text-orange-500" />
        </p>
      );
    } else if (gpsNum === "3") {
      return (
        <p className="flex w-full justify-end text-right">
          {GPSSignal.MODERATE} <SignalMedium size={22} className="pl-1 text-green-500" />
        </p>
      );
    } else if (gpsNum === "4") {
      return (
        <p className="flex w-full justify-end text-right">
          {GPSSignal.STRONG} <SignalHigh size={22} className="pl-1 text-green-500" />
        </p>
      );
    } else {
      return;
    }
  };

  useEffect(() => {
    if (open) {
      if (!isEmpty(deviceDetails)) {
        setTsDeviceDetails(deviceDetails);
      }

      if (!isEmpty(deviceLocation)) {
        setTsDeviceLocation(deviceLocation);
      }
    } else {
      setTsDeviceDetails({} as TrackSolidDeviceDetail);
      setTsDeviceLocation({} as TrackSolidDeviceLocation);
    }
  }, [open, deviceDetails, deviceLocation, setTsDeviceDetails, setTsDeviceLocation]);

  return (
    <Sheet open={open} onOpenChange={onOpenChange} modal={false}>
      <SheetContent
        className="ui-color-base primary-text-color m-1.5 h-[98vh] w-[400px] gap-0 rounded-lg border-0 backdrop-blur"
        onInteractOutside={(e) => e.preventDefault()}
        side="right"
      >
        <SheetHeader className="m-6 mb-2 p-0">
          <SheetTitle className="primary-text-color">{selectedDevice.deviceName}</SheetTitle>
          <SheetDescription className="primary-text-color">{selectedDevice.imei}</SheetDescription>
        </SheetHeader>

        <ScrollArea className="h-[82vh]">
          {/* {loadingDeviceDetails || loadingDeviceLocation ? <Spinner size={"lg"} /> : null} */}
          {fStatusDeviceDetails === "fetching" || fStatusDeviceLocation === "fetching" ? (
            <Spinner size={"lg"} />
          ) : null}

          {!isEmpty(tsDeviceDetails) && !isEmpty(tsDeviceLocation) ? (
            <>
              <div className="m-4 mb-2 rounded-md border-1 border-indigo-400 p-3 shadow">
                <div className="flex space-x-1.5">
                  <p className="w-[50%]">
                    <span className="font-bold">{checkAccStatus()}</span>{" "}
                    <span className="primary-text-color">
                      (ACC:{tsDeviceLocation?.accStatus === "0" ? "OFF" : "ON"})
                    </span>
                  </p>

                  <p className="w-[50%] text-right">
                    Speed: <span className="font-bold">{tsDeviceLocation?.speed}</span> km/h
                  </p>
                </div>
              </div>

              <div className="m-4 rounded-md border-1 border-indigo-400 p-3 shadow">
                <h3 className="pb-2 font-bold">Device</h3>
                <div className="grid gap-2">
                  <div className="flex space-x-1.5 text-sm">
                    <Label htmlFor="gnss" className="w-[50%]">
                      GNSS
                    </Label>
                    <p id="gnss" className="w-[50%] text-right font-bold">
                      {tsDeviceLocation?.posType}
                    </p>
                  </div>

                  <div className="flex space-x-1.5 text-sm">
                    <Label htmlFor="gpsNum" className="w-[50%]">
                      Visible Satellites
                    </Label>
                    <p id="gpsNum" className="w-[50%] text-right font-bold">
                      {tsDeviceLocation?.gpsNum}
                    </p>
                  </div>

                  <div className="flex space-x-1.5 text-sm">
                    <Label htmlFor="gpsSignal" className="w-[50%]">
                      Cellular Signal Strength
                    </Label>
                    <div id="gpsSignal" className="w-[50%] text-right font-bold">
                      {renderSignalIcon(tsDeviceLocation?.gpsSignal)}
                    </div>
                  </div>

                  <div className="flex space-x-1.5 text-sm">
                    <Label htmlFor="last-online" className="w-[50%]">
                      Last Online
                    </Label>
                    <p id="last-online" className="w-[50%] text-right font-bold">
                      {dayjs(tsDeviceLocation?.hbTime).format("YYYY-MM-DD hh:mm:ss a")}
                    </p>
                  </div>

                  <div className="flex space-x-1.5 text-sm">
                    <Label htmlFor="gps-time" className="w-[50%]">
                      Last Fix
                    </Label>
                    <p id="gps-time" className="w-[50%] text-right font-bold">
                      {dayjs(tsDeviceLocation?.gpsTime).format("YYYY-MM-DD hh:mm:ss a")}
                    </p>
                  </div>
                </div>
              </div>

              <div className="m-4 rounded-md border-1 border-indigo-400 p-3 shadow">
                <h3 className="pb-2 font-bold">Today&apos;s Activity</h3>

                <div className="grid gap-2">
                  <div className="flex space-x-1.5 text-sm">
                    <Label htmlFor="todays-mileage" className="w-[50%]">
                      Today&apos;s Mileage
                    </Label>
                    <p id="todays-mileage" className="w-[50%] text-right font-bold">
                      {tsDeviceDetails?.result?.todaysMileage
                        ? tsDeviceDetails?.result?.todaysMileage / 1000
                        : "--"}{" "}
                      km
                    </p>
                  </div>

                  <div className="flex space-x-1.5 text-sm">
                    <Label htmlFor="vbv" className="w-[50%]">
                      Vehicle Battery Voltage
                    </Label>
                    <p id="vbv" className="w-[50%] text-right font-bold">
                      {tsDeviceLocation?.batteryPowerVal}
                    </p>
                  </div>
                </div>
              </div>

              <div className="m-4 h-full overflow-y-auto rounded-md border-1 border-indigo-400 p-3 shadow">
                <h3 className="pb-2 font-bold">Vehicle</h3>

                <div className="grid gap-2">
                  <div className="flex space-x-1.5 text-sm">
                    <Label htmlFor="vehicle-name" className="w-[50%]">
                      Name
                    </Label>
                    <p id="vehicle-name" className="w-[50%] text-right font-bold">
                      {tsDeviceDetails?.result?.vehicleName ? tsDeviceDetails?.result?.vehicleName : "-"}
                    </p>
                  </div>

                  <div className="flex space-x-1.5 text-sm">
                    <Label htmlFor="vehicle-phone" className="w-[50%]">
                      Phone
                    </Label>
                    <p id="vehicle-phone" className="w-[50%] text-right font-bold">
                      {tsDeviceDetails?.result?.vehicleNumber ? tsDeviceDetails?.result?.vehicleNumber : "-"}
                    </p>
                  </div>

                  <div className="flex space-x-1.5 text-sm">
                    <Label htmlFor="vin" className="w-[50%]">
                      ID
                    </Label>
                    <p id="vin" className="w-[50%] text-right font-bold">
                      {tsDeviceDetails?.result?.vin ? tsDeviceDetails?.result?.vin : "-"}
                    </p>
                  </div>

                  <div className="flex space-x-1.5 text-sm">
                    <Label htmlFor="brand" className="w-[50%]">
                      Brand
                    </Label>
                    <p id="brand" className="w-[50%] text-right font-bold">
                      {tsDeviceDetails?.result?.vehicleBrand ? tsDeviceDetails?.result?.vehicleBrand : "-"}
                    </p>
                  </div>

                  <div className="flex space-x-1.5 text-sm">
                    <Label htmlFor="model" className="w-[50%]">
                      Model
                    </Label>
                    <p id="model" className="w-[50%] text-right font-bold">
                      {tsDeviceDetails?.result?.vehicleModels ? tsDeviceDetails?.result?.vehicleModels : "-"}
                    </p>
                  </div>

                  <div className="flex space-x-1.5 text-sm">
                    <Label htmlFor="plate-no" className="w-[50%]">
                      Plate No.
                    </Label>
                    <p id="plate-no" className="w-[50%] text-right font-bold">
                      {tsDeviceDetails?.result?.licensePlatNo ? tsDeviceDetails?.result?.licensePlatNo : "-"}
                    </p>
                  </div>
                </div>
              </div>
            </>
          ) : null}
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};

export default VehicleDetailsCard;
