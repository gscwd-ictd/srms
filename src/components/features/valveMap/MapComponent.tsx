"use client";

import { useEffect, useState, type FunctionComponent } from "react";
import useMap from "@srms/components/hooks/useMap";
import BaseLayerPicker from "./BaseLayerPicker";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { useMapStore } from "@srms/components/stores/useMapStore";
import { MapValveData, ValveData } from "@srms/lib/pms/types";
import ValveOpen from "../../../../public/images/valve_open.svg";
import ValveClose from "../../../../public/images/valve_close.svg";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import { Fill, Icon, Stroke, Style } from "ol/style";
import { Feature } from "ol";
import { Point } from "ol/geom";
import { fromLonLat, toLonLat } from "ol/proj";
import ValveCardDetails from "./ValveCardDetails";
import { ValveStatus } from "@srms/components/enums/valveTypes.enum";
import CircleStyle from "ol/style/Circle";

const MapComponent: FunctionComponent = () => {
  const map = useMap();

  // zustand initialization
  const { mapRef, setValvesLayer } = useMapStore();

  // Get pipeline layer and add to zustand store
  const { data, isSuccess } = useQuery({
    queryKey: ["valves-layer"],
    refetchOnReconnect: false,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    queryFn: async () => {
      const { data } = await axios.get(`${process.env.NEXT_PUBLIC_APP_URL}/api/v1/layers/valves`);

      setValvesLayer(data.features);
      return data.features;
    },
    throwOnError: true,
  });

  // Open modal for viewing vehicle details
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedValve, setSelectedValve] = useState<MapValveData>();

  // const toggleModal = (device: TrackSolidDevice) => {
  //   setIsModalOpen(!isModalOpen);
  //   // setSelectedDevice(device);
  // };

  // add to layer to map
  useEffect(() => {
    if (isSuccess) {
      data.map((valve: ValveData) => {
        let valveMarker = new VectorLayer({});

        if (valve.properties.status === ValveStatus.OPEN) {
          valveMarker = new VectorLayer({
            source: new VectorSource({
              features: [
                new Feature({
                  geometry: new Point(fromLonLat(toLonLat(valve.geometry.coordinates, "EPSG:32651"))),
                  id: valve.id,
                  diameter: valve.properties.diameter,
                  brand: valve.properties.brand,
                  "yr.install": valve.properties["yr.install"],
                  status: valve.properties.status,
                  curnt_stat: valve.properties.curnt_stat,
                  type: valve.properties.type,
                }),
              ],
            }),
            visible: true,
            style: new Style({
              image: new Icon({
                src: ValveOpen.src!,
                anchor: [0.5, 0.5],
                scale: 0.8,
              }),
              zIndex: 999,
            }),
          });
        } else if (valve.properties.status === ValveStatus.CLOSE) {
          valveMarker = new VectorLayer({
            source: new VectorSource({
              features: [
                new Feature({
                  geometry: new Point(fromLonLat(toLonLat(valve.geometry.coordinates, "EPSG:32651"))),
                  id: valve.id,
                  diameter: valve.properties.diameter,
                  brand: valve.properties.brand,
                  "yr.install": valve.properties["yr.install"],
                  status: valve.properties.status,
                  curnt_stat: valve.properties.curnt_stat,
                  type: valve.properties.type,
                }),
              ],
            }),
            visible: true,
            style: new Style({
              image: new Icon({
                src: ValveClose.src!,
                anchor: [0.5, 0.5],
                scale: 0.8,
              }),
              zIndex: 999,
            }),
          });
        } else {
          valveMarker = new VectorLayer({
            source: new VectorSource({
              features: [
                new Feature({
                  geometry: new Point(fromLonLat(toLonLat(valve.geometry.coordinates, "EPSG:32651"))),
                  id: valve.id,
                  diameter: valve.properties.diameter,
                  brand: valve.properties.brand,
                  "yr.install": valve.properties["yr.install"],
                  status: valve.properties.status,
                  curnt_stat: valve.properties.curnt_stat,
                  type: valve.properties.type,
                }),
              ],
            }),
            visible: true,
            style: new Style({
              image: new CircleStyle({
                radius: 7,
                fill: new Fill({ color: "black" }),
                stroke: new Stroke({
                  color: "white",
                  width: 2,
                }),
              }),
              zIndex: 999,
            }),
          });
        }

        valveMarker.set("id", `${valve.id}`);
        mapRef?.addLayer(valveMarker);
      });

      // Open card modal for valve details
      mapRef!.on("click", (e) => {
        const feature = mapRef!.forEachFeatureAtPixel(e.pixel, (feature) => {
          return feature;
        });
        setIsModalOpen(false);
        if (!feature) {
          return;
        }

        const props = feature.getProperties() as MapValveData | undefined;
        setSelectedValve(props);
        console.log(feature.getProperties());
        setIsModalOpen(true);
      });
    }
  }, [isSuccess, data]);

  if (!map) {
    return <>Empty Map</>;
  }

  return (
    <>
      <BaseLayerPicker />

      <ValveCardDetails open={isModalOpen} onOpenChange={setIsModalOpen} featureData={selectedValve} />

      <div tabIndex={-1} id="mainMap" className="h-full w-full" />
    </>
  );
};

export default MapComponent;
