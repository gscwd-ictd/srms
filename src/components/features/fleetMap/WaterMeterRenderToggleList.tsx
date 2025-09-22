"use client";

import React, { useEffect, type FunctionComponent } from "react";
import { FeatureManager } from "@srms/lib/mapstudio/featureManager";
import { Point } from "ol/geom";
import VectorSource from "ol/source/Vector";
import VectorLayer from "ol/layer/Vector";
import { useFleetMap } from "./contexts/useFleetMapContext";
import { isEmpty } from "@srms/utils/isEmpty";
import { AccordionContent, AccordionTrigger } from "@srms/components/ui/Accordion";
import { Eye, EyeOff, Table } from "lucide-react";
import { MarkerStyles } from "@srms/server/types";
import { createMarkerStyles } from "./utils/createMarkerStyles";
import { Spinner } from "@srms/components/ui-custom/Spinner";
import WaterMeterCard from "./WaterMeterCard";
import { useCardStore } from "@srms/components/stores/useCardStore";
import WaterMeterDetailsCard from "./WaterMeterDetailsCard";

const featureManager = new FeatureManager();

const WaterMeterRenderToggleList: FunctionComponent = ({}) => {
  const fleetMap = useFleetMap();

  // Update openlayers. Visibility status of selected layer.
  const setLayerVisibility = (isChecked: boolean) => {
    if (isChecked) {
      fleetMap.mapManager.getLayerManager().getLayer("water-meters")?.setVisible(true);
    } else {
      fleetMap.mapManager.getLayerManager().getLayer("water-meters")?.setVisible(false);
    }
  };

  // Open modal for viewing vehicle details
  const {
    layerToggleCardOpen,
    setLayerToggleCardOpen,
    waterMeterTableCardOpen,
    setWaterMeterTableCardOpen,
    waterMeterDetailsCardOpen,
    setWaterMeterDetailsCardOpen,
  } = useCardStore();

  const toggleTableModal = () => {
    setLayerToggleCardOpen(!layerToggleCardOpen);
    setWaterMeterTableCardOpen(!waterMeterTableCardOpen);
  };

  useEffect(() => {
    if (!fleetMap.mapManager) return;

    const vectorSource = new VectorSource();

    const vectorLayer = new VectorLayer();

    fleetMap.waterMeters.features.forEach((waterMeter) => {
      if (!isEmpty(waterMeter.geometry)) {
        const wmProperties = {
          id: waterMeter.id,
          accountno: waterMeter.properties.accountno,
          meterno: waterMeter.properties.meterno,
          consumern: waterMeter.properties.consumern,
          address: waterMeter.properties.address,
          datecon: waterMeter.properties.datecon,
          status: waterMeter.properties.status,
          datediscon: waterMeter.properties.datediscon,
          zonecode: waterMeter.properties.zonecode,
          bookcode: waterMeter.properties.bookcode,
          consumert: waterMeter.properties.consumert,
          meterbrnd: waterMeter.properties.meterbrnd,
          metersize: waterMeter.properties.metersize,
          aveusage: waterMeter.properties.aveusage,
          m3perhr: waterMeter.properties.m3perhr,
          contactno: waterMeter.properties.contactno,
          billedvol: waterMeter.properties.billedvol,
          billed: waterMeter.properties.billed,
        };

        const feature = featureManager.createFeature(
          new Point(waterMeter.geometry.coordinates),
          wmProperties,
        );
        vectorSource.addFeature(feature);

        const wmStyles = {
          radius: 5,
          fillColor: "rgb(20, 88, 252, 1.0)",
          strokeColor: "rgb(1, 40, 133, 1.0)",
          strokeWidth: 1,
        };

        const featureStyle = createMarkerStyles(wmStyles as MarkerStyles);
        feature.setStyle(featureStyle.markerStyle);
      }
    });

    vectorLayer.setSource(vectorSource);

    vectorLayer.setVisible(false);

    vectorLayer.setZIndex(995);

    vectorLayer.setProperties({ id: "water-meter" });

    fleetMap.mapManager.getLayerManager().addLayer("water-meters", vectorLayer);

    return () => {
      fleetMap.mapManager.getLayerManager().removeLayer("water-meters");
    };
  }, [fleetMap.mapManager, fleetMap.waterMeters.features]);

  return (
    <React.Fragment>
      {fleetMap.loadingWaterMeters ? (
        <div className="spinner">
          <Spinner size={"xl"} />
        </div>
      ) : null}

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
          <EyeOff className="mr-2 block w-5 text-stone-800 peer-checked:hidden" />
          <Eye className="mr-2 hidden w-5 text-stone-800 peer-checked:block" />
        </label>
        <AccordionTrigger className="items-center">
          <p className="text-md font-bold text-black">Water Meters</p>
        </AccordionTrigger>
        <div>
          <Table className="mr-2 w-5 text-stone-800" onClick={toggleTableModal} />
        </div>
      </div>

      <AccordionContent className="flex flex-col gap-4 text-balance">
        <ul className="text-stone-900">
          <li>
            <div className="flex h-6">
              <div className="mt-0.5 mr-2 h-4 w-4 rounded-3xl bg-[#1458FC]"></div>
              Water Meter
            </div>
          </li>
        </ul>
      </AccordionContent>

      <WaterMeterCard open={waterMeterTableCardOpen} onOpenChange={setWaterMeterTableCardOpen} />

      <WaterMeterDetailsCard open={waterMeterDetailsCardOpen} onOpenChange={setWaterMeterDetailsCardOpen} />
    </React.Fragment>
  );
};

export default WaterMeterRenderToggleList;
