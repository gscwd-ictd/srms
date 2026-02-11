import { FeatureManager } from "@srms/lib/mapstudio/featureManager";
import { useAdminMonitMap } from "./contexts/useAdminMonitMapContext";
import { useCardStore } from "@srms/components/stores/useCardStore";
import { PumpingStationData, PumpingStationProperties } from "@srms/lib/pms/types";
import { useState, FunctionComponent, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import PumpStationMarker from "../../../../public/images/pump-station.svg";
import { isEmpty } from "ol/extent";
import VectorSource from "ol/source/Vector";
import VectorLayer from "ol/layer/Vector";
import Point from "ol/geom/Point";
import { IconStyles, LabelStyles } from "@srms/server/types";
import { createIconStyles } from "./utils/createIconStyles";
import { createLabelStyles } from "./utils/createLabelStyles";
// import { usePumpingStationStore } from "@srms/components/stores/usePumpingStationStore";
// import { PumpData } from "@srms/lib/pumpstation/pumpStationType";
import PumpingStationMapCard from "./PumpingStationMapCard";
import React from "react";
import { AccordionContent, AccordionTrigger } from "@srms/components/ui/Accordion";
import { Spinner } from "@srms/components/ui-custom/Spinner";
import { House } from "lucide-react";

const featureManager = new FeatureManager();

export const PumpingStationToggleList: FunctionComponent = ({}) => {
  const adminMonitMap = useAdminMonitMap();
  const { setLayerToggleCardOpen, pumpingStationCardOpen, setPumpingStationCardOpen } = useCardStore();
  const [selectedPumpStation, setPumpStation] = useState<PumpingStationProperties>();

  const { data: pumpStations, isLoading } = useQuery({
    queryKey: ["get-all-pumping-stations"],
    refetchOnReconnect: false,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    queryFn: async () => {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_APP_URL}/api/v1/layers/pumping-stations`,
        {},
      );

      return data;
    },
    throwOnError: true,
  });

  useEffect(() => {
    if (!adminMonitMap.mapManager) return;
    if (pumpStations !== undefined) {
      if (!isEmpty(pumpStations)) {
        const vectorSource = new VectorSource();

        const vectorLayer = new VectorLayer();

        // adminMonitMap.pumpstations
        pumpStations.features.forEach((pumpStation: PumpingStationData) => {
          try {
            const pumpStationProperties = {
              ps_no: pumpStation.properties.ps_no,
              ps_name: pumpStation.properties.ps_name,
              location: pumpStation.properties.location,
              motor: pumpStation.properties.motor,
              discharge: pumpStation.properties.discharge,
              "rated cap": pumpStation.properties["rated cap"],
              "actual cap": pumpStation.properties["actual cap"],
              swl: pumpStation.properties.swl,
              pwl: pumpStation.properties.pwl,
              "pump sett": pumpStation.properties["pump sett"],
              "draw down": pumpStation.properties["draw down"],
              operating: pumpStation.properties.operating,
              wellcasing: pumpStation.properties.wellcasing,
              "well depth": pumpStation.properties["well depth"],
              genset: pumpStation.properties.genset,
              "yr const": pumpStation.properties["yr const"],
              status: pumpStation.properties.status,
              remarks: pumpStation.properties.remarks,
            };

            const feature = featureManager.createFeature(
              new Point(pumpStation.geometry.coordinates),
              pumpStationProperties,
            );
            vectorSource.addFeature(feature);

            const pumpStationStyles = {
              src: PumpStationMarker.src!,
              anchor: [0.5, 1],
              scale: 0.18,
              zIndex: 900,
            };
            const featureStyle = createIconStyles(pumpStationStyles as IconStyles);

            const labelStyles = {
              font: "13px Calibri,sans-serif",
              overflow: true,
              fillColor: "#000",
              strokeColor: "#fff",
              width: 3,
              offsetY: 12,
              text: `${pumpStation.properties.ps_name}`,
            };
            const featureStyle2 = createLabelStyles(labelStyles as LabelStyles);

            feature.setStyle([featureStyle.iconStyle, featureStyle2.labelStyle]);
          } catch (e) {
            console.error("Error adding pump station feature: ", e);
          }
        });

        vectorLayer.setSource(vectorSource);

        vectorLayer.setVisible(true); // set default visibility

        vectorLayer.setZIndex(992);

        vectorLayer.setProperties({ id: "pumping-stations" });

        adminMonitMap.mapManager.getLayerManager().addLayer("pumping-stations", vectorLayer);

        // Open card modal for valve details
        adminMonitMap.mapManager.getMap().on("click", (e) => {
          setPumpStation({} as PumpingStationProperties);
          setPumpingStationCardOpen(0);

          const feature = adminMonitMap.mapManager
            .getMap()
            .forEachFeatureAtPixel(e.pixel, (feature, layer) => {
              if (layer.get("id") === "pumping-stations") {
                setPumpingStationCardOpen(1); //open pumping station card modal
                setLayerToggleCardOpen(false); //close layers card nav
              }
              return feature;
            });

          if (!feature) {
            return;
          }

          const props = feature.getProperties() as PumpingStationProperties | undefined;
          setPumpStation(props);
        });
      }
    }

    return () => {
      adminMonitMap.mapManager.getLayerManager().removeLayer("pumping-stations");
    };
  }, [adminMonitMap.mapManager, pumpStations]);

  // Update openlayers. Visibility status of selected layer.
  const setLayerVisibility = (isChecked: boolean) => {
    if (isChecked) {
      adminMonitMap.mapManager.getLayerManager().getLayer("pumping-stations")?.setVisible(true);
    } else {
      adminMonitMap.mapManager.getLayerManager().getLayer("pumping-stations")?.setVisible(false);
    }
  };

  return (
    <React.Fragment>
      <div className="flex">
        <div className="flex cursor-pointer items-center space-x-2 p-2">
          <label>
            <input
              type="checkbox"
              className="peer hidden"
              onChange={(event) => {
                setLayerVisibility(event.target.checked);
              }}
              defaultChecked={true}
            />

            <House className="primary-text-color mr-2 block w-5 cursor-pointer opacity-30 peer-checked:hidden" />
            <House className="primary-text-color mr-2 hidden w-5 cursor-pointer peer-checked:block" />
          </label>
          <AccordionTrigger className="w-40 items-center">
            <p className="text-md primary-text-color font-bold">Pumping Station</p>
          </AccordionTrigger>
        </div>

        {isLoading ? (
          <div className="spinner">
            <Spinner size={"sm"} className="mt-4" />
          </div>
        ) : null}
      </div>

      <AccordionContent className="flex flex-col gap-4 text-balance">
        <ul className="primary-text-color mx-12">
          <li>
            <div className="flex h-6">
              <div className="mt-0.5 mr-2 h-4 w-4 rounded-3xl bg-blue-500"></div>
              PumpStation
            </div>
          </li>
        </ul>
      </AccordionContent>
      {pumpingStationCardOpen == 1 && selectedPumpStation ? (
        <PumpingStationMapCard open={pumpingStationCardOpen == 1} ps={selectedPumpStation} />
      ) : (
        ""
      )}
    </React.Fragment>
  );
};

export default PumpingStationToggleList;
