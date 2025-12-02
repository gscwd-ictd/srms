import { FeatureManager } from "@srms/lib/mapstudio/featureManager";
import { de } from "date-fns/locale"
import { FunctionComponent, useEffect, useState } from "react";
import ReservoirMarker from "../../../../public/images/water-tank.svg";
import { useAdminMonitMap } from "./contexts/useAdminMonitMapContext";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { isEmpty } from "@srms/utils/isEmpty";
import VectorSource from "ol/source/Vector";
import VectorLayer from "ol/layer/Vector";
import { ReservoirData, ReservoirProperties } from "@srms/lib/pms/types";
import { Point } from "ol/geom";
import { createIconStyles } from "./utils/createIconStyles";
import { IconStyles, LabelStyles } from "@srms/server/types";
import { createLabelStyles } from "./utils/createLabelStyles";
import React from "react";
import { AccordionContent, AccordionTrigger } from "@radix-ui/react-accordion";
import { Spinner } from "@srms/components/ui-custom/Spinner";
import { Eye, EyeOff } from "lucide-react";
import ReservoirCard from "./ReservoirCard";
import { useCardStore } from "@srms/components/stores/useCardStore";

const featureManager = new FeatureManager();

export const ReservoirToggleList: FunctionComponent = ({}) => {
  const adminMonitMap = useAdminMonitMap();
  const [reservoirSelected, setReservoirSelected] = useState<ReservoirProperties>();
  const { layerToggleCardOpen, setLayerToggleCardOpen, reservoirCardOpen, setReservoirCardOpen } =
      useCardStore();
  
  const { data: reservoirs, isLoading } = useQuery({
    queryKey: ["get-all-reservoirs"],
    refetchOnReconnect: false,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    queryFn: async () => {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_APP_URL}/api/v1/layers/reservoirs`,
        {},
      );

      return data;
    },
    throwOnError: true,
  });

  // Update openlayers. Visibility status of selected layer.
  const setLayerVisibility = (isChecked: boolean) => {
    if (isChecked) {
      adminMonitMap.mapManager.getLayerManager().getLayer("reservoir-prop")?.setVisible(true);
    } else {
      adminMonitMap.mapManager.getLayerManager().getLayer("reservoir-prop")?.setVisible(false);
    }
  };

  useEffect(() => {
    if (!adminMonitMap.mapManager) return;
    if (reservoirs !== undefined) {
      if (!isEmpty(reservoirs)) {
        const vectorSource = new VectorSource();

        const vectorLayer = new VectorLayer();

        // adminMonitMap.pumpstations
        reservoirs.features.forEach((reservoir: ReservoirData) => {
          try {
            const reservoirProperties = {
                source: reservoir.properties.source,
                location: reservoir.properties.location,
                cap_gal: reservoir.properties.cap_gal,
                "cap_cu.m": reservoir.properties["cap_cu.m"],
                chamber: reservoir.properties.chamber,
                type_res: reservoir.properties.type_res,
                material: reservoir.properties.material,
                status: reservoir.properties.status,
                system: reservoir.properties.system,
            };

            const feature = featureManager.createFeature(
              new Point(reservoir.geometry.coordinates),
              reservoirProperties,
            );
            vectorSource.addFeature(feature);

            const pumpStationStyles = {
              src: ReservoirMarker.src!,
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
              text: `${reservoir.properties.location}`,
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

        vectorLayer.setProperties({ id: "reservoir-prop" });

        adminMonitMap.mapManager.getLayerManager().addLayer("reservoir-prop", vectorLayer);

        // Open card modal for valve details
        adminMonitMap.mapManager.getMap().on("click", (e) => {
        //   setPumpingStationCardOpen(0);

          const feature = adminMonitMap.mapManager
            .getMap()
            .forEachFeatureAtPixel(e.pixel, (feature, layer) => {
              if (layer.get("id") === "reservoir-prop") {
                setReservoirCardOpen(true);
                setLayerToggleCardOpen(!layerToggleCardOpen);
              }
              return feature;
            });

          if (!feature) {
            return;
          }

          const props = feature.getProperties() as ReservoirProperties | undefined;

          setReservoirSelected(props);
        });
      }
    }

    return () => {
      adminMonitMap.mapManager.getLayerManager().removeLayer("pumping-stations");
    };
  }, [adminMonitMap.mapManager, reservoirs]);
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
              <EyeOff className="mr-2 block w-5 text-stone-800 peer-checked:hidden" />
              <Eye className="mr-2 hidden w-5 text-stone-800 peer-checked:block" />
            </label>
            <AccordionTrigger className="items-center">
              <p className="text-md font-bold text-black">Reservoir</p>
            </AccordionTrigger>
          </div>
  
          {isLoading ? (
            <div className="spinner">
              <Spinner size={"sm"} className="mt-4" />
            </div>
          ) : null}
        </div>
  
        <AccordionContent className="flex flex-col gap-4 text-balance">
          <ul className="mx-12 text-stone-900">
            <li>
              <div className="flex h-6">
                <div className="mt-0.5 mr-2 h-4 w-4 rounded-3xl bg-blue-500"></div>
                Reservoirs
              </div>
            </li>
          </ul>
        </AccordionContent>
        {reservoirCardOpen && reservoirSelected ? (
          <ReservoirCard open={reservoirCardOpen} rp={reservoirSelected} />
        ) : (
          ""
        )}
      </React.Fragment>
      );
}

export default ReservoirToggleList;