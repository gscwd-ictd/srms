import { ComponentPropsWithoutRef, FunctionComponent } from 'react';
import { NavProps } from './NavMain';
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@srms/components/ui/Sidebar';

export const NavSecondary: FunctionComponent<NavProps & ComponentPropsWithoutRef<typeof SidebarGroup>> = ({
  items,
  ...props
}) => {
  return (
    <SidebarGroup {...props}>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map(item => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild size="sm">
                <a href={item.url}>
                  <item.icon />
                  <span>{item.title}</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
};
