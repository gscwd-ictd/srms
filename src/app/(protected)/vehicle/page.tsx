import MapComponent from "@srms/components/features/map/MapComponent";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Vehicle",
};

export default async function VehiclePage() {
  return <MapComponent />;
}
