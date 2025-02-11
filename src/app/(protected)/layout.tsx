import { AppSidebar } from "@srms/components/features/sidebarNavigation/AppSidebar";
import { SidebarInset, SidebarProvider } from "@srms/components/ui/Sidebar";
import { type PropsWithChildren } from "react";

export default function ProtectedPagesLayout({ children }: Readonly<PropsWithChildren>) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>{children}</SidebarInset>
    </SidebarProvider>
  );
}
