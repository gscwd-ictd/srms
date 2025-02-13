"use client";

import { FunctionComponent } from "react";
import { DrawingTools } from "./DrawingTools";
import { Button } from "@srms/components/ui/Button";
import { Activity, Circle, Layers, Pencil, Ruler, Square } from "lucide-react";
import { Separator } from "@srms/components/ui/Separator";

export const MapToolbar: FunctionComponent = () => {
  return (
    <div className="bg-background fixed top-5 left-1/2 z-10 -translate-x-1/2 space-x-2 rounded-lg">
      <div className="w-full">
        <div className="container mx-auto px-2">
          <div className="flex items-center gap-2 py-2">
            <Button variant="ghost" size="icon" title="Draw Point">
              <Pencil className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" title="Draw Line">
              <Activity className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" title="Draw Polygon">
              <Square className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" title="Draw Circle">
              <Circle className="h-5 w-5" />
            </Button>
            <Separator orientation="vertical" className="h-6" />

            <Button variant="ghost" size="icon" title="Measure Distance">
              <Ruler className="h-5 w-5" />
            </Button>
            <div className="flex-1" />
            <Button variant="ghost" size="icon" title="Layers">
              <Layers className="h-5 w-5" />
            </Button>
            <DrawingTools />
          </div>
        </div>
      </div>
    </div>
  );
};
