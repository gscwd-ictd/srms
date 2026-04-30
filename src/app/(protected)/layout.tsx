import { type PropsWithChildren } from "react";
// import { AppSidebar } from "@srms/components/features/sidebarNavigation/AppSidebar";
import { SidebarInset, SidebarProvider } from "@srms/components/ui/Sidebar";
import { Toaster } from "@srms/components/ui/Sonner";
import { AuthProvider } from "@srms/components/providers/AuthProvider";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

export default async function ProtectedPagesLayout({ children }: Readonly<PropsWithChildren>) {
  return (
    <>
      <Toaster />
      <AuthProvider>
        <SidebarProvider>
          {/* Temporarily commented the sidebar */}
          {/* <AppSidebar className="z-50" /> */}
          <SidebarInset>{children}</SidebarInset>
        </SidebarProvider>
      </AuthProvider>
    </>
  );
}
