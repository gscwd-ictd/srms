'use client';

import * as React from 'react';
import {
  AudioWaveform,
  BookOpen,
  CircleHelp,
  Command,
  Droplets,
  Frame,
  GalleryVerticalEnd,
  LayoutDashboard,
  Map,
  MessageSquareDot,
  PieChart,
  Send,
  Settings,
  // SquareDashedMousePointer,
} from 'lucide-react';

import { NavMain } from './NavMain';
import { NavUser } from './NavUser';
import { TeamSwitcher } from './TeamSwitcher';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  SidebarSeparator,
} from '@srms/components/ui/Sidebar';
import { NavSecondary } from './NavSecondary';

// This is sample data.
const data = {
  user: {
    name: 'shadcn',
    email: 'm@example.com',
    avatar: 'https://github.com/shadcn.png',
  },
  teams: [
    {
      name: 'Flowscape',
      logo: GalleryVerticalEnd,
      plan: 'Smart water solutions',
    },
    {
      name: 'Acme Corp.',
      logo: AudioWaveform,
      plan: 'Startup',
    },
    {
      name: 'Evil Corp.',
      logo: Command,
      plan: 'Free',
    },
  ],
  navMain: [
    {
      title: 'Dashboard',
      url: '/dashboard',
      icon: LayoutDashboard,
    },
    {
      title: 'Notifications',
      url: '/notifications',
      icon: MessageSquareDot,
      count: 4,
    },
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
      title: 'Operations',
      url: '/operations',
      icon: Droplets,
    },
    {
      title: 'Settings',
      url: '/settings',
      icon: Settings,
    },
  ],
  navSecondary: [
    {
      title: 'Documentation',
      url: '#',
      icon: BookOpen,
    },
    {
      title: 'Feedback',
      url: '#',
      icon: Send,
    },
    {
      title: 'Help',
      url: '#',
      icon: CircleHelp,
    },
  ],
  projects: [
    {
      name: 'Design Engineering',
      url: '#',
      icon: Frame,
    },
    {
      name: 'Sales & Marketing',
      url: '#',
      icon: PieChart,
    },
    {
      name: 'Travel',
      url: '#',
      icon: Map,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader className="flex h-16 w-full items-center justify-center">
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarSeparator className="mx-0" />
      <SidebarContent className="flex flex-col justify-between">
        <NavMain items={data.navMain} />
        <NavSecondary items={data.navSecondary} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
