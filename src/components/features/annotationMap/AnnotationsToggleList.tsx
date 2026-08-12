"use client";

import React, { useEffect, useState, type FunctionComponent } from "react";
import { AccordionContent, AccordionTrigger } from "@srms/components/ui/Accordion";
import { annotationSources } from "./AnnotationsLayer";
import { Hexagon } from "lucide-react";

// const featureManager = new FeatureManager();

const PolygonsRenderToggleList: FunctionComponent = ({}) => {
  const [polygonFeatures, setPolygonFeatures] = useState(annotationSources["Polygon"].getFeatures());

  // Update openlayers. Visibility status of selected layer.
  const setLayerVisibility = (isChecked: boolean) => {
    if (isChecked) {
      // annotationsMap.mapManager.getLayerManager().getLayer("polygons")?.setVisible(true);
    } else {
      // annotationsMap.mapManager.getLayerManager().getLayer("polygons")?.setVisible(false);
    }
  };

  useEffect(() => {
    const polygonSource = annotationSources["Polygon"];

    const updateFeatures = () => {
      setPolygonFeatures([...polygonSource.getFeatures()]);
    };

    polygonSource.on("addfeature", updateFeatures);
    polygonSource.on("removefeature", updateFeatures);

    updateFeatures();

    return () => {
      polygonSource.un("addfeature", updateFeatures);
      polygonSource.un("removefeature", updateFeatures);
    };
  }, []);

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
          <AccordionTrigger className="w-50 items-center">
            <p className="text-md primary-text-color font-bold">Polygons</p>
          </AccordionTrigger>
        </div>
      </div>

      <AccordionContent className="flex flex-col gap-4 text-balance">
        <ul className="primary-text-color mx-12">
          {polygonFeatures.map((feature, index) => {
            const name = feature.get("name");

            return (
              <li key={index}>
                <div className="flex h-6">
                  {index + 1} - {name}
                </div>
              </li>
            );
          })}
        </ul>
      </AccordionContent>
    </React.Fragment>
  );
};

export default PolygonsRenderToggleList;
