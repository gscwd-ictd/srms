/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { type PropsWithChildren, type FunctionComponent, useRef, useEffect, useState } from "react";
import { useGeographic } from "ol/proj";
import View from "ol/View";
import { BaseMapLayerGroup } from "./BaseMapLayerGroup";
import { useGisMap } from "./contexts/useGisMapContext";
import { useMapStore } from "@srms/components/stores/useMapStore";
import VectorSource from "ol/source/Vector";
import VectorLayer from "ol/layer/Vector";
import { useGooglePlacesPOI } from "@srms/components/hooks/useGooglePlacesPoi";
import Map from "ol/Map";
import Draw from "ol/interaction/Draw";
import { Style, Stroke, Fill } from "ol/style";
import Point from "ol/geom/Point";

export const selectionSource = new VectorSource();

export const selectionLayer = new VectorLayer({
  source: selectionSource,
  zIndex: 9999,
  style: new Style({
    stroke: new Stroke({
      color: "#2196F3",
      width: 2,
    }),
    fill: new Fill({
      color: "rgba(33,150,243,0.15)",
    }),
  }),
});

export const poiSource = new VectorSource();

export const poiLayer = new VectorLayer({
  source: poiSource,
  zIndex: 995,
});

export const GisMap: FunctionComponent<PropsWithChildren> = ({ children }) => {
  // const { setOpen } = useSidebar();

  /**
   * Calling the useGeographic function makes it so the map view uses
   * geographic coordinates (even if the view projection is not geographic).
   *
   * See more at: https://openlayers.org/en/latest/apidoc/module-ol_proj.html#.useGeographic
   */
  useGeographic();

  const gisMap = useGisMap();

  const { viewport, polygonSelectionMode, setHighlightedAccountNumbers } = useMapStore();

  const mapRef = useRef<HTMLDivElement>(null);

  const { poiVisible } = useMapStore();

  const [map, setMap] = useState<Map>({} as Map);

  useGooglePlacesPOI(map ?? null, poiSource, poiVisible);

  // const layer = gisMap.mapManager.getLayerManager().getLayer("water-meters") as VectorLayer<VectorSource>;

  // const source = layer.getSource();

  // const features = source?.getFeatures();

  const drawRef = useRef<Draw | null>(null);

  useEffect(() => {
    // // By default in this page, sidebar is closed
    // setOpen(false);

    if (!mapRef.current) return;

    gisMap.mapManager.init({
      layers: [BaseMapLayerGroup, poiLayer, selectionLayer],
      target: mapRef.current,
      view: new View({
        projection: viewport.projection,
        center: viewport.center,
        zoom: viewport.zoom,
        extent: viewport.extent,
        maxZoom: viewport.maxZoom,
        minZoom: viewport.minZoom,
      }),
    });

    const map = gisMap.mapManager.getMap();

    if (!map) return;

    setMap(map);

    //allow drawing on map
    const draw = new Draw({
      source: selectionSource,
      type: "Polygon",
    });

    draw.on("drawstart", () => {
      selectionSource.clear();
    });

    draw.on("drawend", (e) => {
      const polygon = e.feature.getGeometry();

      const waterMeterLayer = gisMap.mapManager
        .getLayerManager()
        .getLayer("water-meters") as VectorLayer<VectorSource>;

      const waterMeterFeatures = waterMeterLayer.getSource()?.getFeatures() ?? [];

      const accountNumbers: string[] = [];

      waterMeterFeatures.forEach((feature) => {
        const point = feature.getGeometry() as Point;

        if (polygon?.intersectsCoordinate(point.getCoordinates())) {
          accountNumbers.push(feature.get("accountno"));
        }
      });
      console.log(accountNumbers);
      setHighlightedAccountNumbers(accountNumbers);
    });

    drawRef.current = draw;

    // Only add immediately if enabled
    if (polygonSelectionMode) {
      map.addInteraction(draw);
    }

    return () => {
      gisMap.mapManager.destroy();
      mapRef.current = null;
    };
  }, [gisMap.mapManager]);

  useEffect(() => {
    const map = gisMap.mapManager.getMap();
    const draw = drawRef.current;

    if (!map || !draw) return;

    if (polygonSelectionMode) {
      map.addInteraction(draw);
    } else {
      map.removeInteraction(draw);
      selectionSource.clear(); // optional
      setHighlightedAccountNumbers([]); //empty selected water meters
    }
  }, [polygonSelectionMode]);

  useEffect(() => {
    poiLayer.setVisible(poiVisible);

    if (!poiVisible) {
      poiSource.clear();
    }
  }, [poiVisible]);

  return (
    <div ref={mapRef} className="h-full w-full">
      {children}
    </div>
  );
};
