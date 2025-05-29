"use client";

import { useMapStore } from "@srms/components/stores/useMapStore";
import { useTsDeviceStore } from "@srms/components/stores/useTsDeviceStore";
import { Token } from "@srms/components/types";
import { Spinner } from "@srms/components/ui-custom/Spinner";
import { Card, CardContent, CardHeader } from "@srms/components/ui/Card";
import { TrackSolidDevice } from "@srms/lib/tracksolid/types";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { isEmpty } from "lodash";
import { Feature, View } from "ol";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import { Icon, Style } from "ol/style";
import { FunctionComponent, useEffect, useState } from "react";
// import { useFieldArray, useForm } from "react-hook-form";
import CarMarker from "../../../../public/images/car_icon.svg";
import { Point } from "ol/geom";
import { ScrollArea } from "@srms/components/ui/ScrollArea";
import { fromLonLat } from "ol/proj";
import VehicleCardDetails from "./VehicleCardDetails";

interface TsTokensProps {
  accessToken: Token;
}

const VehicleToggleList: FunctionComponent<TsTokensProps> = ({ accessToken }) => {
  const [isDeviceListFetched, setIsDeviceListFetched] = useState<boolean>(true);

  // zustand initialization
  const { tsDeviceList, setTsDeviceList, setSelectedDevice } = useTsDeviceStore();
  const { mapRef } = useMapStore();

  // Get vehicle list and add to zustand store
  const { data, isLoading } = useQuery({
    queryKey: ["vehicle-devices"],
    refetchOnReconnect: false,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    enabled: !!isDeviceListFetched,
    queryFn: async () => {
      const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_APP_URL}/api/v1/tracksolid/devices`,
        {},
        {
          headers: { "access-token": accessToken.value },
        },
      );

      return data;
    },
    throwOnError: true,
  });

  const setVehicleMarkerVisibility = (deviceDetails: TrackSolidDevice, isChecked: boolean) => {
    updateDeviceVisibility(deviceDetails.imei, isChecked);

    if (isChecked) {
      deviceLocationMutation.mutate(deviceDetails);
    } else {
      console.log(mapRef?.getLayers());

      mapRef?.getLayers().forEach((layer) => {
        if (layer.get("name") && layer.get("name") == deviceDetails.imei) {
          mapRef?.removeLayer(layer);
        }
      });
    }
  };

  // Update visibility of the device through creating a copy of tsDeviceList from zustand and update the zustand array value as a whole
  const updateDeviceVisibility = (imei: string, isChecked: boolean) => {
    const deviceList = tsDeviceList;
    const newDeviceList = deviceList.map((device) => {
      if (device.imei === imei) {
        return { ...device, visible: isChecked };
      }
      return device;
    });

    setTsDeviceList(newDeviceList);
  };

  // Get location details of device. Success will set the marker and add to map.
  const deviceLocationMutation = useMutation({
    mutationKey: ["device-location"],
    mutationFn: async (deviceDetails: TrackSolidDevice) => {
      const tsDevicesLocation = await axios.post(
        `${process.env.NEXT_PUBLIC_APP_URL}/api/v1/tracksolid/devices-location`,
        {
          imeis: deviceDetails.imei,
        },
        {
          headers: { "access-token": accessToken.value },
        },
      );

      return tsDevicesLocation.data[0];
    },
    onMutate: (variables) => {
      console.log(`Pulling location of device attached to vehicle: ${variables?.deviceName}`);
    },
    onSuccess: async (data, variables) => {
      const carMarker = new VectorLayer({
        source: new VectorSource({
          features: [
            new Feature({
              geometry: new Point(fromLonLat([data.lng, data.lat])),
              vehicleName: `${variables?.deviceName}`,
            }),
          ],
        }),
        visible: true,
        style: new Style({
          image: new Icon({
            src: CarMarker.src!,
            anchor: [0.5, 1],
          }),
          zIndex: 999,
        }),
      });
      carMarker.set("name", `${variables.imei}`);
      mapRef?.addLayer(carMarker); // add teh car marker to map

      const carCoordinates = new View({
        center: fromLonLat([data.lng, data.lat]),
        zoom: 18,
      });
      mapRef?.setView(carCoordinates); // move the user view to car location as the center
    },
    onError: (error: AxiosError<{ message: string }>) => {
      console.log(error);
    },
  });

  // Open modal for viewing vehicle details
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const toggleModal = (device: TrackSolidDevice) => {
    setIsModalOpen(!isModalOpen);
    setSelectedDevice(device);
  };

  useEffect(() => {
    if (mapRef) {
      mapRef?.getAllLayers().forEach((layer) => {
        layer.getSource()?.refresh();
        // if(layer instanceof Vector ) {
        // }
      });
    }
  }, [mapRef]);

  useEffect(() => {
    if (!isEmpty(data)) {
      // set data to zustand store
      setTsDeviceList(data);
      setIsDeviceListFetched(false);
    }
  }, [data]);

  return (
    <>
      <Card className="vehicle-layers absolute top-[6px] left-[6px] z-20 w-[380px] rounded-lg border-none bg-white p-3">
        <CardHeader className="p-1">
          <p className="text-md pb-2 font-bold text-black">Vehicle Layers</p>
        </CardHeader>
        <CardContent className="h-120 p-1">
          <ScrollArea className="h-full">
            <form className="flex flex-col gap-2">
              {isLoading ? <Spinner size={"lg"} /> : null}
              {!isEmpty(tsDeviceList) ? (
                <>
                  {tsDeviceList.map((device: TrackSolidDevice, index: number) => (
                    <div
                      className="mx-3 flex cursor-pointer items-center space-x-2 rounded-md border-1 border-stone-400 p-2"
                      key={device.imei}
                      onClick={() => toggleModal(device)}
                    >
                      <input
                        id={`device-${device.imei}`}
                        type="checkbox"
                        className="h-4 w-4 items-center justify-center rounded border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500"
                        // {...register(`layersVisibility.${idx}.visible` as const)}
                        onChange={(event) => {
                          setVehicleMarkerVisibility(device, event.target.checked);
                        }}
                      />

                      <label
                        htmlFor={`device-${index}`}
                        className="font-small cursor-pointer text-sm leading-none text-black peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        <p>Plate No./Driver: {device.deviceName}</p>
                        <p>Status: {device.status}</p>
                        <p>Vehicle Type: {device.mcType}</p>
                      </label>
                    </div>
                  ))}
                </>
              ) : null}
            </form>
          </ScrollArea>
        </CardContent>
      </Card>

      <VehicleCardDetails accessToken={accessToken} open={isModalOpen} onOpenChange={setIsModalOpen} />
    </>
  );
};

export default VehicleToggleList;
