"use client";

import * as React from "react";
import {
  BookOpen,
  CircleGauge,
  Droplets,
  LayoutDashboard,
  MessageSquareDot,
  Settings,
  Wrench,
  Map,
} from "lucide-react";

import { NavMain } from "./NavMain";
import { NavUser } from "./NavUser";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarSeparator,
} from "@srms/components/ui/Sidebar";
import { NavSecondary } from "./NavSecondary";
import { useUserStore } from "@srms/components/stores/useUserStore";
import { usePathname, useRouter } from "next/navigation";

// This is sample data.
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "https://github.com/shadcn.png",
  },
  team: {
    name: "Flowscape",
    logo: Droplets,
    plan: "Smart water solutions",
  },
  // teams: [
  //   {
  //     name: "Flowscape",
  //     logo: GalleryVerticalEnd,
  //     plan: "Smart water solutions",
  //   },
  // ],
  navMain: [
    /**
     * This part has been moved to legacy routes
     *
     *  {
     *    title: "Service Areas",
     *    url: "/service-areas",
     *    icon: SquareDashedMousePointer,
     *  },
     */

    {
      title: "GIS",
      url: "/gis",
      icon: Map,
      slug: "gis",
    },
    {
      title: "SRMS",
      url: "/srms",
      icon: Wrench,
      slug: "srms",
    },
    {
      title: "Valve",
      url: "/valve",
      icon: CircleGauge,
      slug: "valve",
    },
    {
      title: "Settings",
      url: "/settings",
      icon: Settings,
      slug: "settings",
    },
  ],
  navSecondary: [
    {
      title: "Documentation",
      url: "#",
      icon: BookOpen,
      slug: "documentation",
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { userDetails } = useUserStore();

  const pathname = usePathname();

  const router = useRouter();

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader className="flex h-16 w-full items-center justify-center">
        {/* <TeamSwitcher teams={data.teams} /> */}
        <div className="grid grid-cols-[2.5rem_auto] justify-stretch">
          <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
            {data.team?.logo && <data.team.logo className="size-4" />}
          </div>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-semibold">2Big</span>
            <span className="truncate text-xs">Operations Monitoring & Management</span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarSeparator className="mx-0" />
      <SidebarContent className="flex flex-col justify-between">
        <SidebarGroup>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                tooltip="Dashboard"
                isActive={pathname.startsWith("/dashboard")}
                onClick={() => router.push("/dashboard")}
              >
                <LayoutDashboard />
                <span>Dashboard</span>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton
                tooltip="Notification"
                isActive={pathname.startsWith("/notification")}
                onClick={() => router.push("/notification")}
              >
                <MessageSquareDot />
                <span>Notification</span>

                <SidebarMenuBadge className="bg-destructive text-white">3</SidebarMenuBadge>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <NavMain items={data.navMain} />
          </SidebarMenu>
        </SidebarGroup>
        <NavSecondary items={data.navSecondary} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={userDetails} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
