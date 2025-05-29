/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { BaseLayerOptions } from "@srms/components/enums";
import { useMapStore } from "@srms/components/stores/useMapStore";
import { isEmpty } from "lodash";
import { FunctionComponent, useEffect } from "react";
import { useForm } from "react-hook-form";

type BaseMap = {
  baseMap: BaseLayerOptions;
};

const BaseLayerPicker: FunctionComponent = ({}) => {
  // zustand initialization
  const { setSelectedBaseMap, mapRef } = useMapStore();

  // React hook form
  const { register, watch } = useForm<BaseMap>({
    mode: "onChange",
    defaultValues: {
      baseMap: BaseLayerOptions.OSM,
    },
  });
  const watchBaseMap = watch("baseMap");

  useEffect(() => {
    if (!isEmpty(watchBaseMap)) {
      const mapBaseTileLayers = mapRef?.getAllLayers();

      mapBaseTileLayers?.map((layer: any) => {
        if (watchBaseMap === layer.className_) {
          layer.setVisible(true);
        } else {
          layer.setVisible(false);
        }
      });
    }
  }, [mapRef, setSelectedBaseMap, watchBaseMap]);

  return (
    <div className="base-layers absolute bottom-[10px] left-[10px] z-20 rounded-lg bg-white p-3">
      <p className="text-md pb-2 font-bold text-black">Base Layers</p>
      <form className="">
        {/* OSM */}
        <label htmlFor="field-osm" className="mr-2 text-sm text-black">
          <input
            {...register("baseMap")}
            name="baseMap"
            type="radio"
            value={BaseLayerOptions.OSM}
            id="field-osm"
            className="mr-1"
          />
          OpenStreetMap
        </label>

        {/* Bing Maps */}
        <label htmlFor="field-bing-maps" className="mr-2 text-sm text-black">
          <input
            {...register("baseMap")}
            name="baseMap"
            type="radio"
            value={BaseLayerOptions.BING_AERIAL}
            id="field-bing-maps"
            className="mr-1"
          />
          Bing Aerial
        </label>
      </form>
    </div>
  );
};

export default BaseLayerPicker;
