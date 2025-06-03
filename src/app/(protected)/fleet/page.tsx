// import { Collapse } from "@srms/components/Collapse";
import MapComponent from "@srms/components/features/fleetMap/MapComponent";
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
    <div className="h-screen w-screen">
      {/* <Collapse /> */}
      <MapComponent accessToken={accessToken} />
    </div>
  );
}
