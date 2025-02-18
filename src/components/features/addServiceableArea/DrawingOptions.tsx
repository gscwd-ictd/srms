"use client";

import { Button } from "@srms/components/ui/Button";
import { Separator } from "@srms/components/ui/Separator";
import { ChevronLeft, ChevronRight, CircleSlash2, Eraser, PenLine } from "lucide-react";
import { useState, type FunctionComponent } from "react";
import { useServiceableAreaMap } from "./contexts/useServiceableMapContext";
import { createFeatureStyles } from "./utils/createFeatureStyles";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@srms/components/ui/Tooltip";
import { AddBarangayDialog } from "./AddBarangayDialog";
import { Coordinate } from "ol/coordinate";

type DrawingOptionsProps = {
  open: boolean;
  onOpenChange: (state: boolean) => void;
};

export const DrawingOptions: FunctionComponent<DrawingOptionsProps> = ({ open, onOpenChange }) => {
  const [boundaries, setBoundaries] = useState<Coordinate[][][]>([]);

  const [disabled, setDisabled] = useState(true);

  const serviceableArea = useServiceableAreaMap();

  const styles = createFeatureStyles(serviceableArea.properties);

  const handleStartDrawing = () => {
    serviceableArea.mapManager.getInteractionManager().enableDrawing(
      {
        type: "Polygon",
        drawStyle: styles.drawStyle,
        snapConfig: styles.snapping,
        freehand: styles.freehand,
      },
      (coords) => {
        if (coords) {
          // Create a multipolygon from polygon/s
          setBoundaries((prev) => [...prev, [coords]]);
          setDisabled(false);
        }
      },
    );
  };

  const handleCancelDrawing = () => {
    serviceableArea.mapManager.getInteractionManager().disableDrawing();
  };

  const handleFinishDrawing = () => {
    serviceableArea.mapManager.getInteractionManager().disableDrawing();
  };

  const handleClearDrawing = () => {
    serviceableArea.mapManager.getInteractionManager().clear();
    setBoundaries([]);
    setDisabled(true);
  };

  return (
    <>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" className="h-7 w-7 rounded-md" onClick={() => onOpenChange(!open)}>
            {open ? <ChevronRight /> : <ChevronLeft />}
          </Button>
        </TooltipTrigger>
        <TooltipContent>Drawing Options</TooltipContent>
      </Tooltip>

      {open && (
        <>
          <Separator orientation="vertical" className="bg-muted-foreground/40 h-6" />

          <TooltipProvider delayDuration={500}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" className="h-7 w-7" onClick={handleStartDrawing}>
                  <PenLine />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Start Drawing</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" className="h-7 w-7" onClick={handleCancelDrawing}>
                  <CircleSlash2 />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Cancel Drawing</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" className="h-7 w-7" onClick={handleClearDrawing}>
                  <Eraser />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Clear Drawing</TooltipContent>
            </Tooltip>

            <AddBarangayDialog
              boundaries={boundaries}
              disabled={disabled}
              setDisabled={setDisabled}
              onClickAction={handleFinishDrawing}
            />
          </TooltipProvider>
        </>
      )}
    </>
  );
};
