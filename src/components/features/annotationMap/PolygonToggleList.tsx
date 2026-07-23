"use client";

import React, { useEffect, useState, type FunctionComponent } from "react";
import { AccordionContent, AccordionTrigger } from "@srms/components/ui/Accordion";
import { annotationSources } from "./AnnotationsLayer";
import { Hexagon } from "lucide-react";
import { useAnnotationStore } from "@srms/components/stores/useAnnotationStore";
import { useAnnotationsMap } from "./contexts/useAnnotationsMapContext";
import { AnnotationTypeOptions } from "@srms/components/enums/annotationTypeOptions.enum";
import { polygonLayer } from "./AnnotationsLayer";

const PolygonsRenderToggleList: FunctionComponent = ({}) => {
  const [polygonFeatures, setPolygonFeatures] = useState(annotationSources["Polygon"].getFeatures());
  const annotationsMap = useAnnotationsMap();
  const { selectedFeature, setSelectedAnnotationType } = useAnnotationStore();

  // Update openlayers. Visibility status of selected layer.
  const setLayerVisibility = (isChecked: boolean) => {
    polygonLayer.setVisible(isChecked);
  };

  useEffect(() => {
    const polygonSource = annotationSources["Polygon"];

    const updateFeatures = () => {
      setPolygonFeatures([...polygonSource.getFeatures()]);
    };
    console.log(annotationsMap.mapManager.getLayerManager().getLayer("polygons"));
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
              onChange={(e) => setLayerVisibility(e.target.checked)}
              defaultChecked={true}
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
            const name = feature.get("title") || "Untitled Polygon";
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

export default PolygonsRenderToggleList;
