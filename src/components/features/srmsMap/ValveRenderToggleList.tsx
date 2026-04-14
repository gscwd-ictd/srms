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
import { Hexagon } from "lucide-react";
import { AccordionContent, AccordionTrigger } from "@srms/components/ui/Accordion";
import ValveDetailsCard from "./ValveDetailsCard";
import { useCardStore } from "@srms/components/stores/useCardStore";

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

  const {
    valveDetailsCardOpen,
    setValveDetailsCardOpen,
    setVehicleDetailsCardOpen,
    setConsumerDetailsCardOpen,
    setConsumersTableCardOpen,
  } = useCardStore();

  // Open modal for viewing valve details
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
        setValveDetailsCardOpen(false);

        if (!feature) {
          return;
        }

        const props = feature.getProperties() as MapValveData;
        setSelectedValve(props);
        if (props.diameter) {
          setConsumerDetailsCardOpen(false); //close water meter details card if open
          setConsumersTableCardOpen(false); //close water meter table card if open
          setVehicleDetailsCardOpen(false); //close vehicle details card if open
          //if valve diameter exists, open details card
          setValveDetailsCardOpen(true);
        }
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

            <Hexagon className="primary-text-color mr-2 block w-5 cursor-pointer opacity-30 peer-checked:hidden" />
            <Hexagon className="primary-text-color mr-2 hidden w-5 cursor-pointer peer-checked:block" />
          </label>
          <AccordionTrigger className={`w-50 items-center`}>
            <p className="text-md primary-text-color mr-2 font-bold">Valves</p>
          </AccordionTrigger>
        </div>
      </div>
      <AccordionContent className="flex flex-col gap-4 text-balance">
        {isLoading ? (
          <div className="spinner">
            <Spinner size={"sm"} className="mt-2" />
          </div>
        ) : (
          <ul className="primary-text-color mx-12">
            <li>
              <div className="flex h-6">
                <div className="mr-3 h-5 w-2 rotate-90 transform bg-blue-600"></div>
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
        )}
      </AccordionContent>
      <ValveDetailsCard
        open={valveDetailsCardOpen}
        onOpenChange={setValveDetailsCardOpen}
        featureData={selectedValve}
      />
    </React.Fragment>
  );
};
