"use client";

import { useState, type FunctionComponent } from "react";
import { Button } from "@srms/components/ui/Button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@srms/components/ui/Sheet";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@srms/components/ui/Collapsible";
import { Separator } from "@srms/components/ui/Separator";
import { Label } from "@srms/components/ui/Label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@srms/components/ui/Card";
import { Slider } from "@srms/components/ui/Slider";
import { Switch } from "@srms/components/ui/Switch";
import {
  CircleDot,
  CornerRightUp,
  GitCommitHorizontal,
  Link,
  Link2,
  PaintBucket,
  PaintRoller,
  PenLine,
  Spline,
  Unlink,
} from "lucide-react";
import Image from "next/image";

export const AddServiceableAreaSheetContainer: FunctionComponent = () => {
  const [color, setColor] = useState("orange");

  return (
    <Sheet modal={false}>
      <SheetTrigger asChild>
        <Button variant="outline">Draw Settings</Button>
      </SheetTrigger>
      <SheetContent className="bg-sidebar w-80" onInteractOutside={(e) => e.preventDefault()}>
        <SheetHeader>
          <SheetTitle>Add Serviceable Area</SheetTitle>
          <SheetDescription>Define and map new water service zones with boundaries.</SheetDescription>
        </SheetHeader>

        {/* <Separator /> */}
        <div className="grid gap-4 px-4">
          <Card className="shadow-none">
            <CardHeader>
              {/* <CardDescription className="font-bold tracking-wide">Preview</CardDescription> */}
              <div className="relative flex items-center justify-center overflow-clip rounded-lg select-none">
                <Image
                  src="/preview.png"
                  alt="preview"
                  height={200}
                  width={200}
                  className="w-full object-cover select-none"
                />
                <div className="absolute h-8 w-8 border-[4px] border-indigo-700 bg-indigo-100" />
              </div>
            </CardHeader>

            <Separator />

            <CardContent className="mt-6 mb-4 space-y-3">
              <section className="flex items-center justify-between">
                <Label className="flex items-center gap-2 text-xs">
                  <PaintBucket className="h-4 w-4" />
                  <span>Fill Color</span>
                </Label>
                <div className="h-5 w-5 bg-indigo-300" />
              </section>

              <Separator />

              <section className="flex items-center justify-between">
                <Label className="flex items-center gap-2 text-xs">
                  <PaintRoller className="h-4 w-4" />
                  <span>Stroke Color</span>
                </Label>
                <div className="h-5 w-5 bg-indigo-700" />
              </section>

              <Separator />

              <section className="flex flex-col gap-4 pb-2">
                <div className="flex items-center justify-between">
                  <Label className="flex items-center gap-2 text-xs">
                    <PenLine className="h-4 w-4" />
                    <span>Stroke Width</span>
                  </Label>
                  <code className="text-muted-foreground text-sm font-semibold">1px</code>
                </div>
                <Slider defaultValue={[1]} max={10} step={1} />
              </section>

              <Separator />

              <section className="flex items-center justify-between">
                <Label className="flex items-center gap-2 text-xs">
                  <Link2 className="h-4 w-4" />
                  <span>Enable Snapping</span>
                </Label>
                <Switch />
              </section>

              <Separator />

              <section className="flex flex-col gap-4 pb-2">
                <div className="flex items-center justify-between">
                  <Label className="flex items-center gap-2 text-xs">
                    <Unlink className="h-4 w-4" />
                    <span>Snap Tolerance</span>
                  </Label>
                  <code className="text-muted-foreground text-sm font-semibold">1px</code>
                </div>
                <Slider defaultValue={[1]} max={10} step={1} />
              </section>

              <Separator />

              <section className="flex items-center justify-between">
                <Label className="flex items-center gap-2 text-xs">
                  <CornerRightUp className="h-4 w-4" />
                  <span>Snap to Edge</span>
                </Label>
                <Switch />
              </section>

              <Separator />

              <section className="flex items-center justify-between">
                <Label className="flex items-center gap-2 text-xs">
                  <CircleDot className="h-4 w-4" />
                  <span>Snap to Vertex</span>
                </Label>
                <Switch />
              </section>
            </CardContent>
          </Card>
          {/* <section className="custom-pointers flex justify-center">
            <RgbaStringColorPicker />
          </section> */}
        </div>
        <SheetFooter>
          {/* <SheetClose asChild>
            <Button type="submit">Save changes</Button>
          </SheetClose> */}
          {/* <div className="bg-secondary flex h-32 w-full items-center justify-center rounded-lg">
            <div className="h-14 w-14 border-[4px] border-indigo-700 bg-indigo-100" />
          </div> */}
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};
