"use client";

import React, { useEffect, useState, type FunctionComponent } from "react";
import { AccordionContent, AccordionTrigger } from "@srms/components/ui/Accordion";
import { annotationSources } from "./AnnotationsLayer";
import { Pin } from "lucide-react";
import { useAnnotationsMap } from "./contexts/useAnnotationsMapContext";
import { useAnnotationStore } from "@srms/components/stores/useAnnotationStore";
import { AnnotationTypeOptions } from "@srms/components/enums/annotationTypeOptions.enum";
import { pointLayer } from "./AnnotationsLayer";

const PointRenderToggleList: FunctionComponent = ({}) => {
  const [pointFeatures, setPointFeatures] = useState(annotationSources["Point"].getFeatures());
  const annotationsMap = useAnnotationsMap();
  const { selectedFeature, setSelectedAnnotationType } = useAnnotationStore();

  // Update openlayers. Visibility status of selected layer.
  const setLayerVisibility = (isChecked: boolean) => {
    pointLayer.setVisible(isChecked);
  };

  useEffect(() => {
    const pointSource = annotationSources["Point"];

    const updateFeatures = () => {
      setPointFeatures([...pointSource.getFeatures()]);
    };

    pointSource.on("addfeature", updateFeatures);
    pointSource.on("removefeature", updateFeatures);

    updateFeatures();

    return () => {
      pointSource.un("addfeature", updateFeatures);
      pointSource.un("removefeature", updateFeatures);
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
              onChange={(e) => setLayerVisibility(e.target.checked)}
              defaultChecked={true}
            />
            <Pin className="primary-text-color mr-2 block w-5 cursor-pointer opacity-30 peer-checked:hidden" />
            <Pin className="primary-text-color mr-2 hidden w-5 cursor-pointer peer-checked:block" />
          </label>
          <AccordionTrigger className="w-50 items-center">
            <p className="text-md primary-text-color font-bold">Points</p>
          </AccordionTrigger>
        </div>
      </div>

      <AccordionContent className="flex flex-col gap-4 text-balance">
        <ul className="primary-text-color mx-12">
          {pointFeatures.map((feature, index) => {
            const name = feature.get("title") || "Untitled Point";
            const isSelected = selectedFeature?.get("annotationId") === feature.get("annotationId");

            return (
              <li key={index}>
                <div
                  className={`flex h-6 cursor-pointer ${isSelected ? "font-bold text-blue-600" : ""}`}
                  onClick={() => {
                    setSelectedAnnotationType(AnnotationTypeOptions.NONE);

                    // wait until the Select interaction has been recreated
                    setTimeout(() => {
                      annotationsMap.selectAnnotation(feature);
                    }, 0);
                  }}
                >
                  {index + 1}: {name}
                </div>
              </li>
            );
          })}
        </ul>
      </AccordionContent>
    </React.Fragment>
  );
};

export default PointRenderToggleList;
