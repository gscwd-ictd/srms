import BaseLayerPicker from "@srms/components/features/valveMap/BaseLayerPicker";
import { ValveRenderFeatures } from "@srms/components/features/valveMap/ValveRenderFeatures";
import { ValvesMap } from "@srms/components/features/valveMap/ValvesMap";
import { ValvesMapProvider } from "@srms/components/providers/ValvesMapProvider";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Valve Management",
};

export default async function ValvePage() {
  return (
    <ValvesMapProvider>
      <ValvesMap />

      <BaseLayerPicker />
      <ValveRenderFeatures />
    </ValvesMapProvider>
  );
}
