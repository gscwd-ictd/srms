import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { AnnotationTypeOptions } from "../enums/annotationTypeOptions.enum";
import Feature from "ol/Feature";
import { Annotation, AnnotationUpdate } from "../types";

export type AnnotationState = {
  selectedAnnotationType: AnnotationTypeOptions;
  setSelectedAnnotationType: (selectedAnnotationType: AnnotationTypeOptions) => void;

  addAnnotationModalOpen: boolean;
  setAddAnnotationModalOpen: (addAnnotationModalOpen: boolean) => void;

  selectedBorderColor: string;
  setSelectedBorderColor: (selectedBorderColor: string) => void;

  selectedFillColor: string;
  setSelectedFillColor: (selectedFillColor: string) => void;

  selectedFeature: Feature | null;
  setSelectedFeature: (feature: Feature | null) => void;

  annotations: Annotation[];
  setAnnotations: (annotations: Annotation[]) => void;

  selectedAnnotationId: string | null;
  setSelectedAnnotationId: (selectedAnnotationId: string | null) => void;

  addAnnotation: (annotation: Annotation) => void;

  updateAnnotation: (id: string, updates: AnnotationUpdate) => void;

  removeAnnotation: (id: string) => void;
};

export const useAnnotationStore = create<AnnotationState>()(
  devtools((set) => ({
    selectedAnnotationType: AnnotationTypeOptions.POLYGON,
    setSelectedAnnotationType: (selectedAnnotationType: AnnotationTypeOptions) =>
      set({ selectedAnnotationType }),

    addAnnotationModalOpen: false,
    setAddAnnotationModalOpen: (addAnnotationModalOpen: boolean) => set({ addAnnotationModalOpen }),

    selectedBorderColor: "#2563eb",
    setSelectedBorderColor: (selectedBorderColor: string) => set({ selectedBorderColor }),

    selectedFillColor: "#0f368a",
    setSelectedFillColor: (selectedFillColor: string) => set({ selectedFillColor }),

    selectedFeature: null,
    setSelectedFeature: (feature: Feature | null) => set({ selectedFeature: feature }),

    annotations: [],
    setAnnotations: (annotations: Annotation[]) => set({ annotations }),

    selectedAnnotationId: null,
    setSelectedAnnotationId: (selectedAnnotationId: string | null) => set({ selectedAnnotationId }),

    addAnnotation: (annotation) =>
      set((state) => ({
        annotations: [...state.annotations, annotation],
      })),

    updateAnnotation: (id, updates) =>
      set((state) => {
        const annotations = state.annotations.map((annotation) => {
          if (annotation.id !== id) return annotation;

          const updated = {
            ...annotation,
            ...updates,
          };

          // Update OpenLayers feature properties

          if (updated.feature) {
            if (updates.title !== undefined) updated.feature.set("title", updates.title);

            if (updates.description !== undefined) updated.feature.set("description", updates.description);

            if (updates.borderColor !== undefined) updated.feature.set("borderColor", updates.borderColor);

            if (updates.fillColor !== undefined) updated.feature.set("fillColor", updates.fillColor);

            if (updates.iconName !== undefined) updated.feature.set("iconName", updates.iconName);

            updated.feature.changed();
          }

          return updated;
        });

        return { annotations };
      }),

    removeAnnotation: (id) =>
      set((state) => ({
        annotations: state.annotations.filter((a) => a.id !== id),
      })),
  })),
);
