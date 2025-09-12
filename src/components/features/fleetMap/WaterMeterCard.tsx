import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@srms/components/ui/Sheet";
import { FunctionComponent } from "react";
import WaterMeterTable from "./WaterMeterTable";
import { ScrollArea } from "@srms/components/ui/ScrollArea";

interface WaterMeterCardProps {
  open: boolean;
  onOpenChange?(open: boolean): void;
}

const WaterMeterCard: FunctionComponent<WaterMeterCardProps> = ({ open, onOpenChange }) => {
  return (
    <Sheet open={open} onOpenChange={onOpenChange} modal={false}>
      <SheetContent
        className="h-[380px] w-full gap-0 border border-stone-300 bg-white text-black"
        side="bottom"
        enableCloseButton={false}
      >
        <SheetHeader className="hidden">
          <SheetTitle></SheetTitle>
          <SheetDescription></SheetDescription>
        </SheetHeader>

        <ScrollArea className="overflow-y mx-1 mt-5 h-[40vh]">
          <WaterMeterTable open={open} />
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};

export default WaterMeterCard;
