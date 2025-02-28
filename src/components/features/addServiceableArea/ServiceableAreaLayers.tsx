"use client";

import { type FunctionComponent, useEffect, useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@srms/components/ui/Sheet";
import { Button } from "@srms/components/ui/Button";
import { useSidebar } from "@srms/components/ui/Sidebar";
import { Calendar, Clock, Ellipsis, House, Layers, Paperclip, Save, Search } from "lucide-react";
import { format } from "date-fns";
import { Card, CardDescription, CardHeader, CardTitle } from "@srms/components/ui/Card";
import { Separator } from "@srms/components/ui/Separator";
import { useIsMobile } from "@srms/components/hooks/useMobile";
import { cn } from "@srms/utils/shadcn";
import { Input } from "@srms/components/ui/Input";
import Image from "next/image";
import { Tooltip, TooltipContent, TooltipTrigger } from "@srms/components/ui/Tooltip";
import { useServiceableAreaMap } from "./contexts/useServiceableMapContext";
import { FeatureManager } from "@srms/lib/mapstudio/featureManager";
import MultiPolygon from "ol/geom/MultiPolygon";

const featureManager = new FeatureManager();

export const SerivceableAreaLayers: FunctionComponent = () => {
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const { open } = useSidebar();

  const isMobile = useIsMobile();

  const serviceableAreaMap = useServiceableAreaMap();

  useEffect(() => {
    if (isMobile) setIsSheetOpen(false);
  }, [isMobile]);

  // @ts-expect-error ServiceableAreaGeoJSON has already been removed
  const handleFocusToFeature = (area: ServiceableAreaGeoJSON) => {
    const feature = featureManager.createFeature(new MultiPolygon(area.boundaries.coordinates), {
      id: area.id,
      name: area.barangay,
      description: area.barangay,
      featureStyles: area.featureStyles,
    });

    const layerExtent = feature.getGeometry()?.getExtent();

    serviceableAreaMap.mapManager.fitToExtent(layerExtent, {
      duration: 1000,
      padding: [50, 50, 50, 50],
      maxZoom: 16,
    });
  };

  return (
    <Sheet modal={false} open={isSheetOpen} onOpenChange={setIsSheetOpen} defaultOpen={isSheetOpen}>
      <SheetTrigger asChild>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              className="h-7 w-7 rounded-md"
              onClick={() => setIsSheetOpen(!isSheetOpen)}
            >
              <Layers />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Layers</TooltipContent>
        </Tooltip>
      </SheetTrigger>
      <SheetContent
        onInteractOutside={(e) => e.preventDefault()}
        side="left"
        className={cn(
          "bg-sidebar z-20 border-0 shadow-none transition-all",
          isMobile ? "left-0" : open ? "left-64" : "left-12",
        )}
      >
        <SheetHeader className="border-b">
          <SheetTitle>Serviceable Areas</SheetTitle>
          <SheetDescription>List of all barangays that are covered within the service area.</SheetDescription>

          <div className="pt-4">
            <div className="relative">
              <Search className="absolute top-2.5 left-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
              <Input type="text" placeholder="Search" className="w-full pl-8" />
            </div>
          </div>
        </SheetHeader>

        <div className="h-full space-y-3 overflow-y-auto">
          <div className="space-y-3 px-4">
            {serviceableAreaMap.serviceableAreas.map((area, index) => {
              return (
                <Card
                  key={index}
                  className="bg-secondary/40 rounded-xlshadow-none hover:bg-secondary relative overflow-clip"
                  role="button"
                  onClick={() => handleFocusToFeature(area)}
                >
                  <CardHeader className="p-2">
                    <div className="flex items-center gap-2">
                      <Image
                        src="/layers/apopong.png"
                        alt={area.barangay}
                        height={100}
                        width={100}
                        className="h-16 w-16 rounded-md border"
                      />
                      <div className="flex w-full items-start justify-between">
                        <div className="w-full space-y-2">
                          <CardTitle>{area.barangay}</CardTitle>
                          <CardDescription className="flex items-center gap-2 text-xs">
                            <section className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {format(area.createdAt, "MMM dd, yyyy")}
                            </section>

                            <Separator orientation="vertical" className="bg-muted-foreground/40 h-3" />

                            <section className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {format(area.createdAt, "hh:mm a")}
                            </section>
                          </CardDescription>
                        </div>

                        <Button variant="ghost" className="absolute top-2 right-2 h-7 w-7">
                          <Ellipsis className="h-5 w-5" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <Separator />
                </Card>
              );
            })}
          </div>
        </div>

        <SheetFooter className="border-t">
          <div className="flex items-center justify-end space-x-1">
            <Button className="h-7 w-7" variant="ghost">
              <Save className="h-5 w-5" />
            </Button>
            <Button className="h-7 w-7" variant="ghost">
              <House className="h-5 w-5" />
            </Button>
            <Button className="h-7 w-7" variant="ghost">
              <Paperclip className="h-5 w-5" />
            </Button>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};
