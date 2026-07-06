"use client";

import React, { useEffect, type FunctionComponent } from "react";
import { FeatureManager } from "@srms/lib/mapstudio/featureManager";
import { MultiLineString } from "ol/geom";
import VectorSource from "ol/source/Vector";
import VectorLayer from "ol/layer/Vector";
import { useGisMap } from "./contexts/useGisMapContext";
import { PipeSize } from "@srms/components/enums/pipeSize.enum";
import { createLineStringStyles } from "./utils/createLineStringStyles";
import { isEmpty } from "@srms/utils/isEmpty";
import { AccordionContent, AccordionTrigger } from "@srms/components/ui/Accordion";
import { Cog } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { PipelineData } from "@srms/lib/pms/types";
import axios from "axios";
import { Spinner } from "@srms/components/ui-custom/Spinner";

const featureManager = new FeatureManager();

const PipelineRenderToggleList: FunctionComponent = ({}) => {
  const fleetMap = useGisMap();

  const { data: pipelines, isLoading } = useQuery({
    queryKey: ["get-all-pipelines"],
    refetchOnReconnect: false,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    queryFn: async () => {
      const { data } = await axios.get(`${process.env.NEXT_PUBLIC_APP_URL}/api/v1/layers/pipelines`, {});

      return data;
    },
    throwOnError: true,
  });

  // Update openlayers. Visibility status of selected layer.
  const setLayerVisibility = (isChecked: boolean) => {
    if (isChecked) {
      fleetMap.mapManager.getLayerManager().getLayer("pipelines")?.setVisible(true);
    } else {
      fleetMap.mapManager.getLayerManager().getLayer("pipelines")?.setVisible(false);
    }
  };

  useEffect(() => {
    if (!fleetMap.mapManager) return;

    if (!isEmpty(pipelines)) {
      const vectorSource = new VectorSource();

      const vectorLayer = new VectorLayer();

      // fleetMap.pipelines
      pipelines.features.forEach((pipeline: PipelineData) => {
        if (!isEmpty(pipeline.geometry)) {
          const pipelineProperties = {
            id: pipeline.id,
            diameter: pipeline.properties.diameter,
            material: pipeline.properties.material,
          };

          const feature = featureManager.createFeature(
            new MultiLineString(pipeline.geometry.coordinates),
            pipelineProperties,
          );
          vectorSource.addFeature(feature);

          // Set icon depending of valve status
          if (pipeline.properties.diameter === PipeSize.SIZE_500MM) {
            const pipeStyles = { strokeColor: "#745945", strokeWidth: [5], lineDash: "solid" };

            const featureStyle = createLineStringStyles(pipeStyles);
            feature.setStyle(featureStyle.lineStringStyle);
          } else if (pipeline.properties.diameter === PipeSize.SIZE_400MM) {
            const pipeStyles = { strokeColor: "#F787E1", strokeWidth: [5], lineDash: "solid" };

            const featureStyle = createLineStringStyles(pipeStyles);
            feature.setStyle(featureStyle.lineStringStyle);
          } else if (pipeline.properties.diameter === PipeSize.SIZE_300MM) {
            const pipeStyles = { strokeColor: "#FAE334", strokeWidth: [4], lineDash: "solid" };

            const featureStyle = createLineStringStyles(pipeStyles);
            feature.setStyle(featureStyle.lineStringStyle);
          } else if (pipeline.properties.diameter === PipeSize.SIZE_250MM) {
            const pipeStyles = { strokeColor: "#3EFB29", strokeWidth: [4], lineDash: "solid" };

            const featureStyle = createLineStringStyles(pipeStyles);
            feature.setStyle(featureStyle.lineStringStyle);
          } else if (pipeline.properties.diameter === PipeSize.SIZE_200MM) {
            const pipeStyles = { strokeColor: "#0768F1", strokeWidth: [3], lineDash: "solid" };

            const featureStyle = createLineStringStyles(pipeStyles);
            feature.setStyle(featureStyle.lineStringStyle);
          } else if (pipeline.properties.diameter === PipeSize.SIZE_150MM) {
            const pipeStyles = { strokeColor: "#AD0EF6", strokeWidth: [3], lineDash: "solid" };

            const featureStyle = createLineStringStyles(pipeStyles);
            feature.setStyle(featureStyle.lineStringStyle);
          } else if (pipeline.properties.diameter === PipeSize.SIZE_100MM) {
            const pipeStyles = { strokeColor: "#2DF0FE", strokeWidth: [2], lineDash: "solid" };

            const featureStyle = createLineStringStyles(pipeStyles);
            feature.setStyle(featureStyle.lineStringStyle);
          } else if (pipeline.properties.diameter === PipeSize.SIZE_75MM) {
            const pipeStyles = { strokeColor: "#EF9E07", strokeWidth: [2], lineDash: "solid" };

            const featureStyle = createLineStringStyles(pipeStyles);
            feature.setStyle(featureStyle.lineStringStyle);
          } else if (pipeline.properties.diameter === PipeSize.SIZE_50MM) {
            const pipeStyles = { strokeColor: "#F01E07", strokeWidth: [2], lineDash: "solid" };

            const featureStyle = createLineStringStyles(pipeStyles);
            feature.setStyle(featureStyle.lineStringStyle);
          } else if (pipeline.properties.diameter === PipeSize.SIZE_50MM_HDPE) {
            const pipeStyles = { strokeColor: "#F01E07", strokeWidth: [1.5], lineDash: "solid" };

            const featureStyle = createLineStringStyles(pipeStyles);
            feature.setStyle(featureStyle.lineStringStyle);
          } else if (pipeline.properties.diameter === PipeSize.SIZE_64MM_HDPE) {
            const pipeStyles = { strokeColor: "#F01E07", strokeWidth: [1.5], lineDash: "solid" };

            const featureStyle = createLineStringStyles(pipeStyles);
            feature.setStyle(featureStyle.lineStringStyle);
          } else {
            const pipeStyles = { strokeColor: "#070606", strokeWidth: [1.5], lineDash: "solid" };

            const featureStyle = createLineStringStyles(pipeStyles);
            feature.setStyle(featureStyle.lineStringStyle);
          }
        }
      });

      vectorLayer.setSource(vectorSource);

      vectorLayer.setVisible(false);

      vectorLayer.setZIndex(999);

      vectorLayer.setProperties({ id: "pipelines" });

      fleetMap.mapManager.getLayerManager().addLayer("pipelines", vectorLayer);

      return () => {
        fleetMap.mapManager.getLayerManager().removeLayer("pipelines");
      };
    }
  }, [fleetMap.mapManager, pipelines]); //fleetMap.pipelines.features

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
            <Cog className="primary-text-color mr-2 block w-5 cursor-pointer opacity-30 peer-checked:hidden" />
            <Cog className="primary-text-color mr-2 hidden w-5 cursor-pointer peer-checked:block" />
          </label>
          <AccordionTrigger className="w-50 items-center">
            <p className="text-md primary-text-color font-bold">Pipeline</p>
          </AccordionTrigger>
        </div>
      </div>

      <AccordionContent className="flex flex-col gap-4 text-balance">
        {isLoading ? (
          <div className="spinner">
            <Spinner size={"sm"} className="mt-4" />
          </div>
        ) : (
          <ul className="primary-text-color mx-12">
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
        )}
      </AccordionContent>
    </React.Fragment>
  );
};

export default PipelineRenderToggleList;
