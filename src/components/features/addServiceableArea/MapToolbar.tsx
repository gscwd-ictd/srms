"use client";

import { type FunctionComponent } from "react";
import { DrawingTools } from "./DrawingTools";
import { LayersSheet } from "./LayersSheet";
import { DrawOptions } from "./DrawOptions";

export const MapToolbar: FunctionComponent = () => {
  return (
    <div className="bg-background fixed top-5 left-1/2 z-10 -translate-x-1/2 space-x-1 rounded-2xl">
      <div className="flex items-center gap-2 p-2">
        <LayersSheet />
        <DrawOptions />
        <DrawingTools />
      </div>
    </div>
  );
};
