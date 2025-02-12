"use client";

import { type LucideIcon } from "lucide-react";

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@srms/components/ui/Sidebar";
import { FunctionComponent } from "react";
import { usePathname } from "next/navigation";

type NavMainProps = {
  items: Array<{
    title: string;
    url: string;
    icon: LucideIcon;
  }>;
};

export const NavMain: FunctionComponent<NavMainProps> = ({ items }) => {
  const pathname = usePathname();

  return (
    <SidebarGroup>
      <SidebarGroupLabel className="font-semibold tracking-widest uppercase">General</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item, index) => (
          <SidebarMenuItem key={index}>
            <SidebarMenuButton tooltip={item.title} isActive={pathname.startsWith(item.url)}>
              {item.icon && <item.icon />}
              <span>{item.title}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
};
