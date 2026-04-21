"use client";

import { useEffect, useState, type FunctionComponent } from "react";
import { FeatureManager } from "@srms/lib/mapstudio/featureManager";
import { IconStyles } from "@srms/server/types";
import { Point } from "ol/geom";
import VectorSource from "ol/source/Vector";
import VectorLayer from "ol/layer/Vector";
import { useValvesMap } from "./contexts/useValvesMapContext";
import { ValveStatus } from "@srms/components/enums/valveTypes.enum";
import { createIconStyles } from "./utils/createIconStyles";
import ValveOpen from "../../../../public/images/valve_open.svg";
import ValveClose from "../../../../public/images/valve_close.svg";
import ValveThrottle from "../../../../public/images/valve_throttle.svg";
import { MapValveData } from "@srms/lib/pms/types";
import ValveDetailsCard from "./ValveDetailsCardDraggable";
import { Pixel } from "ol/pixel";

const featureManager = new FeatureManager();

export const ValveRenderFeatures: FunctionComponent = () => {
  const valvesMap = useValvesMap();

  // Open modal for viewing vehicle details
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedValve, setSelectedValve] = useState<MapValveData>();

  useEffect(() => {
    if (!valvesMap.mapManager) return;

    const vectorSource = new VectorSource();

    const vectorLayer = new VectorLayer();

    valvesMap.valves.features.forEach((valve) => {
      const valveProperties = {
        id: valve.id,
        diameter: valve.properties.diameter,
        brand: valve.properties.brand,
        "yr.install": valve.properties["yr.install"],
        status: valve.properties.status,
        curnt_stat: valve.properties.curnt_stat,
        type: valve.properties.type,
      };

      const feature = featureManager.createFeature(new Point(valve.geometry.coordinates), valveProperties);
      vectorSource.addFeature(feature);

      // Set icon depending of valve status
      if (valve.properties.status === ValveStatus.OPEN) {
        const valveStyles = { src: ValveOpen.src!, anchor: [0.5, 0.5], scale: 0.8 };

        const featureStyle = createIconStyles(valveStyles as IconStyles);
        feature.setStyle(featureStyle.iconStyle);
      } else if (valve.properties.status === ValveStatus.CLOSE) {
        const valveStyles = { src: ValveClose.src!, anchor: [0.5, 0.5], scale: 0.8 };

        const featureStyle = createIconStyles(valveStyles as IconStyles);
        feature.setStyle(featureStyle.iconStyle);
      } else {
        const valveStyles = { src: ValveThrottle.src!, anchor: [0.5, 0.5], scale: 0.8 };

        const featureStyle = createIconStyles(valveStyles as IconStyles);
        feature.setStyle(featureStyle.iconStyle);
      }
    });

    vectorLayer.setSource(vectorSource);

    vectorLayer.setVisible(true);

    vectorLayer.setZIndex(999);

    vectorLayer.setProperties({ id: "valves" });

    valvesMap.mapManager.getLayerManager().addLayer("valves", vectorLayer);

    // Open card modal for valve details
    valvesMap.mapManager.getMap().on("click", (e) => {
      const feature = valvesMap.mapManager.getMap().forEachFeatureAtPixel(e.pixel, (feature) => {
        return feature;
      });
      setIsModalOpen(false);
      if (!feature) {
        return;
      }

      const props = feature.getProperties() as MapValveData | undefined;
      setSelectedValve(props);

      setIsModalOpen(true);
    });

    // Change cursor to pointer when hovering over valve markers
    const map = valvesMap.mapManager.getMap();
    const pointerMoveHandler = (e: { pixel: Pixel }) => {
      const hit = map.forEachFeatureAtPixel(e.pixel, (feature, layer) => {
        const layerId = layer?.get("id");

        return layerId === "valves";
      });

      map.getTargetElement().style.cursor = hit ? "pointer" : "";
    };
    map.on("pointermove", pointerMoveHandler);

    return () => {
      valvesMap.mapManager.getLayerManager().removeLayer("valves");
      map.un("pointermove", pointerMoveHandler);
    };
  }, [valvesMap.mapManager, valvesMap.valves.features]);

  return <ValveDetailsCard open={isModalOpen} onOpenChange={setIsModalOpen} featureData={selectedValve} />;
};
