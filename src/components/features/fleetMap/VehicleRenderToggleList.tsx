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
import { useFleetMap } from "./contexts/useFleetMapContext";
import { FeatureManager } from "@srms/lib/mapstudio/featureManager";
import { createIconStyles } from "./utils/createIconStyles";
import { IconStyles } from "@srms/server/types";
import BaseLayer from "ol/layer/Base";
import { isEmpty } from "@srms/utils/isEmpty";
import React from "react";
import { AccordionContent, AccordionTrigger } from "@srms/components/ui/Accordion";
import {
  Eye,
  CarFront,
  EllipsisVerticalIcon,
  EyeClosed,
  Search,
  LocateFixed,
  RefreshCcwIcon,
  ArrowDownAzIcon,
  ArrowUpZaIcon,
} from "lucide-react";
import VehicleDetailsCard from "./VehicleDetailsCard";
import { FaCarSide, FaShuttleVan, FaTruck } from "react-icons/fa";
import { ScrollArea } from "@srms/components/ui/ScrollArea";
import { useCardStore } from "@srms/components/stores/useCardStore";

interface TsTokensProps {
  accessToken: Token;
}

const VehicleRenderToggleList: FunctionComponent<TsTokensProps> = ({ accessToken }) => {
  const fleetMap = useFleetMap();
  const featureManager = new FeatureManager();
  const vehicleLayerGroup = fleetMap.mapManager.getLayerManager().getLayerGroup("vehicle-map-layer");

  const [isDeviceListFetched, setIsDeviceListFetched] = useState<boolean>(true);
  const [isDeviceLocated, setIsDeviceLLocated] = useState<boolean>(false); // state to determine whether the locate action is triggered. This is to determine whether to move the screen view to the vehicle location as center when the marker is toggled on.
  const [isDeviceListAlphabetical, setIsDeviceListAlphabetical] = useState<boolean>(false); // state to determine whether the device list is sorted in alphabetical order. This is to determine the sorting order when the device list is initially fetched and when the search query is empty.
  const [isDeviceListVisible, setIsDeviceListVisible] = useState<boolean>(false); //state to determine whether all the devices in the device list are visible. This is to determine whether to show all the markers of the devices in the map when the "show all" action is triggered.

  // zustand initialization
  const { tsDeviceList, setTsDeviceList, setSelectedDevice } = useTsDeviceStore();

  const {
    setWaterMeterTableCardOpen,
    setWaterMeterDetailsCardOpen,
    setValveDetailsCardOpen,
    vehicleDetailsCardOpen,
    setVehicleDetailsCardOpen,
  } = useCardStore();

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

      // Open card modal for valve details
      fleetMap.mapManager.getMap().on("click", (e) => {
        const feature = fleetMap.mapManager.getMap().forEachFeatureAtPixel(e.pixel, (feature) => {
          return feature;
        });

        if (!feature) {
          return;
        }

        const props = feature.getProperties();

        if (props.id && variables) {
          if (variables.imei === props.id) {
            toggleModal(variables);
          }
        }
      });

      if (selectedVehicleImei === variables.imei) {
      }
      // add vehicle vector layer to layer group
      vehicleLayerGroup?.getLayers().push(vectorLayer);

      // move the screen view to the vehicle location as center
      if (isDeviceLocated) {
        const vehicleCoordinates = new View({
          center: [data.lng, data.lat],
          zoom: 18,
        });
        fleetMap.mapManager.getMap().setView(vehicleCoordinates);
      }
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
  const setVehicleMarkerVisibility = (
    deviceDetails: TrackSolidDevice,
    isVisible: boolean,
    isLocate: boolean,
  ) => {
    updateStoreDeviceVisibility(deviceDetails.imei, isVisible);
    setIsDeviceLLocated(isLocate);

    if (isVisible && !isLocate) {
      // call mutation function to add VectorLayer to LayerGroup('vehicle-map-layer')
      deviceLocationMutation.mutate(deviceDetails);
    } else if (isVisible && isLocate) {
      // first remove vector layer from the vehicle layer group
      vehicleLayerGroup
        ?.getLayers()
        .getArray()
        .forEach((layer: BaseLayer) => {
          if (layer.get("imei") === deviceDetails.imei) {
            vehicleLayerGroup?.getLayers().remove(layer);
          }
        });
      //then call mutation function to add VectorLayer to LayerGroup('vehicle-map-layer') and move the screen view to the vehicle location as center
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

    const sortedList = toggleAlphabeticalOrder(isDeviceListAlphabetical, newDeviceList); //sort based on current alphabetical order state
    setTsDeviceList(sortedList);
    filterVehicleList(search, sortedList); // update the filtered vehicle list based on the search query after updating visibility
  };

  const [search, setSearch] = useState(""); //search bar state
  const [filteredVehicle, setFilteredVehicle] = useState<TrackSolidDevice[]>([]); //main filtered vehicle list for search functionality
  const [selectedVehicleImei, setSelectedVehicleImei] = useState<string>("");

  useEffect(() => {
    filterVehicleList(search, tsDeviceList);
  }, [search]);

  const filterVehicleList = (search: string, deviceList: TrackSolidDevice[]) => {
    if (isEmpty(search)) {
      setFilteredVehicle(deviceList);

      return;
    } else {
      const filtered = deviceList?.filter(
        (device: TrackSolidDevice) =>
          (typeof device.deviceName === "string" &&
            device.deviceName.toLowerCase().includes(search.toLowerCase())) ||
          (typeof device.vehicleName === "string" &&
            device.vehicleName.toLowerCase().includes(search.toLowerCase())) ||
          (typeof device.driverName === "string" &&
            device.driverName.toLowerCase().includes(search.toLowerCase())) ||
          (typeof device.deviceGroup === "string" &&
            device.deviceGroup.toLowerCase().includes(search.toLowerCase())),
      );
      setFilteredVehicle(filtered);
    }
  };

  const toggleModal = (device: TrackSolidDevice) => {
    // setSelectedDevice(device);
    // setIsModalOpen(!isModalOpen);
    setSelectedVehicleImei(device.imei);
    setWaterMeterTableCardOpen(false); //close water meter table card
    setWaterMeterDetailsCardOpen(false); //close water meter details card if its open
    setValveDetailsCardOpen(false); //close valve details card if its open

    if (vehicleDetailsCardOpen) {
      setVehicleDetailsCardOpen(false);

      setTimeout(function () {
        setVehicleDetailsCardOpen(true);
        setSelectedDevice(device);
      }, 500);
    } else {
      setVehicleDetailsCardOpen(true);
      setSelectedDevice(device);
    }
  };

  const toggleAlphabeticalOrder = (isAlphabetical: boolean, filteredVehicle: TrackSolidDevice[]) => {
    if (!isEmpty(filteredVehicle)) {
      if (isAlphabetical) {
        const sortedList = [...filteredVehicle].sort((a, b) =>
          a.deviceName.trimStart().localeCompare(b.deviceName.trimStart()),
        );
        return sortedList;
        // setFilteredVehicle(sortedList);
      } else {
        const sortedList = [...filteredVehicle].sort((a, b) =>
          b.deviceName.trimStart().localeCompare(a.deviceName.trimStart()),
        );
        return sortedList;
        // setFilteredVehicle(sortedList);
      }
    }
    return [];
  };

  useEffect(() => {
    const sortedList = toggleAlphabeticalOrder(isDeviceListAlphabetical, filteredVehicle);
    setFilteredVehicle(sortedList);
  }, [isDeviceListAlphabetical]);

  // Set initial data
  useEffect(() => {
    if (!isEmpty(deviceList)) {
      // Set data to zustand store
      setTsDeviceList(deviceList);
      setIsDeviceListFetched(false);
      setIsDeviceListAlphabetical(true);
      setFilteredVehicle([...deviceList].sort((a, b) => a.deviceName.localeCompare(b.deviceName))); //sort alphabetically by default

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
        multipleDeviceLocationMutation.mutate(imeisString);
      }, intervalSeconds);

      return () => clearInterval(intervalId);
    }

    // console.log(fleetMap.mapManager.getLayerManager().getGroupIds());
  }, [fleetMap.mapManager.getLayerManager().getGroupIds()]);

  const toggleAllDeviceVisibility = (visibility: boolean) => {
    setIsDeviceListVisible(visibility);
    if (visibility) {
      tsDeviceList.forEach((device: TrackSolidDevice) => {
        setVehicleMarkerVisibility(device, true, false); // set all markers to visible without moving the screen view to the vehicle location as center
      });

      const newDeviceList = tsDeviceList.map((device) => ({ ...device, visible: true })); //set all devices to visible
      const sortedList = toggleAlphabeticalOrder(isDeviceListAlphabetical, newDeviceList);
      setTsDeviceList(sortedList);
      filterVehicleList(search, sortedList);
    } else {
      tsDeviceList.forEach((device: TrackSolidDevice) => {
        setVehicleMarkerVisibility(device, false, false); // set all markers to invisible without moving the screen view to the vehicle location as center
      });
      const newDeviceList = tsDeviceList.map((device) => ({ ...device, visible: false })); //set all devices to visible
      const sortedList = toggleAlphabeticalOrder(isDeviceListAlphabetical, newDeviceList);
      setTsDeviceList(sortedList);
      filterVehicleList(search, sortedList);

      //forcibly remove all vector layer from the vehicle layer group
      vehicleLayerGroup
        ?.getLayers()
        .getArray()
        .forEach((layer: BaseLayer) => {
          vehicleLayerGroup?.getLayers().remove(layer);
        });
    }
  };

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
          <CarFront className="primary-text-color mr-2 block w-5 cursor-pointer opacity-30 peer-checked:hidden" />
          <CarFront className="primary-text-color mr-2 hidden w-5 cursor-pointer peer-checked:block" />
        </label>
        <AccordionTrigger className="w-50 items-center">
          <p className="text-md primary-text-color font-bold">Vehicles</p>
        </AccordionTrigger>
      </div>

      <AccordionContent className="flex flex-col gap-4 text-balance">
        <form className="mx-3 flex flex-col gap-1">
          {!isLoading && !isEmpty(filteredVehicle) ? (
            <>
              <label className="primary-text-color absolute relative mt-2 flex w-full items-center justify-between border border-slate-400 text-sm">
                <input
                  type="text"
                  placeholder="Search device name..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="p-2 text-slate-500 outline-none"
                />
                <Search className="absolute right-2 w-5 text-slate-500" />
              </label>

              {/* main buttons */}
              <div className="flex items-center justify-end gap-1">
                <label className="cursor-pointer text-gray-800 hover:text-gray-500">
                  <input
                    id={`devicealphabeticalorder`}
                    type="checkbox"
                    className="peer hidden"
                    onChange={(event) => {
                      setIsDeviceListAlphabetical(event.target.checked);
                    }}
                    checked={isDeviceListAlphabetical}
                  />
                  {isDeviceListAlphabetical ? (
                    <ArrowDownAzIcon className="mr-2 w-4 cursor-pointer text-gray-800 hover:text-gray-500" />
                  ) : (
                    <ArrowUpZaIcon className="mr-2 w-4 cursor-pointer text-gray-800 hover:text-gray-500" />
                  )}
                </label>
                <label className="cursor-pointer text-gray-800 hover:text-gray-500">
                  <input
                    id={`deviceshowall`}
                    type="checkbox"
                    className="peer hidden"
                    onChange={(event) => {
                      toggleAllDeviceVisibility(event.target.checked);
                    }}
                    checked={isDeviceListVisible}
                  />
                  {isDeviceListVisible ? (
                    <Eye className={`mr-2 w-4 cursor-pointer text-gray-800 hover:text-gray-500`} />
                  ) : (
                    <EyeClosed className={`mr-2 w-4 cursor-pointer text-gray-800 hover:text-gray-500`} />
                  )}
                </label>
                <RefreshCcwIcon
                  className="mr-2 w-4 cursor-pointer text-gray-800 hover:text-gray-500"
                  onClick={() => {
                    setSearch("");
                  }}
                />
              </div>
            </>
          ) : null}

          {isLoading ? <Spinner size={"md"} /> : null}

          {!isLoading && !isEmpty(filteredVehicle) ? (
            <>
              <ScrollArea className="h-[calc(100vh-250px)]">
                <div className="flex flex-col gap-1">
                  {filteredVehicle.map((device: TrackSolidDevice) => (
                    <React.Fragment key={device.imei}>
                      <div
                        className={`${device.activationTime ? "cursor-pointer" : "cursor-not-allowed opacity-50"} primary-text-color w-full items-center space-x-2 pt-1 pr-2 pb-2 transition-all ${selectedVehicleImei === device.imei ? "bg-blue-100 hover:bg-blue-300" : "bg-slate-100 hover:bg-slate-200"}`}
                        onClick={() => (device.activationTime ? toggleModal(device) : null)}
                      >
                        <div className="flex w-full flex-row items-center justify-between gap-2">
                          <div className="flex items-center gap-1">
                            <div
                              className={`m-2 flex h-8 w-11 items-center justify-center rounded-full ${device.visible ? "bg-blue-800" : "bg-gray-800"}`}
                            >
                              {device.vehicleIcon === "truck" ? (
                                <FaTruck className="block w-4 text-white" />
                              ) : device.vehicleIcon === "car" ? (
                                <FaCarSide className="block w-4 text-white" />
                              ) : device.vehicleIcon === "bus" ? (
                                <FaShuttleVan className="block w-4 text-white" />
                              ) : (
                                <FaCarSide className="block w-4 text-white" />
                              )}
                            </div>

                            <div className="item-start w-full justify-center">
                              <p className="text-xs font-bold">{device.deviceName}</p>
                              <p className="text-xs">{device.activationTime ?? "---- -- -- --:--:--"}</p>
                            </div>
                          </div>

                          {/* <p className="text-sm">{"1day+"}</p> */}

                          <label className="cursor-pointer text-gray-800 hover:text-gray-500">
                            {/* <input
                              id={`device-${device.imei}`}
                              type="checkbox"
                              className="peer hidden"
                              onChange={(event) => {
                                setVehicleMarkerVisibility(device, event.target.checked);
                              }}
                              checked={device.visible}
                            /> */}
                            <EllipsisVerticalIcon className="mr-2 block w-5" />
                          </label>
                        </div>

                        <div className="flex w-full items-end justify-end gap-2">
                          <label className="cursor-pointer text-gray-800 hover:text-gray-500">
                            <input
                              disabled={device.activationTime ? false : true}
                              id={`devicelocate-${device.imei}`}
                              type="checkbox"
                              className="peer hidden"
                              onChange={() => {
                                setVehicleMarkerVisibility(device, true, true);
                              }}
                              checked={device.visible}
                            />
                            <LocateFixed className="mr-2 w-4 cursor-pointer text-gray-800 hover:text-gray-500" />
                          </label>

                          <label className="cursor-pointer text-gray-800 hover:text-gray-500">
                            <input
                              disabled={device.activationTime ? false : true}
                              id={`device-${device.imei}`}
                              type="checkbox"
                              className="peer hidden"
                              onChange={(event) => {
                                setVehicleMarkerVisibility(device, event.target.checked, false);
                              }}
                              checked={device.visible}
                            />
                            <EyeClosed className="mr-2 block w-4 peer-checked:hidden" />
                            <Eye className="mr-2 hidden w-4 peer-checked:block" />
                          </label>
                        </div>
                      </div>
                      {/* <hr className="my-1 bg-white last:hidden" /> */}
                    </React.Fragment>
                  ))}
                </div>
              </ScrollArea>
            </>
          ) : isLoading ? null : (
            <p className="primary-text-color p-2 text-center">No devices available</p>
          )}
        </form>

        <VehicleDetailsCard
          accessToken={accessToken}
          open={vehicleDetailsCardOpen}
          onOpenChange={setVehicleDetailsCardOpen}
        />
      </AccordionContent>
    </React.Fragment>
  );
};

export default VehicleRenderToggleList;
