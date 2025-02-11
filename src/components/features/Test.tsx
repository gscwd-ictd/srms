"use client";

import $api from "@srms/lib/sdk/apiClient";
import { useQuery } from "@tanstack/react-query";
import { FunctionComponent, useContext, useState, useEffect } from "react";
import { WebMapContext } from "./WebMap";
import { FeatureManager } from "@srms/lib/mapstudio/featureManager";
// import { GeoUtils } from "@srms/lib/mapstudio/geoUtils";
import VectorSource from "ol/source/Vector";
import VectorLayer from "ol/layer/Vector";
import { Fill, Stroke, Style } from "ol/style";
import GeoJSON from "ol/format/GeoJSON";
import { Feature } from "ol";
import { Polygon } from "ol/geom";
import { Coordinate } from "ol/coordinate";

const defaultStyle = new Style({
  stroke: new Stroke({
    color: "blue",
    // lineDash: [4],
    width: 2,
  }),
  fill: new Fill({
    color: "rgba(0, 0, 255, 0.1)",
  }),
});

export const Test: FunctionComponent = () => {
  const [featureManager] = useState(new FeatureManager());
  const mapManager = useContext(WebMapContext);

  const { data: serviceableAreas } = useQuery({
    queryKey: ["get_all_serviceable_areas"],
    queryFn: async () => {
      const res = await $api.serviceableAreas.getServiceableAreasId("cm704mbkm0k95turmxkj");
      return res;
    },
  });

  useEffect(() => {
    if (!serviceableAreas || !mapManager) return;

    // const geojsonData = {
    //   type: "FeatureCollection",
    //   features: [
    //     {
    //       type: "Feature",
    //       properties: {
    //         name: "Sample Area",
    //       },
    //       geometry: {
    //         type: "Polygon",
    //         coordinates: [
    //           [
    //             [120.0, 10.0], // Philippines area coordinates
    //             [122.0, 10.0],
    //             [122.0, 12.0],
    //             [120.0, 12.0],
    //             [120.0, 10.0], // Close the polygon
    //           ],
    //         ],
    //       },
    //     },
    //   ],
    // };

    // Create vector source and layer for GeoJSON
    const vectorSource = new VectorSource({
      features: new GeoJSON().readFeatures(serviceableAreas.boundaries),
    });

    // console.log(serviceableAreas.boundaries.coordinates);

    // vectorSource.addFeature(new Feature(new Polygon(serviceableAreas.boundaries.coordinates)));

    // vectorSource.addFeature(
    //   new Feature(
    //     new Polygon([
    //       [
    //         [125.169595017, 6.11489542],
    //         [125.173871513, 6.114907674],
    //         [125.173735947, 6.111390743],
    //         [125.169705934, 6.111464268],
    //         [125.169595017, 6.11489542],
    //       ],
    //     ]),
    //   ),
    // );

    const vectorLayer = new VectorLayer({
      source: vectorSource,
      style: defaultStyle,
    });

    mapManager?.getMap().addLayer(vectorLayer);

    const extent = vectorSource.getExtent();
    mapManager
      ?.getMap()
      .getView()
      .fit(extent, {
        padding: [50, 50, 50, 50],
        maxZoom: 16,
      });

    // Create map if it doesn't exist
  }, [serviceableAreas, mapManager, featureManager]);

  return <div className="z-10" />;
};
