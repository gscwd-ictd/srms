"use client";

import { type FunctionComponent } from "react";
import { useServiceableAreaMap } from "./contexts/useServiceableMapContext";
import Image from "next/image";

export const PreviewTool: FunctionComponent = () => {
  const serviceableAreaMap = useServiceableAreaMap();

  return (
    <div className="relative flex h-32 items-center justify-center overflow-clip rounded-md select-none">
      <Image
        src="/preview.png"
        alt="preview"
        height={150}
        width={150}
        priority
        className="w-full object-cover select-none"
      />

      <div
        className="absolute h-12 w-12 border-[4px]"
        style={{
          borderColor: serviceableAreaMap.properties.strokeColor,
          background: serviceableAreaMap.properties.fillColor,
          borderWidth: serviceableAreaMap.properties.strokeWidth[0],
          borderStyle: serviceableAreaMap.properties.outlineStyle,
        }}
      />
    </div>
  );
};
