import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@srms/components/ui/Sheet";
import { FunctionComponent } from "react";
import ConsumersTable from "./ConsumersTable";
// import { ScrollArea } from "@srms/components/ui/ScrollArea";

interface WaterMeterCardProps {
  open: boolean;
  onOpenChange?(open: boolean): void;
}

const WaterMeterCard: FunctionComponent<WaterMeterCardProps> = ({ open, onOpenChange }) => {
  return (
    <Sheet open={open} onOpenChange={onOpenChange} modal={false}>
      <SheetContent
        className="h-[440px] w-full gap-0 border border-stone-300 bg-white/90 text-black backdrop-blur"
        side="bottom"
        enableCloseButton={false}
        onInteractOutside={(e) => e.preventDefault()}
      >
        <SheetHeader className="hidden">
          <SheetTitle></SheetTitle>
          <SheetDescription></SheetDescription>
        </SheetHeader>

        <ConsumersTable open={open} />
      </SheetContent>
    </Sheet>
  );
};

export default WaterMeterCard;
