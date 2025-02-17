"use client";

import { useEffect, type FunctionComponent } from "react";
import { Label } from "@srms/components/ui/Label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@srms/components/ui/Select";
import { Slider } from "@srms/components/ui/Slider";
import { Highlighter, PaintBucket, PaintRoller, PenLine, Square, SquareDashed } from "lucide-react";
import { ColorPickerPopover } from "./ColorPickerPopover";
import { useServiceableAreaMap } from "./contexts/useServiceableMapContext";

export const StylingTool: FunctionComponent = () => {
  const serviceableAreaMap = useServiceableAreaMap();

  return (
    <>
      <section className="flex items-center justify-between">
        <Label className="flex items-center gap-2 text-xs">
          <PaintBucket className="h-4 w-4" />
          <span>Fill Color</span>
        </Label>
        <ColorPickerPopover
          defaultColor={serviceableAreaMap.properties.fillColor}
          onUpdateColor={(color) => {
            serviceableAreaMap.mapManager.getInteractionManager().disableDrawing();
            serviceableAreaMap.setProperties?.({ ...serviceableAreaMap.properties, fillColor: color });
          }}
        />
      </section>

      <section className="flex items-center justify-between">
        <Label className="flex items-center gap-2 text-xs">
          <PaintRoller className="h-4 w-4" />
          <span>Stroke Color</span>
        </Label>
        <ColorPickerPopover
          defaultColor={serviceableAreaMap.properties.strokeColor}
          onUpdateColor={(color) => {
            serviceableAreaMap.mapManager.getInteractionManager().disableDrawing();
            serviceableAreaMap.setProperties?.({ ...serviceableAreaMap.properties, strokeColor: color });
          }}
        />
      </section>

      <section className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <Label className="flex items-center gap-2 text-xs">
            <Highlighter className="h-4 w-4 shrink-0" />
            <span>Outline Style</span>
          </Label>

          <Select
            value={serviceableAreaMap.properties.outlineStyle}
            onValueChange={(val: "solid" | "dashed") => {
              serviceableAreaMap.mapManager.getInteractionManager().disableDrawing();
              serviceableAreaMap.setProperties?.({ ...serviceableAreaMap.properties, outlineStyle: val });
            }}
          >
            <SelectTrigger className="w-[110px] text-xs">
              {serviceableAreaMap.properties.outlineStyle === "solid" ? (
                <Square className="text-primary h-5 w-5" />
              ) : (
                <SquareDashed className="text-primary h-5 w-5" />
              )}
              <SelectValue placeholder="Select a style" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="solid" className="text-xs">
                  Solid
                </SelectItem>
                <SelectItem value="dashed" className="text-xs">
                  Dashed
                </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <Label className="flex items-center gap-2 text-xs">
            <PenLine className="h-4 w-4" />
            <span>Stroke Width</span>
          </Label>
          <code className="text-muted-foreground text-sm font-semibold">
            {serviceableAreaMap.properties.strokeWidth}px
          </code>
        </div>
        <Slider
          value={serviceableAreaMap.properties.strokeWidth}
          onValueChange={(e) => {
            serviceableAreaMap.mapManager.getInteractionManager().disableDrawing();
            serviceableAreaMap.setProperties?.({ ...serviceableAreaMap.properties, strokeWidth: e });
          }}
          min={1}
          max={10}
          step={1}
        />
      </section>
    </>
  );
};
