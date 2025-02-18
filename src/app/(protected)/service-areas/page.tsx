import { ServiceableAreaRenderFeatures } from "@srms/components/features/addServiceableArea/ServiceableAreaRenderFeatures";
import { ServiceableAreaMap } from "@srms/components/features/addServiceableArea/ServiceableAreaMap";
import { ServiceableAreaMapProvider } from "@srms/components/providers/ServiceableAreaMapProvider";
import { MapToolbar } from "@srms/components/features/addServiceableArea/MapToolbar";
import { ServiceableAreaSelectFeatures } from "@srms/components/features/addServiceableArea/ServiceableAreaSelectFeatures";
import { ServiceableAreaModifyFeatures } from "@srms/components/features/addServiceableArea/ServiceableAreaModifyFeatures";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Service Areas",
};

export default function ServiceAreasPage() {
  return (
    <ServiceableAreaMapProvider>
      <ServiceableAreaMap>
        <MapToolbar />
      </ServiceableAreaMap>

      <ServiceableAreaRenderFeatures />
      <ServiceableAreaSelectFeatures />
      <ServiceableAreaModifyFeatures />
    </ServiceableAreaMapProvider>
  );
}
