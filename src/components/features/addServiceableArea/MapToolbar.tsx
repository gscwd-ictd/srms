"use client";

import { FunctionComponent } from "react";
import { DrawingTools } from "./DrawingTools";
import { Button } from "@srms/components/ui/Button";
import { Pencil } from "lucide-react";
import { useServiceableAreaMap } from "./contexts/useServiceableMapContext";
import { createFeatureStyles } from "./utils/createFeatureStyles";
// import { ServiceableAreaLayers } from "./ServiceableAreaLayers";
// import { useSidebar } from "@srms/components/ui/Sidebar";

export const MapToolbar: FunctionComponent = () => {
  const serviceableArea = useServiceableAreaMap();

  const styles = createFeatureStyles(serviceableArea.properties);

  // const layerSidebar = useSidebar();

  return (
    <div className="bg-background fixed top-5 left-1/2 z-10 -translate-x-1/2 space-x-1 rounded-2xl">
      <div className="flex items-center gap-2 p-2">
        {/* <ServiceableAreaLayers /> */}

        <Button
          variant="ghost"
          size="icon"
          title="Draw Point"
          className="rounded-lg"
          onClick={() =>
            serviceableArea.mapManager?.getInteractionManager().enableDrawing(
              {
                type: "Polygon",
                drawStyle: styles.drawStyle,
                snapConfig: styles.snapping,
                freehand: styles.freehand,
              },
              (coords) => {
                console.log(coords);
              },
            )
          }
        >
          <Pencil className="h-5 w-5" />
        </Button>

        <DrawingTools />
      </div>
    </div>
  );
};
