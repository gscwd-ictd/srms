"use client";

import { useState, type FunctionComponent } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@srms/components/ui/Popover";
import { RgbaStringColorPicker } from "react-colorful";

type ColorPickerPopoverProps = {
  defaultColor?: string;
  onUpdateColor?: (rgbaColorString: string) => void;
  onComplete?: (selectedColor: string) => void;
};

export const ColorPickerPopover: FunctionComponent<ColorPickerPopoverProps> = ({
  defaultColor = "rgb(255, 193, 7, 1)",
  onUpdateColor,
  onComplete,
}) => {
  const [color, setColor] = useState(defaultColor);

  return (
    <Popover>
      <PopoverTrigger className="h-5 w-5" style={{ background: color }} />
      <PopoverContent
        align="end"
        onInteractOutside={() => onComplete?.(color)}
        className="mt-2 flex flex-col items-end justify-center gap-4 border-0 bg-transparent p-0"
      >
        <div className="custom-pointers">
          <RgbaStringColorPicker
            color={color}
            onChange={(newColor) => {
              setColor(newColor);
              onUpdateColor?.(newColor);
            }}
          />
        </div>
      </PopoverContent>
    </Popover>
  );
};
