"use client";

import { Label } from "@srms/components/ui/Label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@srms/components/ui/Select";
import { Slider } from "@srms/components/ui/Slider";
import { Highlighter, PaintBucket, PaintRoller, PenLine, Square, SquareDashed } from "lucide-react";
import { useContext, type FunctionComponent } from "react";
import { ColorPickerPopover } from "./ColorPickerPopover";
import { ServiceableAreaMapContenxt } from "./ServiceableAreaMap";

export const StylingTool: FunctionComponent = () => {
  const mapConfig = useContext(ServiceableAreaMapContenxt);

  return (
    <>
      <section className="flex items-center justify-between">
        <Label className="flex items-center gap-2 text-xs">
          <PaintBucket className="h-4 w-4" />
          <span>Fill Color</span>
        </Label>
        <ColorPickerPopover
          defaultColor={mapConfig?.properties.fillColor}
          onUpdateColor={(color) => {
            mapConfig?.setProperties?.({ ...mapConfig.properties, fillColor: color });
          }}
        />
      </section>

      <section className="flex items-center justify-between">
        <Label className="flex items-center gap-2 text-xs">
          <PaintRoller className="h-4 w-4" />
          <span>Stroke Color</span>
        </Label>
        <ColorPickerPopover
          defaultColor={mapConfig?.properties.strokeColor}
          onUpdateColor={(color) => {
            mapConfig?.setProperties?.({ ...mapConfig.properties, strokeColor: color });
          }}
        />
      </section>

      <section className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <Label className="flex items-center gap-2 text-xs">
            <PenLine className="h-4 w-4" />
            <span>Stroke Width</span>
          </Label>
          <code className="text-muted-foreground text-sm font-semibold">
            {mapConfig?.properties.strokeWidth}px
          </code>
        </div>
        <Slider
          defaultValue={mapConfig?.properties.strokeWidth}
          onValueChange={(e) => mapConfig?.setProperties?.({ ...mapConfig.properties, strokeWidth: e })}
          max={10}
          step={1}
        />
      </section>

      <section className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <Label className="flex items-center gap-2 text-xs">
            <Highlighter className="h-4 w-4" />
            <span>Outline Style</span>
          </Label>
          {mapConfig?.properties.outlineStyle === "solid" ? (
            <Square className="h-5 w-5" />
          ) : (
            <SquareDashed className="h-5 w-5" />
          )}
        </div>
        <Select
          defaultValue={mapConfig?.properties.outlineStyle}
          onValueChange={(val: "solid" | "dashed") =>
            mapConfig?.setProperties?.({ ...mapConfig.properties, outlineStyle: val })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a style" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Styles</SelectLabel>
              <SelectItem value="solid">Solid</SelectItem>
              <SelectItem value="dashed">Dashed</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </section>
    </>
  );
};
