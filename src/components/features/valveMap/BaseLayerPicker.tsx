// "use client";

// import { BaseLayerOptions } from "@srms/components/enums";
// import { FunctionComponent, useEffect, useState } from "react";
// import { useValvesMap } from "./contexts/useValvesMapContext";
// import { BaseMapLayerGroup } from "./BaseMapLayerGroup";
// import { isEmpty } from "@srms/utils/isEmpty";
// import LayerGroup from "ol/layer/Group";
// import BaseLayer from "ol/layer/Base";

// /*
//     Component for switching between Base Layers
//  */

// const BaseLayerPicker: FunctionComponent = ({}) => {
//   const valvesMap = useValvesMap();
//   const [baseMap, setBaseMap] = useState<string>();

//   useEffect(() => {
//     if (!isEmpty(baseMap)) {
//       const mapBaseTileLayers = valvesMap.mapManager.getMap().getLayers().getArray();

//       mapBaseTileLayers?.map((layer: BaseLayer) => {
//         if (layer instanceof LayerGroup) {
//           const groupLayers = layer.getLayers().getArray();

//           groupLayers.map((groupLayer: BaseLayer) => {
//             if (groupLayer.getClassName() === baseMap) {
//               groupLayer.setVisible(true);
//             } else {
//               groupLayer.setVisible(false);
//             }
//           });
//         }
//       });
//     }
//   }, [valvesMap.mapManager, baseMap]);

//   return (
//     <div className="base-layers absolute bottom-[10px] left-[10px] z-20 rounded-lg bg-white p-3">
//       <p className="text-md pb-2 font-bold text-black">Base Layers</p>

//       {BaseMapLayerGroup.getLayers()
//         .getArray()
//         .map((baseMapLayer, index) => (
//           <label htmlFor="field-osm" className="mr-2 text-sm text-black" key={index}>
//             <input
//               name="baseMap"
//               type="radio"
//               value={baseMapLayer.getClassName()}
//               className="mr-1"
//               onChange={() => setBaseMap(baseMapLayer.getClassName())}
//               defaultChecked={baseMapLayer.getClassName() === BaseLayerOptions.OSM}
//             />
//             {baseMapLayer.getProperties()["title"]}
//           </label>
//         ))}
//     </div>
//   );
// };

// export default BaseLayerPicker;

"use client";

import { BaseLayerOptions } from "@srms/components/enums";
import { FunctionComponent, useEffect, useState } from "react";
import { useValvesMap } from "./contexts/useValvesMapContext";
import { BaseMapLayerGroup } from "./BaseMapLayerGroup";
import { isEmpty } from "@srms/utils/isEmpty";
import LayerGroup from "ol/layer/Group";
import BaseLayer from "ol/layer/Base";
import { Button } from "@srms/components/ui/Button";
import { motion } from "framer-motion";
import { cn } from "@srms/utils/shadcn";
import { Map } from "lucide-react";
import Image from "next/image";
/* 
    Component for switching between Base Layers
 */

const BaseLayerPicker: FunctionComponent = ({}) => {
  const valvesMap = useValvesMap();
  const [baseMap, setBaseMap] = useState<string>();

  useEffect(() => {
    if (!isEmpty(baseMap)) {
      const mapBaseTileLayers = valvesMap.mapManager.getMap().getLayers().getArray();

      mapBaseTileLayers?.map((layer: BaseLayer) => {
        if (layer instanceof LayerGroup) {
          const groupLayers = layer.getLayers().getArray();

          groupLayers.map((groupLayer: BaseLayer) => {
            if (groupLayer.getClassName() === baseMap) {
              groupLayer.setVisible(true);
            } else {
              groupLayer.setVisible(false);
            }
          });
        }
      });
    }
  }, [valvesMap.mapManager, baseMap]);

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
        "absolute right-[0px] z-20 flex items-center justify-end backdrop-blur",
        layerToggleCardOpen ? "" : "",
      )}
    >
      <motion.div
        transition={{ duration: 0.8, ease: "easeOut" }} // Animation properties
        className={cn(
          "ui-color-base flex h-18 w-full items-center justify-evenly rounded-bl-lg",
          layerToggleCardOpen
            ? "tilemap-intro-animated"
            : initialNavAnimation
              ? "w-0"
              : "tilemap-outro-animated",
        )} // Add your CSS classes for styling
      >
        {layerToggleCardOpen ? (
          <>
            {BaseMapLayerGroup.getLayers()
              .getArray()
              .map((baseMapLayer, index) => (
                <label key={baseMapLayer.getClassName()} className="cursor-pointer" htmlFor="field-osm">
                  {/* Square with image */}
                  <div
                    className={cn(
                      layerToggleCardOpen ? "basemap-intro-animated" : "basemap-outro-animated",
                      "overflow-hidden rounded-lg shadow-xs transition transition-all peer-checked:border-blue-500 hover:shadow-lg",
                      !baseMap && index == 0
                        ? "h-11 w-11 shadow-lg"
                        : baseMap === baseMapLayer.getClassName()
                          ? "h-11 w-11 shadow-lg" // selected (bigger)
                          : "h-10 w-10 shadow-xs hover:h-11 hover:w-11", // normal
                      "overflow-hidden rounded-lg transition-all peer-checked:border-blue-500",
                    )}
                    onClick={() => setBaseMap(baseMapLayer.getClassName())}
                  >
                    <Image
                      src={
                        baseMapLayer.getClassName() === BaseLayerOptions.POSITRON
                          ? "/images/positron.jpg"
                          : baseMapLayer.getClassName() === BaseLayerOptions.GOOGLE_MAP_ROAD
                            ? "/images/gmroad.jpg"
                            : baseMapLayer.getClassName() === BaseLayerOptions.GOOGLE_MAP_SATELLITE
                              ? "/images/gmsatellite.jpg"
                              : baseMapLayer.getClassName() === BaseLayerOptions.GOOGLE_MAP_TERRAIN
                                ? "/images/gmterrain.jpg"
                                : "/images/positron.jpg"
                      }
                      alt="preview"
                      height={100}
                      width={100}
                      priority
                      className="w-full object-cover select-none"
                    />
                  </div>
                </label>
              ))}
          </>
        ) : (
          <></>
        )}
      </motion.div>
      <Button
        className={cn(
          "z-50 h-18 w-[72px] rounded-none transition-all transition-discrete duration-100",
          layerToggleCardOpen ? "ui-color-button shadow-none" : "ui-color-button rounded-bl-lg",
        )}
        onClick={() => toggleModal()}
      >
        <Map className="size-8 text-white" />
      </Button>
    </div>
  );
};

export default BaseLayerPicker;
