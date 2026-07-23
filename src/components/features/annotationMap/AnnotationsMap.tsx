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
import { Style, Stroke, Fill, Icon } from "ol/style";
import { getArea } from "ol/sphere";
import CircleStyle from "ol/style/Circle";
import { annotationIconMap } from "@srms/utils/annotationIcons";
import Feature from "ol/Feature";

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
    addAnnotation,
    annotations,
    setSelectedAnnotationId,
    removeAnnotation,
  } = useAnnotationStore();

  const { viewport } = useMapStore();

  const mapRef = useRef<HTMLDivElement>(null);

  const selectRef = useRef<Select | null>(null); // store select interaction in ref to access it in multiple useEffects

  useEffect(() => {
    if (!selectedBorderColor) setSelectedBorderColor("#2563eb");
    if (!selectedFillColor) setSelectedFillColor("#1e54c8");
  }, [selectedBorderColor, selectedFillColor]);

  useEffect(() => {
    console.log(annotations);
  }, [annotations]);

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
      const select = new Select({
        condition: click,
        layers: [polygonLayer, lineLayer, pointLayer, circleLayer],
        multi: false,
        style: (feature) => {
          const borderColor = feature.get("borderColor") ?? "#2563eb";
          const fillColor = feature.get("fillColor") ?? "#1e62f6";

          const geometryType = feature.getGeometry()?.getType();

          const transparentFill = (color: string) => {
            if (color.startsWith("rgba")) return color;

            if (color.startsWith("#") && color.length === 7) {
              return `${color}33`;
            }

            return color;
          };

          if (geometryType === "Point") {
            return [
              new Style({
                image: new CircleStyle({
                  radius: 16, // slightly larger
                  fill: new Fill({
                    color: fillColor,
                  }),
                  stroke: new Stroke({
                    color: "#FFD700", // yellow selection border
                    width: 4,
                  }),
                }),
              }),
              new Style({
                image: new Icon({
                  src: annotationIconMap[feature.get("iconName") ?? "default"],
                  scale: 0.8,
                  anchor: [0.5, 0.5],
                  anchorXUnits: "fraction",
                  anchorYUnits: "fraction",
                }),
              }),
            ];
          }

          return new Style({
            stroke: new Stroke({
              color: borderColor,
              width: 3,
            }),
            fill: new Fill({
              color: transparentFill(fillColor),
            }),
          });
        },
      });

      selectRef.current = select;

      const applySelection = (feature: Feature) => {
        const selected = select.getFeatures();

        selected.clear();
        selected.push(feature);

        setSelectedFeature(feature);

        setSelectedAnnotationId(feature.get("annotationId"));

        setSelectedBorderColor(feature.get("borderColor") ?? "#2563eb");

        setSelectedFillColor(feature.get("fillColor") ?? "#1e62f6");

        setAddAnnotationModalOpen(true);

        // const geometry = feature.getGeometry();

        // if (geometry) {
        //   //zoom on feature selected
        //   map.getView().fit(geometry.getExtent(), {
        //     duration: 300,
        //     maxZoom: 18,
        //     padding: [80, 80, 80, 80],
        //   });
        // }
      };

      annotationsMap.registerSelectAnnotation?.(applySelection);
      const modify = new Modify({
        features: select.getFeatures(),
      });

      map.addInteraction(select);
      map.addInteraction(modify);

      select.on("select", (e) => {
        const features = e.selected;

        if (!features) return;

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

        select.getFeatures().clear();
        if (selectedFeature) {
          applySelection(selectedFeature);
        } else {
          setAddAnnotationModalOpen(false); //close modal
        }
      });

      return () => {
        annotationsMap.registerSelectAnnotation?.(() => {});
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
        const dateCreated = new Date() as unknown as string;
        const newId = `${Date.now()}-${Math.random().toString(36).slice(2)}`;

        //set features of annotation
        feature.set("title", "Untitled");
        feature.set("description", "No description");
        feature.set("borderColor", selectedBorderColor);
        feature.set("fillColor", selectedFillColor);
        feature.set("annotationId", newId);
        feature.set("dateCreated", dateCreated);

        //create annotation object to store in state
        const annotation = {
          id: newId,
          title: "Untitled",
          description: "No description",
          borderColor: selectedBorderColor,
          fillColor: selectedFillColor,
          feature,
          dateCreated,
        };

        addAnnotation(annotation);
        setSelectedAnnotationId(newId);

        // Store feature for modal editing
        setSelectedFeature(feature);

        // Open modal only after drawing completes
        setAddAnnotationModalOpen(true);
      });

      return () => {
        map.removeInteraction(draw);
      };
    }
  }, [selectedAnnotationType]);

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

      const annotationId = feature.get("annotationId");

      // Find which source contains the feature
      Object.values(annotationSources).forEach((source) => {
        if (source.hasFeature(feature)) {
          source.removeFeature(feature);
        }
      });

      if (annotationId) {
        removeAnnotation(annotationId);
      }

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
