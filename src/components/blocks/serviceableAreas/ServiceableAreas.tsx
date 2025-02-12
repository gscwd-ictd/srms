"use client";

import { Button } from "@srms/components/ui/Button";
import { useContext, useEffect, useState, type FunctionComponent } from "react";
import { WebMapContext } from "./ServiceableAreaMap";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import $api from "@srms/lib/sdk/apiClient";
import VectorSource from "ol/source/Vector";
import VectorLayer from "ol/layer/Vector";
import { Fill, Stroke, Style } from "ol/style";
import { FeatureManager } from "@srms/lib/mapstudio/featureManager";
import Polygon from "ol/geom/Polygon";
import { Coordinate } from "ol/coordinate";
import { Position2D } from "@srms/server/types";
import { Select } from "ol/interaction";
import { pointerMove } from "ol/events/condition";
import { useGeo } from "@srms/components/hooks/useGeo";

export const ServiceableAreas: FunctionComponent = () => {
  const [boundaries, setBoundaries] = useState<Coordinate[] | undefined>(undefined);
  const mapManager = useContext(WebMapContext);

  const queryClient = useQueryClient();

  const { data } = useQuery({
    queryKey: ["get-all-serviceable-areas"],
    queryFn: async () => {
      return await $api.serviceableAreas.getServiceableAreas();
    },
  });

  const { mutate } = useMutation({
    mutationKey: ["add-brgy"],
    mutationFn: async () => {
      const res = await $api.serviceableAreas.postServiceableAreas({
        barangay: crypto.randomUUID(),
        boundaries: boundaries as number[][],
      });

      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["get-all-serviceable-areas"],
      });
    },
  });

  const { createMultiPolygon } = useGeo();

  useEffect(() => {
    if (!data || !mapManager) return;

    /**
     * * For checking if pointer coordinates is within the bounds of multipolygon
     * TODO: create a helper function for this - add polygon and linstring
     */
    mapManager.getMap().on("click", (e) => {
      // const polygon = new Polygon(data[0]?.boundaries.coordinates!);

      //  const polygon = new Polygon(data[0]?.boundaries.coordinates as Coordinate[][]);

      //const isInsidePolygon = polygon.containsXY(e.coordinate[0]!, e.coordinate[1]!);

      const polygonCoordinates = data.map((area) => area.boundaries.coordinates[0]);

      const multiPolygon = createMultiPolygon(polygonCoordinates as Position2D[][]);

      const isInsideMultiPolygon = multiPolygon.containsXY(e.coordinate[0]!, e.coordinate[1]!);

      console.log({
        point: e.coordinate,
        bounds: data[0]?.boundaries.coordinates,
        isInsideMultiPolygon,
        //  isInsidePolygon,
      });
    });

    /**
     * * For rendering geojson data from database to the map
     * TODO: create a component for drawing toolbar
     */
    const vectorSource = new VectorSource();

    const featureManager = new FeatureManager();

    data.forEach((area) => {
      const feature = featureManager.createFeature(new Polygon(area.boundaries.coordinates), {
        id: area.id,
        name: area.barangay,
        description: area.barangay,
      });

      vectorSource.addFeature(feature);
    });

    const vectorLayer = new VectorLayer({
      source: vectorSource,
      style: new Style({
        stroke: new Stroke({
          color: "blue",
          width: 2,
        }),
        fill: new Fill({
          color: "rgba(0, 0, 255, 0.1)",
        }),
      }),
    });

    mapManager.getLayerManager().addLayer("serviceableAreas", vectorLayer);

    /**
     * * For listening to select events on features
     * TODO: add helper function
     */
    const select = new Select({
      condition: pointerMove, // hovering event on a feature - use `click` if you want click event
      layers: [vectorLayer], // only select from this layer
    });

    mapManager.getMap().addInteraction(select);

    select.on("select", (event) => {
      const selectedFeatures = event.selected;

      if (selectedFeatures.length > 0) {
        // Get the first selected feature
        const feature = selectedFeatures[0];

        // Get the properties
        const properties = feature?.getProperties();

        // Log the details
        console.log("Selected Feature:", {
          id: properties?.id,
          name: properties?.name,
          description: properties?.description,
        });
      }
    });

    // Cleanup
    return () => {
      mapManager.getLayerManager().removeLayer("serviceableAreas");
    };
  }, [createMultiPolygon, data, mapManager]);

  return (
    <div className="absolute top-10 right-10 z-10 space-x-5">
      {/* <Button
        variant="secondary"
        onClick={() => {
          mapManager?.getInteractionManager().enableDrawing("Polygon", true, (coords) => {
            setBoundaries(coords);
          });
        }}
      >
        Draw Barangay
      </Button>
      <Button variant="secondary" onClick={() => mutate()}>
        Add Barangay
      </Button> */}
    </div>
  );
};
