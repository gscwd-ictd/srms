"use client";

import { Label } from "@srms/components/ui/Label";
import { Slider } from "@srms/components/ui/Slider";
import { Switch } from "@srms/components/ui/Switch";
import { CircleDot, CornerRightUp, Link2, Unlink } from "lucide-react";
import { useState, type FunctionComponent } from "react";

export const SnappingTool: FunctionComponent = () => {
  const [enableSnapping, setEnableSnapping] = useState(true);
  const [snapToEdge, setSnapToEdge] = useState(true);
  const [snapToVertex, setSnapToVertex] = useState(true);
  const [snapTolerance, setSnapTolerance] = useState([1]);

  return (
    <>
      <section className="flex items-center justify-between">
        <Label className="flex items-center gap-2 text-xs">
          <Link2 className="h-4 w-4" />
          <span>Enable Snapping</span>
        </Label>
        <Switch defaultChecked={enableSnapping} onCheckedChange={setEnableSnapping} />
      </section>

      <section className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <Label
            className={`${!enableSnapping ? "text-muted-foreground" : ""} flex items-center gap-2 text-xs`}
          >
            <Unlink className="h-4 w-4" />
            <span>Snap Tolerance</span>
          </Label>
          <code className="text-muted-foreground text-sm font-semibold">{snapTolerance}px</code>
        </div>
        <Slider
          defaultValue={snapTolerance}
          onValueChange={(e) => setSnapTolerance(e)}
          max={10}
          step={1}
          disabled={!enableSnapping}
        />
      </section>

      <section className="flex items-center justify-between">
        <Label
          className={`${!enableSnapping ? "text-muted-foreground" : ""} flex items-center gap-2 text-xs`}
        >
          <CornerRightUp className="h-4 w-4" />
          <span>Snap to Edge</span>
        </Label>
        <Switch defaultChecked={snapToEdge} onCheckedChange={setSnapToEdge} disabled={!enableSnapping} />
      </section>

      <section className="flex items-center justify-between">
        <Label
          className={`${!enableSnapping ? "text-muted-foreground" : ""} flex items-center gap-2 text-xs`}
        >
          <CircleDot className="h-4 w-4" />
          <span>Snap to Vertex</span>
        </Label>
        <Switch defaultChecked={snapToVertex} onCheckedChange={setSnapToVertex} disabled={!enableSnapping} />
      </section>
    </>
  );
};
