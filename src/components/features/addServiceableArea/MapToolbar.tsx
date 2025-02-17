"use client";

import { cn } from "@srms/utils/shadcn";
import { useState, type FunctionComponent } from "react";
import { DrawingTools } from "./DrawingTools";
import { SerivceableAreaLayers } from "./ServiceableAreaLayers";
import { Separator } from "@srms/components/ui/Separator";
import { DrawingOptions } from "./DrawingOptions";
import { TooltipProvider } from "@srms/components/ui/Tooltip";

export const MapToolbar: FunctionComponent = () => {
  const [drawingOptionsOpen, setDrawingOptionsOpen] = useState(false);

  return (
    <div
      className={cn(
        "bg-background fixed top-5 left-1/2 z-10 flex -translate-x-1/2 items-center justify-center space-x-1 rounded-xl transition-all",
        drawingOptionsOpen ? "w-72" : "w-[calc(var(--spacing)*34)]",
      )}
    >
      <div className="flex items-center gap-2 p-2">
        <TooltipProvider>
          <DrawingOptions open={drawingOptionsOpen} onOpenChange={setDrawingOptionsOpen} />

          <Separator orientation="vertical" className="bg-muted-foreground/40 h-6" />

          <SerivceableAreaLayers />

          <Separator orientation="vertical" className="bg-muted-foreground/40 h-6" />

          <DrawingTools />
        </TooltipProvider>
      </div>
    </div>
  );
};
