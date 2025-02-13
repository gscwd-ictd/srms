"use client";

import { type FunctionComponent } from "react";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@srms/components/ui/Sheet";
import { DrawingTools } from "./DrawingTools";
import { ScrollArea } from "@srms/components/ui/ScrollArea";

type AddServiceableAreaSheetContainerProps = {
  open: boolean;
  setOpen: (state: boolean) => void;
};

export const AddServiceableAreaSheetContainer: FunctionComponent<AddServiceableAreaSheetContainerProps> = ({
  open,
  setOpen,
}) => {
  return (
    <Sheet modal={false} open={open} onOpenChange={setOpen}>
      {/* <SheetTrigger asChild>
        <Button variant="outline">Draw Settings</Button>
      </SheetTrigger> */}

      <SheetContent className="bg-sidebar w-80" onInteractOutside={(e) => e.preventDefault()}>
        <SheetHeader>
          <SheetTitle>Draw Settings</SheetTitle>
          <SheetDescription>Configure style according to your preference.</SheetDescription>
        </SheetHeader>

        <ScrollArea className="h-full">
          <DrawingTools />
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};
