import BaseLayerPicker from "@srms/components/features/gisMap/BaseLayerPicker";
import { FleetMap } from "@srms/components/features/gisMap/GisMap";
import { LayersCard } from "@srms/components/features/gisMap/LayersCard";
import { FleetMapProvider } from "@srms/components/providers/FleetMapProvider";
import { Token } from "@srms/components/types";

import { Metadata } from "next";
import { cookies } from "next/headers";

export const metadata: Metadata = {
  title: "Fleet Tracking",
};

export default async function FleetPage() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("tsAccessToken") as Token;

  return (
    <FleetMapProvider>
      <FleetMap />

      <BaseLayerPicker />

      <LayersCard accessToken={accessToken} />
    </FleetMapProvider>
  );
}
