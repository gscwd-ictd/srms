import { AdminMonitMap } from "@srms/components/features/adminMap/AdminMonitMap";
import BaseLayerPicker from "@srms/components/features/adminMap/BaseLayerPicker";
import { LayersCard } from "@srms/components/features/adminMap/LayersCard";
import { AdminMonitMapProvider } from "@srms/components/providers/AdminMonitMapProvider";

import { Metadata } from "next";
// import { cookies } from "next/headers";

export const metadata: Metadata = {
  title: "Admin Monitoring",
};

export default async function AdminMonitoringPage() {
  // const cookieStore = await cookies();
  // const accessToken = cookieStore.get("accessToken") as Token;

  return (
    <AdminMonitMapProvider>
      <AdminMonitMap />
      <BaseLayerPicker />
      <LayersCard />
    </AdminMonitMapProvider>
  );
}
