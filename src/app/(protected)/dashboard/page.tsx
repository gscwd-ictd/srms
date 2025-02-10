import { WebMap } from "@srms/components/features/WebMap";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default function DashboardPage() {
  return <WebMap />;
}
