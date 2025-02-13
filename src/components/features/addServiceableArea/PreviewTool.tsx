"use client";

import { useContext, type FunctionComponent } from "react";
import Image from "next/image";
import { ServiceableAreaMapContenxt } from "./ServiceableAreaMap";

export const PreviewTool: FunctionComponent = () => {
  const mapConfig = useContext(ServiceableAreaMapContenxt);

  return (
    <div className="relative flex h-24 items-center justify-center overflow-clip rounded-md select-none">
      <Image
        src="/preview.png"
        alt="preview"
        height={150}
        width={150}
        priority
        className="w-full object-cover select-none"
      />

      <div
        className="absolute h-10 w-10 border-[4px]"
        style={{
          borderColor: mapConfig?.properties.strokeColor,
          background: mapConfig?.properties.fillColor,
          borderWidth: mapConfig?.properties.strokeWidth[0],
          borderStyle: mapConfig?.properties.outlineStyle,
        }}
      />
    </div>
  );
};
