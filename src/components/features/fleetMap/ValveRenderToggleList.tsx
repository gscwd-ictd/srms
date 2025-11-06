"use client";

import { useEffect, useState, type FunctionComponent } from "react";
import { FeatureManager } from "@srms/lib/mapstudio/featureManager";
import { IconStyles } from "@srms/server/types";
import { Point } from "ol/geom";
import VectorSource from "ol/source/Vector";
import VectorLayer from "ol/layer/Vector";
import { useFleetMap } from "./contexts/useFleetMapContext";
import { ValveStatus } from "@srms/components/enums/valveTypes.enum";
import { createIconStyles } from "./utils/createIconStyles";
import ValveOpen from "../../../../public/images/valve_open.svg";
import ValveClose from "../../../../public/images/valve_close.svg";
import ValveThrottle from "../../../../public/images/valve_throttle.svg";
import { MapValveData, ValveData } from "@srms/lib/pms/types";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { isEmpty } from "@srms/utils/isEmpty";
import React from "react";
import { Spinner } from "@srms/components/ui-custom/Spinner";
import { Eye, EyeOff } from "lucide-react";
import { AccordionContent, AccordionTrigger } from "@srms/components/ui/Accordion";
import ValveDetailsCard from "./ValveDetailsCard";

const featureManager = new FeatureManager();

export const ValveRenderToggleList: FunctionComponent = () => {
  const fleetMap = useFleetMap();

  const { data: valves, isLoading } = useQuery({
    queryKey: ["get-all-valves"],
    refetchOnReconnect: false,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    queryFn: async () => {
      const { data } = await axios.get(`${process.env.NEXT_PUBLIC_APP_URL}/api/v1/layers/valves`, {});

      return data;
    },
    throwOnError: true,
  });

  // Open modal for viewing vehicle details
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedValve, setSelectedValve] = useState<MapValveData>();

  // Update openlayers. Visibility status of selected layer.
  const setLayerVisibility = (isChecked: boolean) => {
    if (isChecked) {
      fleetMap.mapManager.getLayerManager().getLayer("valves")?.setVisible(true);
    } else {
      fleetMap.mapManager.getLayerManager().getLayer("valves")?.setVisible(false);
    }
  };

  useEffect(() => {
    if (!fleetMap.mapManager) return;

    if (!isEmpty(valves)) {
      const vectorSource = new VectorSource();

      const vectorLayer = new VectorLayer();

      valves.features.forEach((valve: ValveData) => {
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

      vectorLayer.setVisible(false);

      vectorLayer.setZIndex(999);

      vectorLayer.setProperties({ id: "valves" });

      fleetMap.mapManager.getLayerManager().addLayer("valves", vectorLayer);

      // Open card modal for valve details
      fleetMap.mapManager.getMap().on("click", (e) => {
        const feature = fleetMap.mapManager.getMap().forEachFeatureAtPixel(e.pixel, (feature) => {
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

      return () => {
        fleetMap.mapManager.getLayerManager().removeLayer("valves");
      };
    }
  }, [fleetMap.mapManager, valves]);

  return (
    <React.Fragment>
      <div className="flex">
        <div className="flex cursor-pointer items-center space-x-2 p-2">
          <label>
            <input
              type="checkbox"
              className="peer hidden"
              onChange={(event) => {
                setLayerVisibility(event.target.checked);
              }}
              defaultChecked={false}
            />
            <EyeOff className="mr-2 block w-5 text-stone-800 peer-checked:hidden" />
            <Eye className="mr-2 hidden w-5 text-stone-800 peer-checked:block" />
          </label>

          <AccordionTrigger className="items-center">
            <p className="text-md font-bold text-black">Valves</p>
          </AccordionTrigger>
        </div>

        {isLoading ? (
          <div className="spinner">
            <Spinner size={"sm"} className="mt-4" />
          </div>
        ) : null}
      </div>
      <AccordionContent className="flex flex-col gap-4 text-balance">
        <ul className="mx-12 text-stone-900">
          <li>
            <div className="flex h-6">
              <div className="mr-3 h-5 w-2 rotate-90 transform bg-blue-500"></div>
              {ValveStatus.OPEN}
            </div>
          </li>

          <li>
            <div className="flex h-6">
              <div className="mr-3 h-5 w-2 rotate-90 transform bg-red-500"></div>
              {ValveStatus.CLOSE}
            </div>
          </li>
        </ul>
      </AccordionContent>
      <ValveDetailsCard open={isModalOpen} onOpenChange={setIsModalOpen} featureData={selectedValve} />;
    </React.Fragment>
  );
};
