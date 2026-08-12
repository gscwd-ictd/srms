import BaseLayerPicker from "@srms/components/features/gisMap/BaseLayerPicker";

import { GisMap } from "@srms/components/features/gisMap/GisMap";
import { LayersCard } from "@srms/components/features/gisMap/LayersCard";
import MapToolbar from "@srms/components/features/gisMap/MapToolbar";
import { GisMapProvider } from "@srms/components/providers/GisMapProvider";
// import { Token } from "@srms/components/types";
import { Metadata } from "next";
import { cookies } from "next/headers";

export const metadata: Metadata = {
  title: "Web GIS",
};

export default async function GisPage() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("tsAccessToken")?.value ?? null;

  return (
    <GisMapProvider initialAccessToken={accessToken}>
      <GisMap />
      <BaseLayerPicker />

      <LayersCard accessToken={accessToken} />

      <MapToolbar />
    </GisMapProvider>
  );
}
