import { ServiceableAreaRenderFeatures } from "@srms/components/features/addServiceableArea/ServiceableAreaRenderFeatures";
import { ServiceableAreaMap } from "@srms/components/features/addServiceableArea/ServiceableAreaMap";
import { ServiceableAreaMapProvider } from "@srms/components/providers/ServiceableAreaMapProvider";
import { ServiceableAreaSelectFeatures } from "@srms/components/features/addServiceableArea/ServiceableAreaSelectFeatures";
import { ServiceableAreaModifyFeatures } from "@srms/components/features/addServiceableArea/ServiceableAreaModifyFeatures";
import { MapToolbar } from "@srms/components/features/addServiceableArea/MapToolbar";
import { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Service Areas - Legacy",
};

export default function ServiceAreasPage() {
  if (true) {
    redirect("/dashboard");
  }

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
