import MapComponent from "@srms/components/features/valveMap/MapComponent";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Valve Management",
};

export default async function ValvePage() {
  return (
    <div className="h-screen w-screen">
      <MapComponent />
    </div>
  );
}
