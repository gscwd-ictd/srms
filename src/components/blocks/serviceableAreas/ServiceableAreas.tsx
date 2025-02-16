"use client";

import { useEffect, type FunctionComponent } from "react";
import { useQuery } from "@tanstack/react-query";
import { Fill, Stroke, Style } from "ol/style";
import { FeatureManager } from "@srms/lib/mapstudio/featureManager";
// import { Coordinate } from "ol/coordinate";
import { Position2D } from "@srms/server/types";
import { Select } from "ol/interaction";
import { pointerMove } from "ol/events/condition";
import { useGeo } from "@srms/components/hooks/useGeo";
import { createFeatureStyles } from "@srms/components/features/addServiceableArea/utils/createFeatureStyles";
import { useServiceableAreaMap } from "@srms/components/features/addServiceableArea/contexts/useServiceableMapContext";
import Polygon from "ol/geom/Polygon";
import VectorSource from "ol/source/Vector";
import VectorLayer from "ol/layer/Vector";
import $api from "@srms/lib/sdk/apiClient";

export const ServiceableAreas: FunctionComponent = () => {
  //  const [boundaries, setBoundaries] = useState<Coordinate[] | undefined>(undefined);

  // const queryClient = useQueryClient();

  const { data } = useQuery({
    queryKey: ["get-all-serviceable-areas"],
    queryFn: async () => {
      return await $api.serviceableAreas.getServiceableAreas();
    },
  });

  // const {} = useMutation({
  //   mutationKey: ["add-brgy"],
  //   mutationFn: async () => {
  //     const res = await $api.serviceableAreas.postServiceableAreas({
  //       barangay: crypto.randomUUID(),
  //       boundaries: boundaries as number[][],
  //     });

  //     return res;
  //   },
  //   onSuccess: () => {
  //     queryClient.invalidateQueries({
  //       queryKey: ["get-all-serviceable-areas"],
  //     });
  //   },
  // });

  const { createMultiPolygon } = useGeo();

  const serviceableAreaMap = useServiceableAreaMap();

  useEffect(() => {
    if (!data || !serviceableAreaMap.mapManager) return;

    /**
     * * For checking if pointer coordinates is within the bounds of multipolygon
     * TODO: create a helper function for this - add polygon and linstring
     */
    serviceableAreaMap.mapManager.getMap().on("click", (e) => {
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
          lineJoin: "round",
          lineCap: "round",
          lineDash: [5, 10],
          lineDashOffset: 40,
        }),
        fill: new Fill({
          color: "rgba(0, 0, 255, 0.1)",
        }),
      }),
    });

    serviceableAreaMap.mapManager.getLayerManager().addLayer("serviceableAreas", vectorLayer);

    /**
     * * For listening to select events on features
     * TODO: add helper function
     */
    const select = new Select({
      condition: pointerMove, // hovering event on a feature - use `click` if you want click event
      layers: [vectorLayer], // only select from this layer
    });

    serviceableAreaMap.mapManager.getMap().addInteraction(select);

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
      serviceableAreaMap.mapManager.getLayerManager().removeLayer("serviceableAreas");
      //  mapConfig?.mapManager.getLayerManager().removeLayer("serviceableAreas");
    };
  }, [createMultiPolygon, data, serviceableAreaMap.mapManager]);

  //const mapConfig = useContext(ServiceableAreaMapContext);

  const properties = createFeatureStyles(serviceableAreaMap.properties);

  console.log(properties);

  return (
    <div className="absolute top-10 right-10 z-10 space-x-4">
      {/* <Button
        variant="secondary"
        onClick={() => {
          serviceableAreaMap.mapManager?.getInteractionManager().clear();
        }}
      >
        Clear
      </Button>

      <Button
        variant="secondary"
        onClick={() => {
          serviceableAreaMap.mapManager
            .getInteractionManager()
            .enableDrawing(
              "Polygon",
              properties.freehand,
              properties.drawStyle,
              properties.snapping,
              (coords) => {
                setBoundaries(coords);
              },
            );
        }}
      >
        Draw Barangay
      </Button> */}

      {/* <Button variant="secondary" onClick={() => mutate()}>
        Add Barangay
      </Button> */}

      {/* <PolygonDrawingTool /> */}
    </div>
  );
};
