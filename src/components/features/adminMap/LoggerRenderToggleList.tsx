"use client";

import React, { useEffect, useState, type FunctionComponent } from "react";
import { FeatureManager } from "@srms/lib/mapstudio/featureManager";
import VectorSource from "ol/source/Vector";
import VectorLayer from "ol/layer/Vector";
import { useAdminMonitMap } from "./contexts/useAdminMonitMapContext";
import { isEmpty } from "@srms/utils/isEmpty";
import { AccordionContent, AccordionTrigger } from "@srms/components/ui/Accordion";
import { Eye, EyeOff } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { LoggerDetails } from "@srms/lib/pms/types";
import axios from "axios";
import { Spinner } from "@srms/components/ui-custom/Spinner";
import LoggerMarker from "../../../../public/images/pressure.svg";
import { IconStyles } from "@srms/server/types";
import { createIconStyles } from "./utils/createIconStyles";
import { Point } from "ol/geom";
import LoggerCardDetails from "./LoggerCardDetails";

const featureManager = new FeatureManager();

const LoggerRenderToggleList: FunctionComponent = ({}) => {
  const adminMonitMap = useAdminMonitMap();

  // Open modal for viewing logger details
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedValve, setSelectedValve] = useState<LoggerDetails>();

  const { data: loggers, isLoading } = useQuery({
    queryKey: ["get-all-loggers"],
    refetchOnReconnect: false,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    queryFn: async () => {
      const { data } = await axios.get(`${process.env.NEXT_PUBLIC_APP_URL}/api/v1/layers/iot-loggers`, {});

      return data;
    },
    throwOnError: true,
  });

  // Update openlayers. Visibility status of selected layer.
  const setLayerVisibility = (isChecked: boolean) => {
    if (isChecked) {
      adminMonitMap.mapManager.getLayerManager().getLayer("loggers")?.setVisible(true);
    } else {
      adminMonitMap.mapManager.getLayerManager().getLayer("loggers")?.setVisible(false);
    }
  };

  useEffect(() => {
    if (!adminMonitMap.mapManager) return;

    if (!isEmpty(loggers)) {
      const vectorSource = new VectorSource();

      const vectorLayer = new VectorLayer();

      // adminMonitMap.loggers
      loggers.forEach((logger: LoggerDetails) => {
        if (!isEmpty(logger.location)) {
          const loggerProperties = {
            serial: logger.serial,
            name: logger.name,
          };

          const feature = featureManager.createFeature(
            new Point([logger.location?.longitude, logger.location?.latitude]),
            loggerProperties,
          );
          vectorSource.addFeature(feature);

          const loggerStyles = {
            src: LoggerMarker.src!,
            anchor: [0.5, 1],
            scale: 0.2,
          };
          const featureStyle = createIconStyles(loggerStyles as IconStyles);
          feature.setStyle(featureStyle.iconStyle);
        }
      });

      vectorLayer.setSource(vectorSource);

      vectorLayer.setVisible(false);

      vectorLayer.setZIndex(998);

      vectorLayer.setProperties({ id: "loggers" });

      adminMonitMap.mapManager.getLayerManager().addLayer("loggers", vectorLayer);

      // Open card modal for valve details
      adminMonitMap.mapManager.getMap().on("click", (e) => {
        const feature = adminMonitMap.mapManager.getMap().forEachFeatureAtPixel(e.pixel, (feature) => {
          return feature;
        });
        setIsModalOpen(false);

        if (!feature) {
          return;
        }

        const props = feature.getProperties() as LoggerDetails | undefined;
        setSelectedValve(props);

        setIsModalOpen(true);
      });

      return () => {
        adminMonitMap.mapManager.getLayerManager().removeLayer("loggers");
      };
    }
  }, [adminMonitMap.mapManager, loggers]);

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
            <p className="text-md font-bold text-black">Data Logger</p>
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
              <div className="mt-0.5 mr-2 h-4 w-4 rounded-3xl bg-blue-500"></div>
              Data Logger
            </div>
          </li>
        </ul>
      </AccordionContent>

      <LoggerCardDetails open={isModalOpen} onOpenChange={setIsModalOpen} featureData={selectedValve} />
    </React.Fragment>
  );
};

export default LoggerRenderToggleList;
