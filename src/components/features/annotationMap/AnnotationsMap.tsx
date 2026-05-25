/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { type PropsWithChildren, type FunctionComponent, useRef, useEffect } from "react";
import { useGeographic } from "ol/proj";
import View from "ol/View";
import { BaseMapLayerGroup } from "./BaseMapLayerGroup";
import { useMapStore } from "@srms/components/stores/useMapStore";
import { useAnnotationsMap } from "./contexts/useAnnotationsMapContext";
import { annotationSources, circleLayer, lineLayer, pointLayer, polygonLayer } from "./AnnotationsLayer";
import Draw from "ol/interaction/Draw";
import { useAnnotationStore } from "@srms/components/stores/useAnnotationStore";
import { AnnotationTypeOptions } from "@srms/components/enums/annotationTypeOptions.enum";
import Select from "ol/interaction/Select";
import Modify from "ol/interaction/Modify";
import { click } from "ol/events/condition";
import { Style, Stroke, Fill, Circle as CircleStyle } from "ol/style";
import { getArea } from "ol/sphere";

export const AnnotationsMap: FunctionComponent<PropsWithChildren> = ({ children }) => {
  // const { setOpen } = useSidebar();

  /**
   * Calling the useGeographic function makes it so the map view uses
   * geographic coordinates (even if the view projection is not geographic).
   *
   * See more at: https://openlayers.org/en/latest/apidoc/module-ol_proj.html#.useGeographic
   */
  useGeographic();

  const annotationsMap = useAnnotationsMap();

  const {
    selectedAnnotationType,
    selectedBorderColor,
    selectedFillColor,
    setSelectedFeature,
    setSelectedBorderColor,
    setSelectedFillColor,
    setAddAnnotationModalOpen,
  } = useAnnotationStore();

  const { viewport } = useMapStore();

  const mapRef = useRef<HTMLDivElement>(null);

  const selectRef = useRef<Select | null>(null); // store select interaction in ref to access it in multiple useEffects

  useEffect(() => {
    if (!selectedBorderColor) setSelectedBorderColor("#2563eb");
    if (!selectedFillColor) setSelectedFillColor("#0f368a");
  }, [selectedBorderColor, selectedFillColor]);

  useEffect(() => {
    if (!mapRef.current) return;

    annotationsMap.mapManager.init({
      layers: [BaseMapLayerGroup, polygonLayer, lineLayer, pointLayer, circleLayer],
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

    const map = annotationsMap.mapManager.getMap();

    if (!map) return;

    polygonLayer.setZIndex(999);
    lineLayer.setZIndex(999);
    pointLayer.setZIndex(999);
    circleLayer.setZIndex(999);

    return () => {
      annotationsMap.mapManager.destroy();
      mapRef.current = null;
    };
  }, [annotationsMap.mapManager]);

  useEffect(() => {
    const map = annotationsMap.mapManager.getMap();

    if (!map) return;

    // SELECTION MODE
    if (selectedAnnotationType === AnnotationTypeOptions.NONE) {
      const selectedStyle = new Style({
        stroke: new Stroke({
          color: "#00ffff",
          width: 4,
        }),
        fill: new Fill({
          color: "rgba(0,255,255,0.2)",
        }),
        image: new CircleStyle({
          radius: 8,
          fill: new Fill({
            color: "#00ffff",
          }),
        }),
      });

      const select = new Select({
        condition: click,
        layers: [polygonLayer, lineLayer, pointLayer, circleLayer],
        multi: false,
        style: selectedStyle,
      });

      selectRef.current = select;

      const modify = new Modify({
        features: select.getFeatures(),
      });

      map.addInteraction(select);
      map.addInteraction(modify);

      select.on("select", (e) => {
        const features = e.selected;

        if (!features.length) return;

        // prioritize smallest geometry
        const selectedFeature = features.sort((a, b) => {
          const geomA = a.getGeometry();
          const geomB = b.getGeometry();

          let areaA = Infinity;
          let areaB = Infinity;

          if (geomA?.getType() === "Polygon") {
            areaA = getArea(geomA);
          }

          if (geomB?.getType() === "Polygon") {
            areaB = getArea(geomB);
          }

          return areaA - areaB;
        })[0];

        console.log("Actually selected:", selectedFeature);

        select.getFeatures().clear();
        select.getFeatures().push(selectedFeature!);
      });

      return () => {
        map.removeInteraction(select);
        map.removeInteraction(modify);
      };
    } else {
      // DRAWING MODE
      const draw = new Draw({
        source: annotationSources[selectedAnnotationType],
        type: selectedAnnotationType,
      });

      map.addInteraction(draw);

      draw.on("drawend", (event) => {
        // console.log(annotationSources[selectedAnnotationType].getFeatures());
        const feature = event.feature;

        feature.set("title", "Default Title");
        feature.set("description", "No description");
        feature.set("borderColor", selectedBorderColor);
        feature.set("fillColor", selectedFillColor);

        feature.setStyle(
          new Style({
            stroke: new Stroke({
              color: selectedBorderColor,
              width: 2,
            }),
            fill: new Fill({
              color: `${selectedFillColor}33`, // ~20% opacity
            }),
          }),
        );

        // Store feature for modal editing
        setSelectedFeature(feature);
        console.log("Drawn feature:", feature);

        // Open modal only after drawing completes
        setAddAnnotationModalOpen(true);
      });

      return () => {
        map.removeInteraction(draw);
      };
    }
  }, [selectedAnnotationType, selectedBorderColor, selectedFillColor]);

  useEffect(() => {
    const polygonSource = annotationSources["Polygon"];

    const logFeatures = () => {
      // const features = polygonSource.getFeatures();
      // if (features.length > 0) {
      //   console.log("Has polygons");
      //   console.log(features);
      // } else {
      //   console.log("No polygons");
      // }
    };

    polygonSource.on("addfeature", logFeatures);
    polygonSource.on("removefeature", logFeatures);

    // initial check
    logFeatures();

    return () => {
      polygonSource.un("addfeature", logFeatures);
      polygonSource.un("removefeature", logFeatures);
    };
  }, []);

  //delete selected feature on delete key press
  useEffect(() => {
    const handleDelete = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      if (e.key !== "Delete") return;

      const selectedFeatures = selectRef.current?.getFeatures();

      if (!selectedFeatures?.getLength()) return;

      const feature = selectedFeatures.item(0);

      if (!feature) return;

      // Find which source contains the feature
      Object.values(annotationSources).forEach((source) => {
        if (source.hasFeature(feature)) {
          source.removeFeature(feature);
        }
      });

      selectedFeatures.clear();
    };

    window.addEventListener("keydown", handleDelete);

    return () => {
      window.removeEventListener("keydown", handleDelete);
    };
  }, []);

  return (
    <div ref={mapRef} className="h-full w-full">
      {children}
    </div>
  );
};
