import BaseLayerPicker from "@srms/components/features/fleetMap/BaseLayerPicker";
import { FleetMap } from "@srms/components/features/fleetMap/FleetMap";
import { LayersCard } from "@srms/components/features/fleetMap/LayersCard";
import { FleetMapProvider } from "@srms/components/providers/FleetMapProvider";
import { Token } from "@srms/components/types";

import { Metadata } from "next";
import { cookies } from "next/headers";

export const metadata: Metadata = {
  title: "Fleet Tracking",
};

export default async function FleetPage() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken") as Token;

  return (
    <FleetMapProvider>
      <FleetMap />

      <BaseLayerPicker />

      <LayersCard accessToken={accessToken} />
    </FleetMapProvider>
  );
}
