"use client";

import { type FunctionComponent } from "react";
import { Label } from "@srms/components/ui/Label";
import { Slider } from "@srms/components/ui/Slider";
import { Switch } from "@srms/components/ui/Switch";
import { CircleDot, CornerRightUp, Hand, Link2, Unlink } from "lucide-react";
import { useServiceableAreaMap } from "./contexts/useServiceableMapContext";

export const InteractionTool: FunctionComponent = () => {
  const serviceableAreaMap = useServiceableAreaMap();

  return (
    <>
      <section className="flex items-center justify-between">
        <Label className="flex items-center gap-2 text-xs">
          <Hand className="h-4 w-4" />
          <span>Freehand</span>
        </Label>
        <Switch
          defaultChecked={serviceableAreaMap.properties.freehand}
          onCheckedChange={(val) =>
            serviceableAreaMap.setProperties?.({ ...serviceableAreaMap.properties, freehand: val })
          }
        />
      </section>

      <section className="flex items-center justify-between">
        <Label className="flex items-center gap-2 text-xs">
          <Link2 className="h-4 w-4" />
          <span>Enable Snapping</span>
        </Label>
        <Switch
          defaultChecked={serviceableAreaMap.properties.enableSnapping}
          onCheckedChange={(val) =>
            serviceableAreaMap.setProperties?.({ ...serviceableAreaMap.properties, enableSnapping: val })
          }
        />
      </section>

      <section className="flex items-center justify-between">
        <Label
          className={`${!serviceableAreaMap.properties.enableSnapping ? "text-muted-foreground" : ""} flex items-center gap-2 text-xs`}
        >
          <CornerRightUp className="h-4 w-4" />
          <span>Snap to Edge</span>
        </Label>
        <Switch
          defaultChecked={serviceableAreaMap.properties.snapToEdge}
          onCheckedChange={(val) =>
            serviceableAreaMap.setProperties?.({ ...serviceableAreaMap.properties, snapToEdge: val })
          }
          disabled={!serviceableAreaMap.properties.enableSnapping}
        />
      </section>

      <section className="flex items-center justify-between">
        <Label
          className={`${!serviceableAreaMap.properties.enableSnapping ? "text-muted-foreground" : ""} flex items-center gap-2 text-xs`}
        >
          <CircleDot className="h-4 w-4" />
          <span>Snap to Vertex</span>
        </Label>
        <Switch
          defaultChecked={serviceableAreaMap.properties.snapToVertex}
          onCheckedChange={(val) =>
            serviceableAreaMap.setProperties?.({ ...serviceableAreaMap.properties, snapToVertex: val })
          }
          disabled={!serviceableAreaMap.properties.enableSnapping}
        />
      </section>

      <section className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <Label
            className={`${!serviceableAreaMap.properties.enableSnapping ? "text-muted-foreground" : ""} flex items-center gap-2 text-xs`}
          >
            <Unlink className="h-4 w-4" />
            <span>Snap Tolerance</span>
          </Label>
          <code className="text-muted-foreground text-sm font-semibold">
            {serviceableAreaMap.properties.snapTolerance}px
          </code>
        </div>
        <Slider
          defaultValue={serviceableAreaMap.properties.snapTolerance}
          onValueChange={(e) =>
            serviceableAreaMap.setProperties?.({ ...serviceableAreaMap.properties, snapTolerance: e })
          }
          disabled={!serviceableAreaMap.properties.enableSnapping}
          min={1}
          max={20}
          step={1}
        />
      </section>
    </>
  );
};
