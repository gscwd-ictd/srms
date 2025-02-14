"use client";

import { Button } from "@srms/components/ui/Button";
import { Separator } from "@srms/components/ui/Separator";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarInset,
  SidebarProvider,
} from "@srms/components/ui/Sidebar";
import { PenLine, SlidersHorizontal } from "lucide-react";

import { CSSProperties, PropsWithChildren, type FunctionComponent } from "react";

export const ServiceableAreaLayers: FunctionComponent<PropsWithChildren> = ({ children }) => {
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "16rem",
          "--sidebar-width-mobile": "16rem",
        } as CSSProperties
      }
    >
      <Sidebar className="absolute" collapsible="offcanvas">
        <SidebarHeader className="h-16">
          <div className="flex h-full w-full items-center justify-end">
            <Button variant="ghost">
              <PenLine />
            </Button>

            <Button variant="ghost">
              <SlidersHorizontal />
            </Button>
          </div>
        </SidebarHeader>

        <Separator />

        <SidebarContent className="space-y-4 py-4">
          <div className="bg-secondary h-14 w-full"></div>

          <Separator />

          <div className="bg-secondary h-14 w-full"></div>

          <Separator />

          <div className="bg-secondary h-14 w-full"></div>

          <Separator />

          <div className="bg-secondary h-14 w-full"></div>

          <Separator />

          <div className="bg-secondary h-14 w-full"></div>

          <Separator />
        </SidebarContent>
      </Sidebar>

      <SidebarInset>{children}</SidebarInset>
    </SidebarProvider>
  );
};
