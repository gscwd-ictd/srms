"use client";

import { type LucideIcon } from "lucide-react";
import { SidebarMenuBadge, SidebarMenuButton, SidebarMenuItem } from "@srms/components/ui/Sidebar";
import { FunctionComponent, useContext } from "react";
import { usePathname, useRouter } from "next/navigation";
import { AbilityContext } from "@srms/app/(protected)/dashboard/contexts/AbilityContext";

export type NavProps = {
  items: Array<{
    title: string;
    url: string;
    icon: LucideIcon;
    count?: number | undefined;
    slug: string;
  }>;
};

export const NavMain: FunctionComponent<NavProps> = ({ items }) => {
  const pathname = usePathname();

  const router = useRouter();

  const ability = useContext(AbilityContext);

  return (
    <>
      {items.map((item, index) => {
        return (
          ability?.can("access", `${item.slug}`) && (
            <SidebarMenuItem key={index}>
              <SidebarMenuButton
                tooltip={item.title}
                isActive={pathname.startsWith(item.url)}
                onClick={() => router.push(item.url)}
              >
                {item.icon && <item.icon />}
                <span>{item.title}</span>
                {item.count && (
                  <SidebarMenuBadge className="bg-destructive text-white">{item.count}</SidebarMenuBadge>
                )}
              </SidebarMenuButton>
            </SidebarMenuItem>
          )
        );
      })}
    </>
  );
};
