"use client";

import React, { useEffect, useState, type FunctionComponent } from "react";
import { FeatureManager } from "@srms/lib/mapstudio/featureManager";
import VectorSource from "ol/source/Vector";
import VectorLayer from "ol/layer/Vector";
import { useAdminMonitMap } from "./contexts/useAdminMonitMapContext";
import { isEmpty } from "@srms/utils/isEmpty";
import { AccordionContent, AccordionTrigger } from "@srms/components/ui/Accordion";
import { Cpu } from "lucide-react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { MultilogLogger } from "@srms/lib/pms/types";
import axios, { AxiosError } from "axios";
import { Spinner } from "@srms/components/ui-custom/Spinner";
import LoggerMarker from "../../../../public/images/logger.svg";
import { IconStyles, LabelStyles } from "@srms/server/types";
import { createIconStyles } from "./utils/createIconStyles";
import { Point } from "ol/geom";
import MultilogDetailsCard from "./MultilogDetailsCard";
import { useCardStore } from "@srms/components/stores/useCardStore";
import { createLabelStyles } from "./utils/createLabelStyles";

const featureManager = new FeatureManager();

const MultilogLoggerToggleList: FunctionComponent = ({}) => {
  const adminMonitMap = useAdminMonitMap();

  const { setLayerToggleCardOpen, multilogDetailsCardOpen, setMultilogDetailsCardOpen } = useCardStore();

  // Open modal for viewing logger details
  const [selectedLogger, setSelectedLogger] = useState<MultilogLogger>();

  const { mutateAsync: latestPressureLogMutation } = useMutation({
    mutationKey: ["latest-pressure-log-map"],
    mutationFn: async (serialNumber: string) => {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_APP_URL}/api/v1/multilog-iot-loggers/entry/latest/${serialNumber}`,
        {},
      );

      if (response.data[0]?.channels !== undefined && response.data[0]?.channels?.length > 0) {
        const entry = response.data[0]?.channels.find(
          (channel: { measurement: { name: string } }) => channel.measurement.name === "Pressure",
        );

        return entry.lastValue;
      } else {
        return "0.0";
      }
      // return response.data;
    },
    // onSuccess: async (data) => {
    //   console.log(data);
    // },
    onError: (error: AxiosError<{ message: string }>) => {
      console.log(error);
    },
  });

  const { data: multilogLoggers, isLoading } = useQuery({
    queryKey: ["get-all-multilog-loggers"],
    refetchOnReconnect: false,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    queryFn: async () => {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_APP_URL}/api/v1/layers/multilog-iot-loggers`,
        {},
      );

      return data;
    },
    throwOnError: true,
  });

  // Update openlayers. Visibility status of selected layer.
  const setLayerVisibility = (isChecked: boolean) => {
    if (isChecked) {
      adminMonitMap.mapManager.getLayerManager().getLayer("multilog-loggers")?.setVisible(true);
    } else {
      adminMonitMap.mapManager.getLayerManager().getLayer("multilog-loggers")?.setVisible(false);
    }
  };

  useEffect(() => {
    if (!adminMonitMap.mapManager) return;

    if (!isEmpty(multilogLoggers)) {
      const vectorSource = new VectorSource();

      const vectorLayer = new VectorLayer();

      // adminMonitMap.loggers
      multilogLoggers.forEach((logger: MultilogLogger) => {
        if (!isEmpty(logger.latitude) && !isEmpty(logger.longitude)) {
          const loggerProperties = {
            loggerid: logger.loggerid,
            serialNumber: logger.serialNumber,
            siteName: logger.siteName,
            channels: logger.channels,
            source: "Multilog Logger",
          };

          const feature = featureManager.createFeature(
            new Point([parseFloat(logger.longitude), parseFloat(logger.latitude)]),
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

          const pressureData = latestPressureLogMutation(logger.serialNumber);

          // const {pressureData} = latestPressureLogMutation(logger.serialNumber).then((data) => {
          //   console.log(data);
          // });

          const labelStyles = {
            font: "13px Calibri,sans-serif",
            overflow: true,
            fillColor: "#000",
            strokeColor: "#fff",
            width: 3,
            offsetY: 12,
            // text: `${logger.serialNumber}`,
            text: `${pressureData}`,
          };
          const featureStyle2 = createLabelStyles(labelStyles as LabelStyles);

          feature.setStyle([featureStyle.iconStyle, featureStyle2.labelStyle]);
        }
      });

      vectorLayer.setSource(vectorSource);

      vectorLayer.setVisible(true); // set default visibility

      vectorLayer.setZIndex(998);

      vectorLayer.setProperties({ id: "multilog-loggers" });

      adminMonitMap.mapManager.getLayerManager().addLayer("multilog-loggers", vectorLayer);

      // Open card modal for valve details
      adminMonitMap.mapManager.getMap().on("click", (e) => {
        setMultilogDetailsCardOpen(false);

        const feature = adminMonitMap.mapManager.getMap().forEachFeatureAtPixel(e.pixel, (feature, layer) => {
          if (layer.get("id") === "multilog-loggers") {
            setMultilogDetailsCardOpen(true);
            setLayerToggleCardOpen(false);
          }
          return feature;
        });

        if (!feature) {
          return;
        }

        const props = feature.getProperties() as MultilogLogger | undefined;
        setSelectedLogger(props);
      });

      return () => {
        adminMonitMap.mapManager.getLayerManager().removeLayer("multilog-loggers");
      };
    }
  }, [adminMonitMap.mapManager, multilogLoggers]);

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

            <Cpu className="primary-text-color mr-2 block w-5 cursor-pointer opacity-30 peer-checked:hidden" />
            <Cpu className="primary-text-color mr-2 hidden w-5 cursor-pointer peer-checked:block" />
          </label>
          <AccordionTrigger className="items-center">
            <p className="text-md primary-text-color font-bold">Multilog Data Logger</p>
          </AccordionTrigger>
        </div>

        {isLoading ? (
          <div className="spinner">
            <Spinner size={"sm"} className="mt-4" />
          </div>
        ) : null}
      </div>

      <AccordionContent className="flex flex-col gap-4 text-balance">
        <ul className="primary-text-color mx-12">
          <li>
            <div className="flex h-6">
              <div className="mt-0.5 mr-2 h-4 w-4 rounded-3xl bg-blue-500"></div>
              Data Logger
            </div>
          </li>
        </ul>
      </AccordionContent>

      <MultilogDetailsCard open={multilogDetailsCardOpen} featureData={selectedLogger} />
    </React.Fragment>
  );
};

export default MultilogLoggerToggleList;
