"use client";

import { type FunctionComponent } from "react";
// import { ValveLayers } from "./ValveLayers";
import { Separator } from "@srms/components/ui/Separator";
import { TooltipProvider } from "@srms/components/ui/Tooltip";

export const MapToolbar: FunctionComponent = () => {
  return (
    <div
      className={
        "bg-background fixed top-5 left-1/2 z-10 flex w-72 w-[calc(var(--spacing)*34)] -translate-x-1/2 items-center justify-center space-x-1 rounded-xl transition-all"
      }
    >
      <div className="flex items-center gap-2 p-2">
        <TooltipProvider>
          <Separator orientation="vertical" className="bg-muted-foreground/40 h-6" />

          {/* <ValveLayers /> */}

          <Separator orientation="vertical" className="bg-muted-foreground/40 h-6" />
        </TooltipProvider>
      </div>
    </div>
  );
};
