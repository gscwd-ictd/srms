import { ServiceableAreaLayers } from "@srms/components/features/addServiceableArea/ServiceableAreaLayers";
import { ServiceableAreaMap } from "@srms/components/features/addServiceableArea/ServiceableAreaMap";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Service Areas",
};

export default function ServiceAreasPage() {
  return (
    <ServiceableAreaLayers>
      <ServiceableAreaMap></ServiceableAreaMap>
    </ServiceableAreaLayers>
  );
}
