import { AppSidebar } from "@srms/components/features/sidebarNavigation/AppSidebar";
import { SidebarInset, SidebarProvider } from "@srms/components/ui/Sidebar";
import { type PropsWithChildren } from "react";
import { redirect } from "next/navigation";
import axios from "axios";
import env from "@srms/utils/env";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

const getSession = async () => {
  const res = await axios.get(`${env.AUTHORIZATION_SERVER_URL}/sessions`);
  return res.data;
};

const setOidcParams = async () => {
  const res = await axios.post<{ url: string }>(`${env.NEXT_PUBLIC_APP_URL}/api/v1/sessions`);
  return res.data;
};

export default async function ProtectedPagesLayout({ children }: Readonly<PropsWithChildren>) {
  const session = await getSession();

  if (!session) {
    const { url } = await setOidcParams();

    if (url) {
      redirect(url);
    }
  }

  return (
    <SidebarProvider>
      <AppSidebar className="z-50" />
      <SidebarInset>{children}</SidebarInset>
    </SidebarProvider>
  );
}
