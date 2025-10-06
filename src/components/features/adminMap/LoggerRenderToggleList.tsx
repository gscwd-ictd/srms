"use client";

import React, { useEffect, type FunctionComponent } from "react";
import { FeatureManager } from "@srms/lib/mapstudio/featureManager";
import VectorSource from "ol/source/Vector";
import VectorLayer from "ol/layer/Vector";
import { useAdminMonitMap } from "./contexts/useAdminMonitMapContext";
import { PipeSize } from "@srms/components/enums/pipeSize.enum";
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

const featureManager = new FeatureManager();

const LoggerRenderToggleList: FunctionComponent = ({}) => {
  const adminMonitMap = useAdminMonitMap();

  const { data: loggers, isLoading } = useQuery({
    queryKey: ["get-all-loggers"],
    refetchOnReconnect: false,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    queryFn: async () => {
      const { data } = await axios.get(`${process.env.NEXT_PUBLIC_APP_URL}/api/v1/layers/iot-loggers`);

      return data;
    },
    throwOnError: true,
  });

  // Update openlayers. Visibility status of selected layer.
  const setLayerVisibility = (isChecked: boolean) => {
    if (isChecked) {
      adminMonitMap.mapManager.getLayerManager().getLayer("logger")?.setVisible(true);
    } else {
      adminMonitMap.mapManager.getLayerManager().getLayer("logger")?.setVisible(false);
    }
  };

  useEffect(() => {
    if (!adminMonitMap.mapManager) return;

    if (!isEmpty(loggers)) {
      const vectorSource = new VectorSource();

      const vectorLayer = new VectorLayer();

      // adminMonitMap.pipelines
      loggers.forEach((logger: LoggerDetails) => {
        if (!isEmpty(logger.location)) {
          const loggerProperties = {
            serial: logger.serial,
            name: logger.name,
          };

          const feature = featureManager.createFeature(new Point(logger.location), loggerProperties);
          vectorSource.addFeature(feature);

          const loggerStyles = {
            src: LoggerMarker.src!,
            anchor: [0.5, 1],
            scale: 0.55,
          };
          const featureStyle = createIconStyles(loggerStyles as IconStyles);
          feature.setStyle(featureStyle.iconStyle);
        }
      });

      vectorLayer.setSource(vectorSource);

      vectorLayer.setVisible(false);

      vectorLayer.setZIndex(999);

      vectorLayer.setProperties({ id: "pipelines" });

      adminMonitMap.mapManager.getLayerManager().addLayer("pipelines", vectorLayer);

      return () => {
        adminMonitMap.mapManager.getLayerManager().removeLayer("pipelines");
      };
    }
  }, [adminMonitMap.mapManager, loggers]); //adminMonitMap.pipelines.features

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
            <p className="text-md font-bold text-black">Pipeline</p>
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
              <div className="mr-3 h-5 w-2 rotate-90 transform bg-[#745945]"></div>
              {PipeSize.SIZE_500MM}
            </div>
          </li>
          <li>
            <div className="flex h-6">
              <div className="mr-3 h-5 w-2 rotate-90 transform bg-[#F787E1]"></div>
              {PipeSize.SIZE_400MM}
            </div>
          </li>
          <li>
            <div className="flex h-6">
              <div className="mr-3 h-5 w-2 rotate-90 transform bg-[#FAE334]"></div>
              {PipeSize.SIZE_300MM}
            </div>
          </li>
          <li>
            <div className="flex h-6">
              <div className="mr-3 h-5 w-2 rotate-90 transform bg-[#3EFB29]"></div>
              {PipeSize.SIZE_250MM}
            </div>
          </li>
          <li>
            <div className="flex h-6">
              <div className="mr-3 h-5 w-2 rotate-90 transform bg-[#0768F1]"></div>
              {PipeSize.SIZE_200MM}
            </div>
          </li>
          <li>
            <div className="flex h-6">
              <div className="mr-3 h-5 w-2 rotate-90 transform bg-[#AD0EF6]"></div>
              {PipeSize.SIZE_150MM}
            </div>
          </li>
          <li>
            <div className="flex h-6">
              <div className="mr-3 h-5 w-2 rotate-90 transform bg-[#2DF0FE]"></div>
              {PipeSize.SIZE_100MM}
            </div>
          </li>
          <li>
            <div className="flex h-6">
              <div className="mr-3 h-5 w-2 rotate-90 transform bg-[#EF9E07]"></div>
              {PipeSize.SIZE_75MM}
            </div>
          </li>
          <li>
            <div className="flex h-6">
              <div className="mr-3 h-5 w-2 rotate-90 transform bg-[#F01E07]"></div>
              {PipeSize.SIZE_50MM}
            </div>
          </li>
          <li>
            <div className="flex h-6">
              <div className="mr-3 h-5 w-2 rotate-90 transform bg-[#F01E07]"></div>
              {PipeSize.SIZE_64MM_HDPE}
            </div>
          </li>
          <li>
            <div className="flex h-6">
              <div className="mr-3 h-5 w-2 rotate-90 transform bg-[#F01E07]"></div>
              {PipeSize.SIZE_50MM_HDPE}
            </div>
          </li>
          <li>
            <div className="flex h-6">
              <div className="mr-3 h-5 w-2 rotate-90 transform bg-[#070606]"></div>
              {PipeSize.SIZE_32MM_HDPE}
            </div>
          </li>
        </ul>
      </AccordionContent>
    </React.Fragment>
  );
};

export default LoggerRenderToggleList;
