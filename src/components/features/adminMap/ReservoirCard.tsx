import { useCardStore } from "@srms/components/stores/useCardStore";
import { Label } from "@srms/components/ui/Label";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@srms/components/ui/Sheet";
import { Switch } from "@srms/components/ui/Switch";
import { ReservoirProperties } from "@srms/lib/pms/types";
import { FunctionComponent, useState } from "react";

interface ReservoirCardProps {
  open: boolean;
  rp: ReservoirProperties;
}

export const ReservoirCard: FunctionComponent<ReservoirCardProps> = ({ open, rp }) => {
    const [openChange, setOpenChange] = useState(open);
    const { layerToggleCardOpen, setLayerToggleCardOpen, setReservoirCardOpen } = useCardStore();
    const [realTime, setRealTime] = useState(false);
    return(<>
    <Sheet
        open={openChange}
        onOpenChange={(o: boolean) => {
          setLayerToggleCardOpen(!layerToggleCardOpen);
          setReservoirCardOpen(false);
          setOpenChange(o);
        }}
        modal={false}
      >
        <SheetContent
          className="h-[380px] w-full gap-0 border border-stone-300 bg-white text-black"
          side="bottom"
          onInteractOutside={(e) => e.preventDefault()}
        >
            <SheetHeader className="m-5 p-0">
            <SheetTitle className="text-black">
              <div className="flex flex-row">
                <div>{rp.location.toUpperCase()}</div>
                <div className="flex items-center space-x-2 px-4">
                  <Switch
                    id="data-mode"
                    checked={realTime}
                    onCheckedChange={() => setRealTime(!realTime)}
                    className="data-[state=checked]:bg-green-500 data-[state=unchecked]:bg-red-500"
                  />

                  <Label htmlFor="data-mode">{!realTime ? "Mock Data Mode" : "Real-time Data Mode"}</Label>
                </div>
              </div>
            </SheetTitle>
            <SheetDescription className="text-stone-600">
              {rp.location.toUpperCase()}
            </SheetDescription>
          </SheetHeader>
        </SheetContent>
      </Sheet>
    </>);
}

export default ReservoirCard;