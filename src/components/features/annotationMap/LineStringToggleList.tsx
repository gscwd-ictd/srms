"use client";

import React, { useEffect, useState, type FunctionComponent } from "react";
import { AccordionContent, AccordionTrigger } from "@srms/components/ui/Accordion";
import { annotationSources } from "./AnnotationsLayer";
import { Hexagon } from "lucide-react";

// const featureManager = new FeatureManager();

const LineStringRenderToggleList: FunctionComponent = ({}) => {
  const [lineStringFeatures, setLineStringFeatures] = useState(annotationSources["LineString"].getFeatures());

  // Update openlayers. Visibility status of selected layer.
  const setLayerVisibility = (isChecked: boolean) => {
    if (isChecked) {
      // annotationsMap.mapManager.getLayerManager().getLayer("line-strings")?.setVisible(true);
    } else {
      // annotationsMap.mapManager.getLayerManager().getLayer("line-strings")?.setVisible(false);
    }
  };

  useEffect(() => {
    const lineStringSource = annotationSources["LineString"];

    const updateFeatures = () => {
      setLineStringFeatures([...lineStringSource.getFeatures()]);
    };

    lineStringSource.on("addfeature", updateFeatures);
    lineStringSource.on("removefeature", updateFeatures);

    updateFeatures();

    return () => {
      lineStringSource.un("addfeature", updateFeatures);
      lineStringSource.un("removefeature", updateFeatures);
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
            <p className="text-md primary-text-color font-bold">Line Strings</p>
          </AccordionTrigger>
        </div>
      </div>

      <AccordionContent className="flex flex-col gap-4 text-balance">
        <ul className="primary-text-color mx-12">
          {lineStringFeatures.map((feature, index) => {
            const name = feature.get("title") || "Untitled Line String";

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

export default LineStringRenderToggleList;
