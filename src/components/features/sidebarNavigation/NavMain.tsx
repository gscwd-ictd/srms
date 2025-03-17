'use client';

import { type LucideIcon } from 'lucide-react';

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@srms/components/ui/Sidebar';
import { FunctionComponent } from 'react';
import { usePathname, useRouter } from 'next/navigation';

export type NavProps = {
  items: Array<{
    title: string;
    url: string;
    icon: LucideIcon;
    count?: number | undefined;
  }>;
};

export const NavMain: FunctionComponent<NavProps> = ({ items }) => {
  const pathname = usePathname();

  const router = useRouter();

  return (
    <SidebarGroup>
      <SidebarGroupLabel className="font-semibold tracking-widest uppercase">General</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item, index) => (
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
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
};
