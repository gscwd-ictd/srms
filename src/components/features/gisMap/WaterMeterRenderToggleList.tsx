"use client";

import React, { useEffect, type FunctionComponent } from "react";
import { FeatureManager } from "@srms/lib/mapstudio/featureManager";
import { Point } from "ol/geom";
import VectorSource from "ol/source/Vector";
import VectorLayer from "ol/layer/Vector";
import { useGisMap } from "./contexts/useGisMapContext";
import { isEmpty } from "@srms/utils/isEmpty";
import { AccordionContent, AccordionTrigger } from "@srms/components/ui/Accordion";
import { Table, CircleGauge } from "lucide-react";
import { MarkerStyles } from "@srms/server/types";
import { createMarkerStyles } from "./utils/createMarkerStyles";
import { Spinner } from "@srms/components/ui-custom/Spinner";
import WaterMeterCard from "./WaterMeterCard";
import { useCardStore } from "@srms/components/stores/useCardStore";
// import WaterMeterDetailsCard from "./ConsumerDetailsCardDialog";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { WaterMeterData } from "@srms/lib/watermeters/types";

const featureManager = new FeatureManager();

const WaterMeterRenderToggleList: FunctionComponent = ({}) => {
  const gisMap = useGisMap();

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
      gisMap.mapManager.getLayerManager().getLayer("water-meters")?.setVisible(true);
    } else {
      gisMap.mapManager.getLayerManager().getLayer("water-meters")?.setVisible(false);
    }
  };

  // Open modal for viewing vehicle details
  const {
    setLayerToggleCardOpen,
    consumersTableCardOpen,
    setConsumersTableCardOpen,
    // consumerDetailsCardOpen,
    // setConsumerDetailsCardOpen,
    setValveDetailsCardOpen,
  } = useCardStore();

  const toggleTableModal = () => {
    setLayerToggleCardOpen(false);
    setConsumersTableCardOpen(true);
    // setVehicleDetailsCardOpen(false); //close vehicle details card if open
    // setConsumerDetailsCardOpen(false); //close consumer details card if open
    setValveDetailsCardOpen(false); //close valve details card if open
  };

  useEffect(() => {
    if (!gisMap.mapManager) return;

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
            radius: 3,
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

      vectorLayer.setZIndex(990);

      vectorLayer.setProperties({ id: "water-meter" });

      gisMap.mapManager.getLayerManager().addLayer("water-meters", vectorLayer);

      // Open card modal for water meter details
      // gisMap.mapManager.getMap().on("click", (e) => {
      //   const feature = gisMap.mapManager.getMap().forEachFeatureAtPixel(e.pixel, (feature) => {
      //     return feature;
      //   });
      //   setConsumerDetailsCardOpen(false);

      //   if (!feature) {
      //     return;
      //   }

      //   const props = feature.getProperties() as WaterMeterFeatureData;
      //   setSelectedWaterMeter({
      //     type: "Feature",
      //     id: props.id,
      //     geometry: {
      //       type: "Point",
      //       coordinates: props.geometry.flatCoordinates,
      //     },
      //     geometry_name: "",
      //     properties: {
      //       accountno: props.accountno,
      //       address: props.address,
      //       aveusage: props.aveusage,
      //       billed: props.billed,
      //       billedvol: props.billedvol,
      //       bookcode: props.bookcode,
      //       consumern: props.consumern,
      //       consumert: props.consumert,
      //       contactno: props.contactno,
      //       datecon: props.datecon,
      //       datediscon: props.datediscon,
      //       m3perhr: props.m3perhr,
      //       meterbrnd: props.meterbrnd,
      //       meterno: props.meterno,
      //       metersize: props.metersize,
      //       status: props.status,
      //       zonecode: props.zonecode,
      //     },
      //   });

      //   if (props.accountno) {
      //     //if water meter account number exists, open details card
      //     setValveDetailsCardOpen(false); //close valve details card if open
      //     setVehicleDetailsCardOpen(false); //close vehicle details card if open
      //     setConsumerDetailsCardOpen(true);
      //   }
      // });

      return () => {
        gisMap.mapManager.getLayerManager().removeLayer("water-meters");
      };
    }
  }, [gisMap.mapManager, waterMeters]);

  //open and close nav when esc key is pressed
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      //if pressed space key and consumers table card is not open, open consumers table card
      if (e.key === " " && !consumersTableCardOpen) {
        toggleTableModal();
      }
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey); //cleanup
  }, []);

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
          <AccordionTrigger className={`w-50 items-center`}>
            <p className="text-md primary-text-color mr-2 font-bold">Water Meters</p>
            <div>
              <Table className="primary-text-color w-5" onClick={toggleTableModal} />
            </div>
          </AccordionTrigger>
        </div>
      </div>

      <AccordionContent className="flex flex-col gap-4 text-balance">
        {isLoading ? (
          <div className="spinner">
            <Spinner size={"sm"} className="mt-4" />
          </div>
        ) : (
          <ul className="primary-text-color mx-11">
            <li>
              <div className="flex h-6">
                <div className="mt-0.5 mr-2 h-4 w-4 rounded-3xl bg-[#1458FC]"></div>
                Water Meter
              </div>
            </li>
          </ul>
        )}
      </AccordionContent>

      <WaterMeterCard open={consumersTableCardOpen} onOpenChange={setConsumersTableCardOpen} />
    </React.Fragment>
  );
};

export default WaterMeterRenderToggleList;
