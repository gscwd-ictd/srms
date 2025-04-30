import MapComponent from "@srms/components/features/map/MapComponent";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Fleet Tracking",
};

export default async function FleetPage() {
  return <MapComponent />;
}
