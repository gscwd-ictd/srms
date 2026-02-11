"use client";

import React, { useEffect, type FunctionComponent } from "react";
import { FeatureManager } from "@srms/lib/mapstudio/featureManager";
import { Point } from "ol/geom";
import VectorSource from "ol/source/Vector";
import VectorLayer from "ol/layer/Vector";
import { useFleetMap } from "./contexts/useFleetMapContext";
import { isEmpty } from "@srms/utils/isEmpty";
import { AccordionContent, AccordionTrigger } from "@srms/components/ui/Accordion";
import { Table, CircleGauge } from "lucide-react";
import { MarkerStyles } from "@srms/server/types";
import { createMarkerStyles } from "./utils/createMarkerStyles";
import { Spinner } from "@srms/components/ui-custom/Spinner";
import WaterMeterCard from "./WaterMeterCard";
import { useCardStore } from "@srms/components/stores/useCardStore";
import WaterMeterDetailsCard from "./WaterMeterDetailsCard";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { WaterMeterData } from "@srms/lib/watermeters/types";

const featureManager = new FeatureManager();

const WaterMeterRenderToggleList: FunctionComponent = ({}) => {
  const fleetMap = useFleetMap();

  const { data: waterMeters, isLoading } = useQuery({
    queryKey: ["get-all-water-meters"],
    refetchOnReconnect: false,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    queryFn: async () => {
      const { data } = await axios.get(`${process.env.NEXT_PUBLIC_APP_URL}/api/v1/layers/water-meters`, {});

      return data;
    },
    throwOnError: true,
  });

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

    if (!isEmpty(waterMeters)) {
      const vectorSource = new VectorSource();

      const vectorLayer = new VectorLayer();

      waterMeters.features.forEach((waterMeter: WaterMeterData) => {
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
    }
  }, [fleetMap.mapManager, waterMeters]);

  return (
    <React.Fragment>
      <div className="flex">
        {/* <div className="spinner">
          <Spinner size={"sm"} className="mt-4" />
        </div> */}
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
            <CircleGauge className="primary-text-color mr-2 block w-5 cursor-pointer opacity-30 peer-checked:hidden" />
            <CircleGauge className="primary-text-color mr-2 hidden w-5 cursor-pointer peer-checked:block" />
          </label>
          <AccordionTrigger className={`${isLoading ? "" : "w-40"} items-center`}>
            <p className="text-md primary-text-color mr-2 font-bold">Water Meters</p>
            <div>
              <Table className="primary-text-color w-5" onClick={toggleTableModal} />
            </div>
          </AccordionTrigger>
        </div>

        {isLoading ? (
          <div className="spinner">
            <Spinner size={"sm"} className="mt-4" />
          </div>
        ) : null}
      </div>

      <AccordionContent className="flex flex-col gap-4 text-balance">
        <ul className="primary-text-color mx-11">
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
