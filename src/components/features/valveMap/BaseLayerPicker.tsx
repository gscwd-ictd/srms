"use client";

import { BaseLayerOptions } from "@srms/components/enums";
import { FunctionComponent, useEffect, useState } from "react";
import { useValvesMap } from "./contexts/useValvesMapContext";
import { BaseMapLayerGroup } from "./BaseMapLayerGroup";
import { isEmpty } from "@srms/utils/isEmpty";
import LayerGroup from "ol/layer/Group";
import BaseLayer from "ol/layer/Base";

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

  return (
    <div className="base-layers absolute bottom-[10px] left-[10px] z-20 rounded-lg bg-white p-3">
      <p className="text-md pb-2 font-bold text-black">Base Layers</p>

      {BaseMapLayerGroup.getLayers()
        .getArray()
        .map((baseMapLayer, index) => (
          <label htmlFor="field-osm" className="mr-2 text-sm text-black" key={index}>
            <input
              name="baseMap"
              type="radio"
              value={baseMapLayer.getClassName()}
              className="mr-1"
              onChange={() => setBaseMap(baseMapLayer.getClassName())}
              defaultChecked={baseMapLayer.getClassName() === BaseLayerOptions.OSM}
            />
            {baseMapLayer.getProperties()["title"]}
          </label>
        ))}
    </div>
  );
};

export default BaseLayerPicker;
