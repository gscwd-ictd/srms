import { AppSidebar } from "@srms/components/features/sidebarNavigation/AppSidebar";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default function DashboardPage() {
  return (
    <>
      <AppSidebar />
    </>
  );
}
