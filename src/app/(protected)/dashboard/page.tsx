import { ServiceableAreaMap } from "@srms/components/blocks/serviceableAreas/ServiceableAreaMap";
import { ServiceableAreas } from "@srms/components/blocks/serviceableAreas/ServiceableAreas";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default function DashboardPage() {
  return (
    <ServiceableAreaMap>
      <ServiceableAreas />
    </ServiceableAreaMap>
  );
}
