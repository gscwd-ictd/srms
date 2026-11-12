import { AnnotationsMap } from "@srms/components/features/annotationMap/AnnotationsMap";
import BaseLayerPicker from "@srms/components/features/annotationMap/BaseLayerPicker";
import { AnnotationsMapProvider } from "@srms/components/providers/AnnotationsMapProvider";
import { Metadata } from "next";
import { LayersCard } from "@srms/components/features/annotationMap/LayersCard";

export const metadata: Metadata = {
  title: "Annotations",
};

export default async function AnnotationsPage() {
  return (
    <AnnotationsMapProvider>
      <AnnotationsMap />

      {/* <AnnotationTypePicker /> */}
      <BaseLayerPicker />

      <LayersCard />
    </AnnotationsMapProvider>
  );
}
