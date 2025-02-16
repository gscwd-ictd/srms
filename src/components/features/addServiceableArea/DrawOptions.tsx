"use client";

import { type FunctionComponent } from "react";
import { Button } from "@srms/components/ui/Button";
import { Pencil } from "lucide-react";
import { useServiceableAreaMap } from "./contexts/useServiceableMapContext";
import { createFeatureStyles } from "./utils/createFeatureStyles";

export const DrawOptions: FunctionComponent = () => {
  const serviceableArea = useServiceableAreaMap();

  const styles = createFeatureStyles(serviceableArea.properties);

  return (
    <Button
      variant="ghost"
      size="icon"
      title="Draw Point"
      className="h-7 w-7 rounded-lg"
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
  );
};
