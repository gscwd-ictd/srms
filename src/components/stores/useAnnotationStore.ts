import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { AnnotationTypeOptions } from "../enums/annotationTypeOptions.enum";
import Feature from "ol/Feature";

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
  })),
);
