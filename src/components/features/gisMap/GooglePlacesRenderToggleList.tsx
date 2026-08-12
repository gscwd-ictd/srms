"use client";

import { useMapStore } from "@srms/components/stores/useMapStore";
import React from "react";
import { MapPin } from "lucide-react";
import { AccordionTrigger } from "@radix-ui/react-accordion";

const GooglePlacesRenderToggleList = () => {
  const { setPoiVisible } = useMapStore();

  return (
    <React.Fragment>
      <div className="flex">
        <div className="flex cursor-pointer items-center justify-start space-x-2 p-2">
          <label>
            <input
              type="checkbox"
              className="peer hidden"
              onChange={(event) => {
                setPoiVisible(event.target.checked);
              }}
              defaultChecked={false}
            />

            <MapPin className="primary-text-color mr-2 block w-5 cursor-pointer opacity-30 peer-checked:hidden" />
            <MapPin className="primary-text-color mr-2 hidden w-5 cursor-pointer peer-checked:block" />
          </label>
          <AccordionTrigger className={`w-auto items-center`}>
            <p className="primary-text-color mr-2 text-sm font-bold">Nearby Places</p>
          </AccordionTrigger>
        </div>
      </div>
    </React.Fragment>
  );
};

export default GooglePlacesRenderToggleList;
