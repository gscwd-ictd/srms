import { type PropsWithChildren } from "react";
import { AppSidebar } from "@srms/components/features/sidebarNavigation/AppSidebar";
import { SidebarInset, SidebarProvider } from "@srms/components/ui/Sidebar";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

export default async function ProtectedPagesLayout({ children }: Readonly<PropsWithChildren>) {
  return (
    <SidebarProvider>
      <AppSidebar className="z-50" />
      {/** TODO: Padding is temporary only */}
      <SidebarInset className="px-40 py-10">{children}</SidebarInset>
    </SidebarProvider>
  );
}
