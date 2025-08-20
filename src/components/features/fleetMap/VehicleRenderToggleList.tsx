/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useTsDeviceStore } from "@srms/components/stores/useTsDeviceStore";
import { Token } from "@srms/components/types";
import { Spinner } from "@srms/components/ui-custom/Spinner";
import { TrackSolidDevice, TrackSolidDeviceLocation } from "@srms/lib/tracksolid/types";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { Feature, View } from "ol";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import { FunctionComponent, useEffect, useState } from "react";
import CarMarker from "../../../../public/images/car_icon.svg";
import { Point } from "ol/geom";
import VehicleCardDetails from "./VehicleCardDetails";
import { useFleetMap } from "./contexts/useFleetMapContext";
import { FeatureManager } from "@srms/lib/mapstudio/featureManager";
import { createIconStyles } from "./utils/createIconStyles";
import { IconStyles } from "@srms/server/types";
import BaseLayer from "ol/layer/Base";
import { isEmpty } from "@srms/utils/isEmpty";
import React from "react";
import { AccordionContent, AccordionTrigger } from "@srms/components/ui/Accordion";
import { Eye, EyeOff } from "lucide-react";

interface TsTokensProps {
  accessToken: Token;
}

const VehicleRenderToggleList: FunctionComponent<TsTokensProps> = ({ accessToken }) => {
  const fleetMap = useFleetMap();
  const featureManager = new FeatureManager();
  const vehicleLayerGroup = fleetMap.mapManager.getLayerManager().getLayerGroup("vehicle-map-layer");

  const [isDeviceListFetched, setIsDeviceListFetched] = useState<boolean>(true);

  // zustand initialization
  const { tsDeviceList, setTsDeviceList, setSelectedDevice } = useTsDeviceStore();

  // Get vehicle list and add to zustand store
  const { data: deviceList, isLoading } = useQuery({
    queryKey: ["vehicle-devices"],
    refetchOnReconnect: false,
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
    // onMutate: (variables) => {
    //   console.log(`Fetching location of device attached to vehicle: ${variables?.deviceName}`);
    // },
    onSuccess: async (data, variables) => {
      const vectorLayer = new VectorLayer();

      const vectorSource = new VectorSource();

      const carProperties = {
        id: data.imei,
      };

      const feature = featureManager.createFeature(new Point([data.lng, data.lat]), carProperties);

      const vehicleStyles = { src: CarMarker.src!, anchor: [0.5, 1], scale: 0.55, rotation: data.direction };

      const featureStyle = createIconStyles(vehicleStyles as IconStyles);
      feature.setStyle(featureStyle.iconStyle);

      vectorSource.addFeature(feature);

      vectorLayer.setSource(vectorSource);

      vectorLayer.setVisible(true);

      vectorLayer.setZIndex(999);

      vectorLayer.setProperties({ imei: variables.imei, vehicleName: variables.deviceName });

      // add vehicle vector layer to layer group
      vehicleLayerGroup?.getLayers().push(vectorLayer);

      // move the screen view to the vehicle location as center
      const vehicleCoordinates = new View({
        center: [data.lng, data.lat],
        zoom: 18,
      });
      fleetMap.mapManager.getMap().setView(vehicleCoordinates);
    },
    onError: (error: AxiosError<{ message: string }>) => {
      console.log(error);
    },
  });

  // Get location details of multiple devices. Success will set new position of the marker
  const multipleDeviceLocationMutation = useMutation({
    mutationKey: ["devices-location"],
    mutationFn: async (devices: string) => {
      const tsDevicesLocation = await axios.post(
        `${process.env.NEXT_PUBLIC_APP_URL}/api/v1/tracksolid/devices-location`,
        {
          imeis: devices,
        },
        {
          headers: { "access-token": accessToken.value },
        },
      );

      return tsDevicesLocation;
    },
    // onMutate: () => {
    //   console.log(`Fetching location details of devices`);
    // },
    onSuccess: async (data) => {
      // Iterate through the layer group of vehicles
      vehicleLayerGroup?.getLayers().forEach((layer: BaseLayer) => {
        if (layer instanceof VectorLayer) {
          const source = layer.getSource().getFeatures();

          // Iterate through the geom of each layer/feature
          source.forEach((feature: Feature) => {
            const currVehicleGeom = feature.getGeometry();

            // if geom is a Point
            // and upon iteration, imei is present from the vehicle/s location data.
            // update the feature coordinate.
            // this results for the marker icon to move in the map.
            if (currVehicleGeom instanceof Point) {
              data.data.forEach((device: TrackSolidDeviceLocation) => {
                if (device.imei === feature.get("id")) {
                  const vehicleStyles = {
                    src: CarMarker.src!,
                    anchor: [0.5, 1],
                    scale: 0.55,
                    rotation: parseInt(device.direction),
                  };
                  const featureStyle = createIconStyles(vehicleStyles as IconStyles);
                  feature.setStyle(featureStyle.iconStyle);

                  currVehicleGeom.setCoordinates([device.lng, device.lat]);
                }
              });
            }
          });
        }
      });
    },
    onError(error: AxiosError<{ message: string }>) {
      console.log(error);
    },
  });

  // Update openlayers. Visibility status of selected layer.
  const setLayerGroupVisibility = (isChecked: boolean) => {
    if (isChecked) {
      fleetMap.mapManager.getLayerManager().getLayerGroup("vehicle-map-layer")?.setVisible(true);
    } else {
      fleetMap.mapManager.getLayerManager().getLayerGroup("vehicle-map-layer")?.setVisible(false);
    }
  };

  // Update openlayers. Visibility status of selected layer.
  const setVehicleMarkerVisibility = (deviceDetails: TrackSolidDevice, isChecked: boolean) => {
    updateStoreDeviceVisibility(deviceDetails.imei, isChecked);

    if (isChecked) {
      // call mutation function to add VectorLayer to LayerGroup('vehicle-map-layer')
      deviceLocationMutation.mutate(deviceDetails);
    } else {
      // remove vector layer from the vehicle layer group
      vehicleLayerGroup
        ?.getLayers()
        .getArray()
        .forEach((layer: BaseLayer) => {
          if (layer.get("imei") === deviceDetails.imei) {
            vehicleLayerGroup?.getLayers().remove(layer);
          }
        });
    }
  };

  // Update zustand store. Visibility of the device through creating a new copy of tsDeviceList.
  const updateStoreDeviceVisibility = (imei: string, isChecked: boolean) => {
    const deviceList = tsDeviceList;
    const newDeviceList = deviceList.map((device) => {
      if (device.imei === imei) {
        return { ...device, visible: isChecked };
      }
      return device;
    });

    setTsDeviceList(newDeviceList);
  };

  // Open modal for viewing vehicle details
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const toggleModal = (device: TrackSolidDevice) => {
    // setSelectedDevice(device);
    // setIsModalOpen(!isModalOpen);

    if (isModalOpen) {
      setIsModalOpen(false);

      setTimeout(function () {
        setIsModalOpen(true);
        setSelectedDevice(device);
      }, 500);
    } else {
      setIsModalOpen(true);
      setSelectedDevice(device);
    }
  };

  // Set initial data
  useEffect(() => {
    if (!isEmpty(deviceList)) {
      // Set data to zustand store
      setTsDeviceList(deviceList);
      setIsDeviceListFetched(false);

      // Create vehicle map layer group
      fleetMap.mapManager.getLayerManager().createLayerGroup("vehicle-map-layer");
    }
  }, [deviceList]);

  // Interval retrieving of vehicle location if view action is true
  useEffect(() => {
    const intervalSeconds = Number(process.env.NEXT_PUBLIC_INTERVAL_SECONDS);

    if (vehicleLayerGroup !== undefined && vehicleLayerGroup?.getLayers().getLength() > 0) {
      const arr: string[] = [];

      vehicleLayerGroup
        ?.getLayers()
        .getArray()
        .map((layer: BaseLayer) => {
          arr.push(layer.get("imei"));
        });

      const imeisString = arr.join(",");

      // 10 seconds of fetching car location
      const intervalId = setInterval(() => {
        // console.log(vehicleLayerGroup?.getLayers().getLength());
        // console.log(fleetMap.mapManager.getLayerManager().getLayerIds());
        multipleDeviceLocationMutation.mutate(imeisString);
      }, intervalSeconds);

      return () => clearInterval(intervalId);
    }

    // console.log(fleetMap.mapManager.getLayerManager().getGroupIds());
  }, [fleetMap.mapManager.getLayerManager().getGroupIds()]);

  return (
    <React.Fragment>
      <div className="flex cursor-pointer items-center space-x-2 p-2">
        <label>
          <input
            type="checkbox"
            className="peer hidden"
            onChange={(event) => {
              setLayerGroupVisibility(event.target.checked);
            }}
            defaultChecked={true}
          />
          <EyeOff className="mr-2 block w-5 text-stone-800 peer-checked:hidden" />
          <Eye className="mr-2 hidden w-5 text-stone-800 peer-checked:block" />
        </label>
        <AccordionTrigger>
          <p className="text-md font-bold text-black">Vehicles</p>
        </AccordionTrigger>
      </div>

      <AccordionContent className="flex flex-col gap-4 text-balance">
        <form className="mx-3 flex flex-col gap-1">
          {isLoading ? <Spinner size={"md"} /> : null}
          {!isEmpty(tsDeviceList) ? (
            <>
              {tsDeviceList.map((device: TrackSolidDevice) => (
                <React.Fragment key={device.imei}>
                  <div className="flex cursor-pointer items-center space-x-2 p-2">
                    <label>
                      <input
                        id={`device-${device.imei}`}
                        type="checkbox"
                        className="peer hidden"
                        onChange={(event) => {
                          setVehicleMarkerVisibility(device, event.target.checked);
                        }}
                        checked={device.visible}
                      />
                      <EyeOff className="mr-2 block w-5 text-stone-800 peer-checked:hidden" />
                      <Eye className="mr-2 hidden w-5 text-stone-800 peer-checked:block" />
                    </label>

                    <div
                      className="font-small w-full cursor-pointer text-sm leading-none text-black peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      onClick={() => toggleModal(device)}
                    >
                      <p>Plate No./Driver: {device.deviceName}</p>
                      <p>Status: {device.status}</p>
                      <p>Vehicle Type: {device.mcType}</p>
                    </div>
                  </div>
                  <hr className="my-1 last:hidden" />
                </React.Fragment>
              ))}
            </>
          ) : null}
        </form>

        <VehicleCardDetails accessToken={accessToken} open={isModalOpen} onOpenChange={setIsModalOpen} />
      </AccordionContent>
    </React.Fragment>
  );
};

export default VehicleRenderToggleList;
