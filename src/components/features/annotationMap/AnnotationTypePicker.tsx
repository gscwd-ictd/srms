"use client";

import { FunctionComponent, useState } from "react";
// import { isEmpty } from "@srms/utils/isEmpty";
// import LayerGroup from "ol/layer/Group";
// import BaseLayer from "ol/layer/Base";
import { Button } from "@srms/components/ui/Button";
import { motion } from "framer-motion";
import { cn } from "@srms/utils/shadcn";
import { Hexagon, MousePointer2, PenLine, Pin, Plus, Shapes } from "lucide-react";
import { AnnotationTypeOptions } from "@srms/components/enums/annotationTypeOptions.enum";
import { useAnnotationStore } from "@srms/components/stores/useAnnotationStore";
/* 
    Component for switching between Base Layers
 */

const AnnotationTypePicker: FunctionComponent = ({}) => {
  const { selectedAnnotationType, setSelectedAnnotationType, setAddAnnotationModalOpen } =
    useAnnotationStore();

  const [layerToggleCardOpen, setLayerToggleCardOpen] = useState<boolean>(false);
  const [initialNavAnimation, setInitialNavAnimation] = useState<boolean>(true);

  // Open modal for layers card
  const toggleModal = () => {
    setLayerToggleCardOpen(!layerToggleCardOpen);
    setInitialNavAnimation(false);
  };

  return (
    <div
      className={cn(
        "absolute left-[0px] z-20 flex items-center justify-start backdrop-blur",
        layerToggleCardOpen ? "" : "",
      )}
    >
      <Button
        className={cn(
          "z-50 h-18 w-[72px] rounded-none transition-all transition-discrete duration-100",
          layerToggleCardOpen ? "ui-color-button shadow-none" : "ui-color-button rounded-br-lg",
        )}
        onClick={() => toggleModal()}
      >
        <Shapes className="size-8 text-white" />
      </Button>
      <motion.div
        transition={{ duration: 0.8, ease: "easeOut" }} // Animation properties
        className={cn(
          "ui-color-button-no-hover flex h-18 w-full items-center justify-evenly rounded-br-lg",
          layerToggleCardOpen
            ? "tilemap-intro-animated"
            : initialNavAnimation
              ? "w-0"
              : "tilemap-outro-animated",
        )} // Add your CSS classes for styling
      >
        {layerToggleCardOpen ? (
          <>
            {Object.values(AnnotationTypeOptions).map((annotationType) => (
              <label key={annotationType} className="cursor-pointer" htmlFor="field-osm">
                {/* Square with image */}
                <div
                  className={cn(
                    layerToggleCardOpen ? "basemap-intro-animated" : "basemap-outro-animated",
                    "flex items-center justify-center overflow-hidden rounded-lg shadow-xs transition transition-all peer-checked:border-blue-500 hover:shadow-lg",
                    !selectedAnnotationType && annotationType === AnnotationTypeOptions.POINT
                      ? "h-11 w-11 shadow-lg transition-all"
                      : selectedAnnotationType === annotationType
                        ? "h-11 w-11 border border-blue-200 shadow-lg transition-all" // selected (bigger)
                        : "h-10 w-10 border border-blue-400 shadow-xs transition-all hover:h-11 hover:w-11", // normal
                    "overflow-hidden rounded-lg transition-all peer-checked:border-blue-500",
                  )}
                  onClick={() => setSelectedAnnotationType(annotationType)}
                >
                  {annotationType === AnnotationTypeOptions.POINT ? (
                    <Pin className="size-8 w-full object-cover text-gray-700 text-white select-none" />
                  ) : annotationType === AnnotationTypeOptions.LINE_STRING ? (
                    <PenLine className="size-8 w-full object-cover text-gray-700 text-white select-none" />
                  ) : annotationType === AnnotationTypeOptions.POLYGON ? (
                    <Hexagon className="size-8 w-full object-cover text-gray-700 text-white select-none" />
                  ) : (
                    <MousePointer2 className="size-8 w-full object-cover text-gray-700 text-white select-none" />
                  )}
                </div>
              </label>
            ))}
            <div
              className={cn(
                layerToggleCardOpen ? "basemap-intro-animated" : "basemap-outro-animated",
                "flex items-center justify-center overflow-hidden rounded-lg shadow-xs transition transition-all peer-checked:border-blue-500 hover:shadow-lg",

                "h-10 w-10 border border-blue-400 shadow-xs transition-all hover:h-11 hover:w-11", // normal
                "overflow-hidden rounded-lg transition-all peer-checked:border-blue-500",
              )}
              onClick={() => setAddAnnotationModalOpen(true)}
            >
              <Plus className="size-8 w-full object-cover text-gray-700 text-white select-none" />
            </div>
          </>
        ) : (
          <></>
        )}
      </motion.div>
    </div>
  );
};

export default AnnotationTypePicker;
