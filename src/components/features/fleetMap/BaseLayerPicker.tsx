"use client";

import { BaseLayerOptions } from "@srms/components/enums";
import { FunctionComponent, useEffect, useState } from "react";
import { useFleetMap } from "./contexts/useFleetMapContext";
import { BaseMapLayerGroup } from "./BaseMapLayerGroup";
import { isEmpty } from "@srms/utils/isEmpty";
import LayerGroup from "ol/layer/Group";
import BaseLayer from "ol/layer/Base";

/* 
    Component for switching between Base Layers
 */

const BaseLayerPicker: FunctionComponent = ({}) => {
  const fleetMap = useFleetMap();
  const [baseMap, setBaseMap] = useState<string>();

  useEffect(() => {
    if (!isEmpty(baseMap)) {
      const mapBaseTileLayers = fleetMap.mapManager.getMap().getLayers().getArray();

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
  }, [fleetMap.mapManager, baseMap]);

  return (
    <div className="absolute top-[10px] right-[10px] z-20 flex h-10 w-auto items-center gap-4 rounded-lg bg-gradient-to-r from-cyan-500/80 to-blue-500/80 p-2">
      {/* <p className="text-md pb-2 font-bold text-black">Base Layers</p> */}

      {BaseMapLayerGroup.getLayers()
        .getArray()
        .map((baseMapLayer, index) => (
          <label
            htmlFor="field-osm"
            className="item-center mr-2 flex text-sm font-bold text-white"
            key={index}
          >
            <input
              name="baseMap"
              type="radio"
              value={baseMapLayer.getClassName()}
              className="mr-1"
              onChange={() => setBaseMap(baseMapLayer.getClassName())}
              defaultChecked={baseMapLayer.getClassName() === BaseLayerOptions.OSMWHITE}
            />
            <label className="mb-1">{baseMapLayer.getProperties()["title"]}</label>
          </label>
        ))}
    </div>
  );
};

export default BaseLayerPicker;
