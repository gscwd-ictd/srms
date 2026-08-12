/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useTsDeviceStore } from "@srms/components/stores/useTsDeviceStore";
import { Spinner } from "@srms/components/ui-custom/Spinner";
import { TrackSolidDevice, TrackSolidDeviceLocation } from "@srms/lib/tracksolid/types";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { Feature } from "ol";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import { FunctionComponent, useEffect, useRef, useState } from "react";
import CarMarker from "../../../../public/images/car_icon.svg";
import CarMarkerHighlight from "../../../../public/images/car_icon_highlight.svg";
import { Point } from "ol/geom";
import { useGisMap } from "./contexts/useGisMapContext";
import { FeatureManager } from "@srms/lib/mapstudio/featureManager";
import { createIconStyles } from "./utils/createIconStyles";
import { IconStyles, LabelStyles } from "@srms/server/types";
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
// import VehicleDetailsCard from "./VehicleDetailsCard";
import { FaCarSide, FaShuttleVan, FaTruck } from "react-icons/fa";
import { ScrollArea } from "@srms/components/ui/ScrollArea";
import { useCardStore } from "@srms/components/stores/useCardStore";
import { createLabelStyles } from "../adminMap/utils/createLabelStyles";
import { Pixel } from "ol/pixel";
import { useTracksolid } from "./contexts/useTracksolid";
import { tracksolidApi } from "@srms/lib/tracksolid/tracksolidHelper";

