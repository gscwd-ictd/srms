"use client";

import React, { useEffect, useState, type FunctionComponent } from "react";
import { FeatureManager } from "@srms/lib/mapstudio/featureManager";
import VectorSource from "ol/source/Vector";
import VectorLayer from "ol/layer/Vector";
import { useAdminMonitMap } from "./contexts/useAdminMonitMapContext";
import { isEmpty } from "@srms/utils/isEmpty";
import { AccordionContent, AccordionTrigger } from "@srms/components/ui/Accordion";
import { Cpu } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { LoggerDetails } from "@srms/lib/pms/types";
import axios from "axios";
import { Spinner } from "@srms/components/ui-custom/Spinner";
import LoggerMarker from "../../../../public/images/logger.svg";
import { IconStyles, LabelStyles } from "@srms/server/types";
import { createIconStyles } from "./utils/createIconStyles";
import { Point } from "ol/geom";
import XilogDetailsCard from "./XilogDetailsCard";
import { useCardStore } from "@srms/components/stores/useCardStore";
import { createLabelStyles } from "./utils/createLabelStyles";

const featureManager = new FeatureManager();

const XilogLoggerToggleList: FunctionComponent = ({}) => {
  const adminMonitMap = useAdminMonitMap();

  const { setLayerToggleCardOpen, xilogDetailsCardOpen, setXilogDetailsCardOpen } = useCardStore();

  // Open modal for viewing logger details
  const [selectedLogger, setSelectedLogger] = useState<LoggerDetails>();

  const { data: xilogLoggers, isLoading } = useQuery({
    queryKey: ["get-all-xilog-loggers"],
    refetchOnReconnect: false,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    queryFn: async () => {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_APP_URL}/api/v1/layers/xilog-iot-loggers`,
        {},
      );

      return data;
    },
    throwOnError: true,
  });

  // Update openlayers. Visibility status of selected layer.
  const setLayerVisibility = (isChecked: boolean) => {
    if (isChecked) {
      adminMonitMap.mapManager.getLayerManager().getLayer("xilog-loggers")?.setVisible(true);
    } else {
      adminMonitMap.mapManager.getLayerManager().getLayer("xilog-loggers")?.setVisible(false);
    }
  };

  useEffect(() => {
    if (!adminMonitMap.mapManager) return;

    if (!isEmpty(xilogLoggers)) {
      const vectorSource = new VectorSource();

      const vectorLayer = new VectorLayer();

      // adminMonitMap.loggers
      xilogLoggers.forEach((logger: LoggerDetails) => {
        if (!isEmpty(logger.location)) {
          const loggerProperties = {
            serial: logger.serial,
            name: logger.name,
            channels: logger.channels,
            source: "Xilog Logger",
          };

          const feature = featureManager.createFeature(
            new Point([logger.location?.longitude, logger.location?.latitude]),
            loggerProperties,
          );
          vectorSource.addFeature(feature);

          const loggerStyles = {
            src: LoggerMarker.src!,
            anchor: [0.5, 1],
            scale: 0.16,
            zIndex: 400,
          };
          const featureStyle = createIconStyles(loggerStyles as IconStyles);

          const labelStyles = {
            font: "13px Calibri,sans-serif",
            overflow: true,
            fillColor: "#000",
            strokeColor: "#fff",
            width: 3,
            offsetY: 12,
            text: `${logger.serial}`,
          };
          const featureStyle2 = createLabelStyles(labelStyles as LabelStyles);

          feature.setStyle([featureStyle.iconStyle, featureStyle2.labelStyle]);
        }
      });

      vectorLayer.setSource(vectorSource);

      vectorLayer.setVisible(true); // set default visibility

      vectorLayer.setZIndex(998);

      vectorLayer.setProperties({ id: "xilog-loggers" });

      adminMonitMap.mapManager.getLayerManager().addLayer("xilog-loggers", vectorLayer);

      // Open card modal for valve details
      adminMonitMap.mapManager.getMap().on("click", (e) => {
        setXilogDetailsCardOpen(false);

        const feature = adminMonitMap.mapManager.getMap().forEachFeatureAtPixel(e.pixel, (feature, layer) => {
          if (layer.get("id") === "xilog-loggers") {
            setXilogDetailsCardOpen(true);
            setLayerToggleCardOpen(false);

            return feature;
          }
        });

        if (!feature) {
          return;
        }

        const props = feature.getProperties() as LoggerDetails | undefined;
        setSelectedLogger(props);
      });

      return () => {
        adminMonitMap.mapManager.getLayerManager().removeLayer("xilog-loggers");
      };
    }
  }, [adminMonitMap.mapManager, xilogLoggers]);

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
              defaultChecked={true}
            />
            <Cpu className="mr-2 block w-5 cursor-pointer text-white opacity-30 peer-checked:hidden" />
            <Cpu className="mr-2 hidden w-5 cursor-pointer text-white peer-checked:block" />
          </label>
          <AccordionTrigger className="items-center">
            <p className="text-md mr-2 font-bold text-white">Xilog Data Logger</p>
          </AccordionTrigger>
        </div>

        {isLoading ? (
          <div className="spinner">
            <Spinner size={"sm"} className="mt-4" />
          </div>
        ) : null}
      </div>

      <AccordionContent className="flex flex-col gap-4 text-balance">
        <ul className="mx-11 text-white">
          <li>
            <div className="flex h-6">
              <div className="mt-0.5 mr-2 h-4 w-4 rounded-3xl bg-blue-600"></div>
              Data Logger
            </div>
          </li>
        </ul>
      </AccordionContent>

      <XilogDetailsCard open={xilogDetailsCardOpen} featureData={selectedLogger} />
    </React.Fragment>
  );
};

export default XilogLoggerToggleList;
