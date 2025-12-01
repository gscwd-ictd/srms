"use client";

import { BaseLayerOptions } from "@srms/components/enums";
import { FunctionComponent, useEffect, useState } from "react";
import { useAdminMonitMap } from "./contexts/useAdminMonitMapContext";
import { BaseMapLayerGroup } from "./BaseMapLayerGroup";
import { isEmpty } from "@srms/utils/isEmpty";
import LayerGroup from "ol/layer/Group";
import BaseLayer from "ol/layer/Base";
import { Button } from "@srms/components/ui/Button";
import { cn } from "@srms/utils/shadcn";
import { Map } from "lucide-react";
import Image from "next/image";
/* 
    Component for switching between Base Layers
*/

const BaseLayerPicker: FunctionComponent = ({}) => {
  const adminMonitMap = useAdminMonitMap();
  const [baseMap, setBaseMap] = useState<string>();

  useEffect(() => {
    if (!isEmpty(baseMap)) {
      const mapBaseTileLayers = adminMonitMap.mapManager.getMap().getLayers().getArray();

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
  }, [adminMonitMap.mapManager, baseMap]);

  const [layerToggleCardOpen, setLayerToggleCardOpen] = useState<boolean>(false);
  // const [intialNavAnimation, setIntialNavAnimation] = useState<boolean>(true);

  // Open modal for layers card
  const toggleModal = () => {
    setLayerToggleCardOpen(!layerToggleCardOpen);
    // setIntialNavAnimation(false);
  };

  return (
    <>
      {/* <div className={`${  }''}`> */}

      <div
        className={cn(
          "absolute top-[0px] right-[0px] z-20 flex items-center justify-end gap-4 shadow-sm backdrop-blur",
          layerToggleCardOpen ? "bg-primary-color/70 h-18 w-auto pr-4" : "bg-primary-color/0 h-18 w-18",
        )}
      >
        {/* <p className="text-md pb-2 font-bold text-black">Base Layers</p> */}
        <Button
          className={cn(
            "bg-primary-color/70 hover:bg-primary-color/40 z-50 h-18 w-18 rounded-none transition-all transition-discrete duration-100",
            layerToggleCardOpen ? "shadow-none" : "intro-animation",
          )}
          onClick={() => toggleModal()}
        >
          <Map className="size-8 text-white" />
        </Button>
        {/* <Layers className="size-8 text-white" /> */}
        {layerToggleCardOpen ? (
          <>
            {BaseMapLayerGroup.getLayers()
              .getArray()
              .map((baseMapLayer) => (
                // <label
                //   htmlFor="field-osm"
                //   className="item-center mr-2 flex text-sm font-bold text-white"
                //   key={index}
                // >
                //   <input
                //     name="baseMap"
                //     type="radio"
                //     value={baseMapLayer.getClassName()}
                //     className="mr-1"
                //     onChange={() => setBaseMap(baseMapLayer.getClassName())}
                //     defaultChecked={baseMapLayer.getClassName() === BaseLayerOptions.POSITRON} // set default selected base layer
                //   />
                //   {baseMapLayer.getProperties()["title"]}
                // </label>

                <label key={baseMapLayer.getClassName()} className="cursor-pointer" htmlFor="field-osm">
                  {/* <input
                    type="radio"
                    id={baseMapLayer.getClassName()}
                    name="baseMap"
                    value={baseMapLayer.getClassName()}
                    className="peer hidden"
                    onChange={() => setBaseMap(baseMapLayer.getClassName())}
                    defaultChecked={baseMapLayer.getClassName() === BaseLayerOptions.POSITRON} // set default selected base layer
                  /> */}

                  {/* Square with image */}
                  <div
                    className="h-10 w-10 overflow-hidden rounded-xl shadow-xs transition peer-checked:border-blue-500 hover:shadow-lg"
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
                      height={150}
                      width={150}
                      priority
                      className="w-full object-cover select-none"
                    />
                  </div>
                </label>
              ))}
          </>
        ) : (
          ""
        )}
      </div>
    </>
  );
};

export default BaseLayerPicker;