const VehicleRenderToggleList: FunctionComponent = () => {
  const {
    accessToken: tsAccessToken,
    isLoading: isLoadingTs,
    isTracksolidReady,
    hasFleetAbility,
  } = useTracksolid();

  const fleetMap = useGisMap();
  const featureManager = new FeatureManager();
  const vehicleLayerGroup = fleetMap.mapManager.getLayerManager().getLayerGroup("vehicle-map-layer");
  const tracksolidDisabled = !hasFleetAbility || !isTracksolidReady || isLoadingTs;

  const [isDeviceListFetched, setIsDeviceListFetched] = useState<boolean>(true);
  const isDeviceLocated = useRef(false); // useRef to keep track of the latest value of isDeviceLocated in the asynchronous mutation functions without causing re-renders
  // const [isDeviceLocated, setIsDeviceLocated] = useState<boolean>(false); // state to determine whether the locate action is triggered. This is to determine whether to move the screen view to the vehicle location as center when the marker is toggled on.
  const [isDeviceListAlphabetical, setIsDeviceListAlphabetical] = useState<boolean>(false); // state to determine whether the device list is sorted in alphabetical order. This is to determine the sorting order when the device list is initially fetched and when the search query is empty.
  const [isDeviceListVisible, setIsDeviceListVisible] = useState<boolean>(false); //state to determine whether all the devices in the device list are visible. This is to determine whether to show all the markers of the devices in the map when the "show all" action is triggered.
  const [isToggleVisibilityLoading, setIsToggleVisibilityLoading] = useState<boolean>(false); //state to determine whether the device list is loading. This is to show the loading spinner when the device list is being fetched and when the "show all" action is triggered.

  // state to determine whether the locate action is triggered. This is to determine whether to move the screen view to the vehicle location as center when the marker is toggled on.
  // const [isDeviceLocated, setIsDeviceLLocated] = useState<boolean>(false);

  // state to determine whether the device list is sorted in alphabetical order. This is to determine the sorting order when the device list is initially fetched and when the search query is empty.
  // const [isDeviceListAlphabetical, setIsDeviceListAlphabetical] = useState<boolean>(false);

  // state to determine whether all the devices in the device list are visible. This is to determine whether to show all the markers of the devices in the map when the "show all" action is triggered.
  // const [isDeviceListVisible, setIsDeviceListVisible] = useState<boolean>(false);

  // zustand initialization
  const { tsDeviceList, setTsDeviceList, setSelectedDevice } = useTsDeviceStore();

  // const [previousVehicleFeature, setPreviousVehicleFeature] = useState<Feature>();
  const [selectedVehicleFeature, setSelectedVehicleFeature] = useState<Feature[]>([]);
  const [tsDeviceLocations, setTsDeviceLocations] = useState<TrackSolidDeviceLocation[]>([]);
  const [search, setSearch] = useState(""); //search bar state
  const [filteredVehicleList, setFilteredVehicleList] = useState<TrackSolidDevice[]>([]); //main filtered vehicle list for search functionality
  const [selectedVehicleImei, setSelectedVehicleImei] = useState<string>("");

  const {
    setConsumersTableCardOpen,
    // setConsumerDetailsCardOpen,
    // setValveDetailsCardOpen,
    // vehicleDetailsCardOpen,
    setVehicleDetailsCardOpen,
    setVehicleDetailsToFetch,
  } = useCardStore();

  // Get vehicle list and add to zustand store
  const { data: deviceList, isLoading } = useQuery({
    queryKey: ["vehicle-devices"],
    refetchOnReconnect: false,
    enabled: hasFleetAbility && isTracksolidReady && !!tsAccessToken && isDeviceListFetched,
    queryFn: async () => {
      const response = await tracksolidApi.post(
        `/v1/tracksolid/devices`,
        {},
        { headers: { "access-token": tsAccessToken } },
      );

      return response.data;
    },
    throwOnError: true,
  });

  // Get location details of device. Success will set the marker and add to map.
  const deviceLocationMutation = useMutation({
    mutationKey: ["device-location"],
    mutationFn: async (deviceDetails: TrackSolidDevice) => {
      if (!isTracksolidReady || !tsAccessToken) {
        throw new Error("TrackSolid session is not ready.");
      }

      const response = await tracksolidApi.post(
        `/v1/tracksolid/devices-location`,
        { imeis: deviceDetails.imei },
        {
          headers: { "access-token": tsAccessToken },
        },
      );
      console.log("device location response", response.data);
      setTsDeviceLocations((prev) => [...prev, response.data[0]]); // add new device location to the existing list of device locations in state which is used to update the position of the marker when the location details of multiple devices are fetched through the multipleDeviceLocationMutation. This is important because when the location details of multiple devices are fetched, the position of the marker will be updated based on the location details in this state.
      return response.data[0];
    },
    onMutate: (variables) => {
      console.log(`Fetching location of device attached to vehicle: ${variables?.deviceName}`);
    },
    onSuccess: async (data, variables) => {
      const vectorLayer = new VectorLayer();

      const vectorSource = new VectorSource();

      const carProperties = {
        id: data.imei,
        direction: data.direction,
      };

      const feature = featureManager.createFeature(new Point([data.lng, data.lat]), carProperties);

      setSelectedVehicleImei(data.imei); //set selected vehicle imei to the vehicle that is toggled on. This is used to determine which vehicle is selected in the vehicle details card and to set the marker of the selected vehicle to the highlighted version.
      //automatically set marker to highlighted version
      const vehicleStyles = {
        src: CarMarkerHighlight.src!,
        anchor: [0.5, 0.5],
        scale: 0.3,
        rotation: parseInt(data?.direction ?? "0"),
      };

      const featureStyle = createIconStyles(vehicleStyles as IconStyles);
      // feature.setStyle(featureStyle.iconStyle);

      const vehicleLabelStyle = {
        font: "13px Calibri,sans-serif",
        overflow: true,
        fillColor: "#000",
        strokeColor: "#fff",
        width: 3,
        offsetY: 30,
        text: `${data?.deviceName ?? "---"}`,
      };

      const featureStyle2 = createLabelStyles(vehicleLabelStyle as LabelStyles);

      const vehicleSpeedLabelStyle = {
        font: "13px Calibri,sans-serif",
        overflow: true,
        fillColor: "#000",
        strokeColor: "#fff",
        width: 3,
        offsetY: 45,
        text: `${data.speed ?? "--"} km/h`,
      };
      const featureStyle3 = createLabelStyles(vehicleSpeedLabelStyle as LabelStyles);

      feature.setStyle([featureStyle.iconStyle, featureStyle2.labelStyle, featureStyle3.labelStyle]);

      //add vehicle to selectedVehicleFeature state which is used to determine which vehicle marker should be highlighted.
      highlightSelectedVehicle(feature);

      vectorSource.addFeature(feature);

      vectorLayer.setSource(vectorSource);

      vectorLayer.setVisible(true);

      vectorLayer.setZIndex(999);

      vectorLayer.setProperties({ imei: variables.imei, vehicleName: variables.deviceName });

      // // Open card modal for vehicle details
      fleetMap.mapManager.getMap().on("click", (e) => {
        const map = fleetMap.mapManager.getMap();
        const clickedFeature = map.forEachFeatureAtPixel(e.pixel, (f) => f) as Feature;

        if (!clickedFeature) {
          return;
        } else {
          const props = clickedFeature.getProperties();
          if (props.id && variables) {
            if (variables.imei === props.id) {
              toggleModal(variables);
            }
          }
        }
      });

      // add vehicle vector layer to layer group
      vehicleLayerGroup?.getLayers().push(vectorLayer);

      // If all filteredVehicleList are visible, set loading to false to remove the loading spinner when toggling visibility of all devices.
      const count = tsDeviceList.filter((item) => item.visible === true).length;
      if (count >= tsDeviceList.length - 1) {
        setIsToggleVisibilityLoading(false);
      }

      // move the screen view to the vehicle location as center
      if (isDeviceLocated.current) {
        const map = fleetMap.mapManager.getMap();
        const view = map.getView();

        view.animate({
          center: [data.lng, data.lat],
          zoom: 18,
          duration: 500,
        });
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
      if (!isTracksolidReady || !tsAccessToken) {
        throw new Error("TrackSolid session is not ready.");
      }

      const response = await tracksolidApi.post(
        `/v1/tracksolid/devices-location`,
        { imeis: devices },
        {
          headers: { "access-token": tsAccessToken },
        },
      );
      setTsDeviceLocations(response.data);
      return response;
    },
    onMutate: () => {
      console.log(`Fetching location details of devices`);
    },
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
                  //change vehicle marker to hightelight version if it is the selected vehicle in the vehicle details card
                  let vehicleStyles;
                  if (
                    selectedVehicleFeature.length > 1
                      ? device.imei === selectedVehicleFeature[1]?.getProperties().id
                      : device.imei === selectedVehicleFeature[0]?.getProperties().id
                  ) {
                    vehicleStyles = {
                      src: CarMarkerHighlight.src!,
                      anchor: [0.5, 0.5],
                      scale: 0.3,
                      rotation: parseInt(device.direction ?? "0"),
                    };
                  } else {
                    vehicleStyles = {
                      src: CarMarker.src!,
                      anchor: [0.5, 0.5],
                      scale: 0.3,
                      rotation: parseInt(device.direction ?? "0"),
                    };
                  }

                  const featureStyle = createIconStyles(vehicleStyles as IconStyles);
                  // feature.setStyle(featureStyle.iconStyle);

                  const vehicleLabelStyle = {
                    font: "13px Calibri,sans-serif",
                    overflow: true,
                    fillColor: "#000",
                    strokeColor: "#fff",
                    width: 3,
                    offsetY: 30,
                    text: `${device.deviceName ?? "---"}`,
                  };
                  const featureStyle2 = createLabelStyles(vehicleLabelStyle as LabelStyles);

                  const vehicleSpeedLabelStyle = {
                    font: "13px Calibri,sans-serif",
                    overflow: true,
                    fillColor: "#000",
                    strokeColor: "#fff",
                    width: 3,
                    offsetY: 45,
                    text: `${device.speed ?? "--"} km/h`,
                  };
                  const featureStyle3 = createLabelStyles(vehicleSpeedLabelStyle as LabelStyles);

                  feature.setStyle([
                    featureStyle.iconStyle,
                    featureStyle2.labelStyle,
                    featureStyle3.labelStyle,
                  ]);

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
  // const setLayerGroupVisibility = (isChecked: boolean) => {
  //   if (isChecked) {
  //     fleetMap.mapManager.getLayerManager().getLayerGroup("vehicle-map-layer")?.setVisible(true);
  //   } else {
  //     fleetMap.mapManager.getLayerManager().getLayerGroup("vehicle-map-layer")?.setVisible(false);
  //   }
  // };

  // Change cursor to pointer when hovering over vehicle markers and valve markers
  useEffect(() => {
    if (!fleetMap.mapManager) return;

    const map = fleetMap.mapManager.getMap();

    const pointerMoveHandler = (e: { pixel: Pixel }) => {
      const hit = map.forEachFeatureAtPixel(e.pixel, (feature, layer) => {
        const layerId = layer?.get("id");
        const imei = layer?.get("imei");

        return (
          layerId === "valves" || // valve marker
          !!imei // vehicle layers (since you set imei as property)
        );
      });

      map.getTargetElement().style.cursor = hit ? "pointer" : "";
    };

    map.on("pointermove", pointerMoveHandler);

    return () => {
      map.un("pointermove", pointerMoveHandler);
    };
  }, [fleetMap.mapManager]);

  // Update openlayers. Visibility status of selected layer.
  const setVehicleMarkerVisibility = (
    deviceDetails: TrackSolidDevice,
    isVisible: boolean,
    isLocate: boolean,
  ) => {
    updateStoreDeviceVisibility(deviceDetails.imei, isVisible);
    isDeviceLocated.current = isLocate;

    if (!isTracksolidReady) {
      return;
    }

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

  useEffect(() => {
    filterVehicleList(search, tsDeviceList);
  }, [search]);

  const [filteredVehicle, setFilteredVehicle] = useState<TrackSolidDevice[]>([]); //main filtered vehicle list for search functionality

  // const successToast = (message: string) => {
  //   toast.success("Success!", {
  //     description: message,
  //     position: "top-center",
  //   });
  // };

  // const errorToast = (message: string) => {
  //   toast.error("An Error Has Occurred", {
  //     description: message,
  //     position: "top-center",
  //   });
  // };

  const filterVehicleList = (search: string, deviceList: TrackSolidDevice[]) => {
    if (isEmpty(search)) {
      const sortedList = toggleAlphabeticalOrder(isDeviceListAlphabetical, deviceList); //sort based on current alphabetical order state
      setFilteredVehicleList(sortedList);

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
      const sortedList = toggleAlphabeticalOrder(isDeviceListAlphabetical, filtered); //sort based on current alphabetical order state
      setFilteredVehicleList(sortedList);
    }
  };

  const toggleModal = (device: TrackSolidDevice) => {
    // Iterate through the layer group of vehicles and add the feature to SelectedVehicleFeature array
    vehicleLayerGroup
      ?.getLayers()
      .getArray()
      .forEach((layer: BaseLayer) => {
        if (layer instanceof VectorLayer) {
          const source = layer.getSource().getFeatures();

          // Iterate through the geom of each layer/feature
          source.forEach((feature: Feature) => {
            if (feature.getProperties().id === device.imei) {
              highlightSelectedVehicle(feature);
            }
          });
        }
      });

    setSelectedVehicleImei(device.imei);
    setConsumersTableCardOpen(false); //close water meter table card
    // setConsumerDetailsCardOpen(false); //close water meter details card if its open
    // setValveDetailsCardOpen(false); //close valve details card if its open

    // setVehicleDetailsCardOpen(false); //close vehicle details card first
    setVehicleDetailsToFetch(false); // set to false first to trigger vehicle details to fetch data again
    setTimeout(function () {
      setVehicleDetailsCardOpen(true); //open again to fetch new data
      setVehicleDetailsToFetch(true); // trigger for vehicle details card to fetch new data
      setSelectedDevice(device);
    }, 500);
  };

  const toggleAlphabeticalOrder = (isAlphabetical: boolean, filteredVehicleList: TrackSolidDevice[]) => {
    if (!isEmpty(filteredVehicleList)) {
      if (isAlphabetical) {
        const sortedList = [...filteredVehicleList].sort((a, b) =>
          a.deviceName.trimStart().localeCompare(b.deviceName.trimStart()),
        );
        return sortedList;
      } else {
        const sortedList = [...filteredVehicleList].sort((a, b) =>
          b.deviceName.trimStart().localeCompare(a.deviceName.trimStart()),
        );
        return sortedList;
      }
    }
    return [];
  };

  //update highlighted vehicle marker whenever selectedVehicleFeature changes which is triggered when a new vehicle is selected.
  // const toggleAllDeviceVisibility = (visibility: boolean) => {
  //   setIsDeviceListVisible(visibility);
  //   if (visibility) {
  //     tsDeviceList.forEach((device: TrackSolidDevice) => {
  //       setVehicleMarkerVisibility(device, true, false); // set all markers to visible without moving the screen view to the vehicle location as center
  //     });

  //     const newDeviceList = tsDeviceList.map((device) => ({ ...device, visible: true })); //set all devices to visible
  //     const sortedList = toggleAlphabeticalOrder(isDeviceListAlphabetical, newDeviceList);
  //     setTsDeviceList(sortedList);
  //     filterVehicleList(search, sortedList);
  //   } else {
  //     tsDeviceList.forEach((device: TrackSolidDevice) => {
  //       setVehicleMarkerVisibility(device, false, false); // set all markers to invisible without moving the screen view to the vehicle location as center
  //     });
  //     const newDeviceList = tsDeviceList.map((device) => ({ ...device, visible: false })); //set all devices to visible
  //     const sortedList = toggleAlphabeticalOrder(isDeviceListAlphabetical, newDeviceList);
  //     setTsDeviceList(sortedList);
  //     filterVehicleList(search, sortedList);

  //     //forcibly remove all vector layer from the vehicle layer group
  //     vehicleLayerGroup
  //       ?.getLayers()
  //       .getArray()
  //       .forEach((layer: BaseLayer) => {
  //         vehicleLayerGroup?.getLayers().remove(layer);
  //       });
  //   }
  // };

  useEffect(() => {
    filterVehicleList(search, tsDeviceList);
  }, [search]);

  useEffect(() => {
    //reset all markers to normal vehicle style first
    vehicleLayerGroup
      ?.getLayers()
      .getArray()
      .forEach((layer: BaseLayer) => {
        if (layer instanceof VectorLayer) {
          const source = layer.getSource().getFeatures();

          // Iterate through the geom of each layer/feature
          source.forEach((feature: Feature) => {
            const normalStyle = createIconStyles({
              src: CarMarker.src!,
              anchor: [0.5, 0.5],
              scale: 0.3,
              rotation: parseInt(feature?.getProperties().direction ?? "0"),
            });
            feature?.setStyle(normalStyle.iconStyle);

            const device = getVehicleDetailsByImei(feature?.getProperties().id);

            const vehicleLabelStyle = {
              font: "13px Calibri,sans-serif",
              overflow: true,
              fillColor: "#000",
              strokeColor: "#fff",
              width: 3,
              offsetY: 30,
              text: `${device[0]?.deviceName ?? "AAAAAAAAAAA"}`,
            };
            const featureStyle2 = createLabelStyles(vehicleLabelStyle as LabelStyles);

            const vehicleSpeedLabelStyle = {
              font: "13px Calibri,sans-serif",
              overflow: true,
              fillColor: "#000",
              strokeColor: "#fff",
              width: 3,
              offsetY: 45,
              text: `${device[0]?.speed ?? "--"} km/h`,
            };
            const featureStyle3 = createLabelStyles(vehicleSpeedLabelStyle as LabelStyles);

            feature.setStyle([normalStyle.iconStyle, featureStyle2.labelStyle, featureStyle3.labelStyle]);
          });
        }
      });

    if (selectedVehicleFeature.length > 1) {
      //index 1 is the newly selected vehicle feature which will be set to the highlighted style
      const highlightStyle = createIconStyles({
        src: CarMarkerHighlight.src!,
        anchor: [0.5, 0.5],
        scale: 0.3,
        rotation: parseInt(selectedVehicleFeature[1]?.getProperties().direction ?? "0"),
      });

      const device = getVehicleDetailsByImei(selectedVehicleFeature[1]?.getProperties().id);
      const vehicleLabelStyle = {
        font: "13px Calibri,sans-serif",
        overflow: true,
        fillColor: "#000",
        strokeColor: "#fff",
        width: 3,
        offsetY: 30,
        text: `${device[0]?.deviceName ?? "---"}`,
      };
      const featureStyle2 = createLabelStyles(vehicleLabelStyle as LabelStyles);

      const vehicleSpeedLabelStyle = {
        font: "13px Calibri,sans-serif",
        overflow: true,
        fillColor: "#000",
        strokeColor: "#fff",
        width: 3,
        offsetY: 45,
        text: `${device[0]?.speed ?? "--"} km/h`,
      };
      const featureStyle3 = createLabelStyles(vehicleSpeedLabelStyle as LabelStyles);
      selectedVehicleFeature[1]?.setStyle([
        highlightStyle.iconStyle,
        featureStyle2.labelStyle,
        featureStyle3.labelStyle,
      ]);
    } else {
      //index 0 is the newly selected vehicle feature which will be set to the highlighted style
      const highlightStyle = createIconStyles({
        src: CarMarkerHighlight.src!,
        anchor: [0.5, 0.5],
        scale: 0.3,
        rotation: parseInt(selectedVehicleFeature[0]?.getProperties().direction ?? "0"),
      });

      // selectedVehicleFeature[0]?.setStyle(highlightStyle.iconStyle);
      const device = getVehicleDetailsByImei(selectedVehicleFeature[0]?.getProperties().id);

      const vehicleLabelStyle = {
        font: "13px Calibri,sans-serif",
        overflow: true,
        fillColor: "#000",
        strokeColor: "#fff",
        width: 3,
        offsetY: 30,
        text: `${device[0]?.deviceName ?? "---"}`,
      };
      const featureStyle2 = createLabelStyles(vehicleLabelStyle as LabelStyles);

      const vehicleSpeedLabelStyle = {
        font: "13px Calibri,sans-serif",
        overflow: true,
        fillColor: "#000",
        strokeColor: "#fff",
        width: 3,
        offsetY: 45,
        text: `${device[0]?.speed ?? "--"} km/h`,
      };
      const featureStyle3 = createLabelStyles(vehicleSpeedLabelStyle as LabelStyles);

      selectedVehicleFeature[0]?.setStyle([
        highlightStyle.iconStyle,
        featureStyle2.labelStyle,
        featureStyle3.labelStyle,
      ]);
    }
  }, [selectedVehicleFeature]);

  const highlightSelectedVehicle = (newVehicle: Feature) => {
    setSelectedVehicleFeature((prev) => {
      const updated = [...prev, newVehicle];
      return updated.slice(-2); //always make sure there are 2 or less features in the array
    });
  };

  const getVehicleDetailsByImei = (imei: string) => {
    const filtered = tsDeviceLocations?.filter(
      (device: TrackSolidDeviceLocation) => typeof device.imei === "string" && imei === device.imei,
    );
    return filtered;
  };

  // Toggle alphabetical order of the device list
  useEffect(() => {
    const sortedList = toggleAlphabeticalOrder(isDeviceListAlphabetical, filteredVehicleList);
    setFilteredVehicleList(sortedList);
  }, [isDeviceListAlphabetical]);

  // Set initial data
  useEffect(() => {
    if (!isEmpty(deviceList)) {
      // Set data to zustand store
      setTsDeviceList(deviceList);
      setIsDeviceListFetched(false);
      setIsDeviceListAlphabetical(true);
      setFilteredVehicleList([...deviceList].sort((a, b) => a.deviceName.localeCompare(b.deviceName))); //sort alphabetically by default

      // Create vehicle map layer group
      fleetMap.mapManager.getLayerManager().createLayerGroup("vehicle-map-layer").setZIndex(900);
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
    isDeviceLocated.current = false; //reset locate state to false when toggling visibility of all devices because the screen view will not be moved to the vehicle location as center when toggling visibility of all devices. This is to avoid confusion to the user when they toggle on the visibility of all devices and the screen view is moved to a random vehicle location as center which may not be the vehicle they want to view.

    setIsToggleVisibilityLoading(true); // set loading to true when toggling visibility of all devices/vehicles to avoid multiple clicks while the device list is still being updated which may cause performance issues. The loading spinner will be removed when the last device in the list is updated which is determined by the visibleDevicesCounter state.

    setIsDeviceListVisible(visibility); // set the state of whether all devices are visible or not which is used to determine the checked status of the "show all" checkbox and to show the loading spinner when toggling visibility of all devices
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

      const newDeviceList = tsDeviceList.map((device) => ({ ...device, visible: false })); //set all devices to invisible
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

      setIsToggleVisibilityLoading(false);
      setVehicleDetailsCardOpen(false); //close vehicle details card if its open when toggling off all devices to avoid mismatch of the vehicle details shown and the vehicle markers shown in the map. User can open the vehicle details card again if they want to view the details of any specific vehicle after toggling on all devices.
      setSelectedVehicleImei(""); //reset selected vehicle imei to empty string to avoid mismatch of the selected vehicle and the vehicle markers shown in the map
    }
  };

  useEffect(() => {
    console.log(
      "hasFleetAbility: " + hasFleetAbility,
      "isTracksolidReady: " + isTracksolidReady,
      "tsAccessToken: " + tsAccessToken,
      "isDeviceListFetched: " + isDeviceListFetched,
    );
  }, [hasFleetAbility, isTracksolidReady, tsAccessToken, isDeviceListFetched]);

  return (
    <React.Fragment>
      <div className="flex cursor-pointer items-center space-x-2 p-2">
        {isToggleVisibilityLoading ? (
          <Spinner size={"xs"} />
        ) : (
          <label>
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
              <CarFront className={`primary-text-color mr-2 block w-5 cursor-pointer`} />
            ) : (
              <CarFront className={`primary-text-color mr-2 block w-5 cursor-pointer opacity-30`} />
            )}
          </label>
        )}
        {/* <label>
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
        </label> */}
        <AccordionTrigger className="w-50 items-center">
          <p className="text-md primary-text-color font-bold">Vehicles</p>
        </AccordionTrigger>
      </div>

      <AccordionContent className="flex flex-col gap-4 text-balance">
        <form className="mx-3 flex flex-col gap-1">
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
          <div className="flex items-center justify-between gap-1">
            <div className="primary-text-color flex items-center justify-start gap-1 text-sm">
              {filteredVehicleList.filter((device) => device.visible).length}/{filteredVehicleList.length}{" "}
              Visible
            </div>
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
                  disabled={tracksolidDisabled}
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
          </div>
          {/* main buttons */}

          {isLoadingTs || isLoading ? <Spinner size="md" /> : null}

          {!isLoadingTs &&
          !isLoading &&
          isTracksolidReady &&
          !isEmpty(filteredVehicleList) &&
          !isEmpty(filteredVehicle) ? (
            <>
              <ScrollArea className="h-[calc(100vh-400px)]">
                <div className="flex flex-col gap-1">
                  {filteredVehicleList.map((device: TrackSolidDevice) => (
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
                              disabled={tracksolidDisabled || !device.activationTime}
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

                          <label className="flex cursor-pointer items-center justify-center text-gray-800 hover:text-gray-500">
                            {isToggleVisibilityLoading ? (
                              <Spinner size={"xxs"} className="mb-1" />
                            ) : (
                              <>
                                <input
                                  disabled={tracksolidDisabled || !device.activationTime}
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
                              </>
                            )}
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

        {/* <VehicleDetailsCard
          accessToken={accessToken}
          open={vehicleDetailsCardOpen}
          onOpenChange={setVehicleDetailsCardOpen}
        /> */}
        {/* <VehicleDetailsCard open={vehicleDetailsCardOpen} onOpenChange={setVehicleDetailsCardOpen} /> */}
      </AccordionContent>
    </React.Fragment>
  );
};

export default VehicleRenderToggleList;
