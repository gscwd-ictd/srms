import { ServiceableAreas } from "@srms/components/blocks/serviceableAreas/ServiceableAreas";
import { ServiceableAreaMap } from "@srms/components/features/addServiceableArea/ServiceableAreaMap";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Service Areas",
};

export default function ServiceAreasPage() {
  return (
    <ServiceableAreaMap>
      <ServiceableAreas />
    </ServiceableAreaMap>
  );
}
