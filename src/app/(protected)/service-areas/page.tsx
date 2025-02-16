import { ServiceableAreaMap } from "@srms/components/features/addServiceableArea/ServiceableAreaMap";
import { ServiceableAreaMapProvider } from "@srms/components/providers/ServiceableAreaMapProvider";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Service Areas",
};

export default function ServiceAreasPage() {
  return (
    <ServiceableAreaMapProvider>
      <ServiceableAreaMap></ServiceableAreaMap>
    </ServiceableAreaMapProvider>
  );
}
