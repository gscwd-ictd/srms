"use client";

import { useMapStore } from "@srms/components/stores/useMapStore";
import { Button } from "@srms/components/ui/Button";
import { cn } from "@srms/utils/shadcn";
import { MousePointer2, PersonStanding, X } from "lucide-react";
import { FunctionComponent, useEffect } from "react";
import { useCardStore } from "@srms/components/stores/useCardStore";
import { useTableStore } from "@srms/components/stores/useTableStore";
// import { usePositionStore } from "@srms/components/stores/usePositionStore";

// interface WaterMeterCardProps {
//   open: boolean;
//   onOpenChange?(open: boolean): void;
// }

const MapToolbar: FunctionComponent = () => {
  const {
    polygonSelectionMode,
    setPolygonSelectionMode,
    streetViewSelectionMode,
    setStreetViewSelectionMode,
    waterMetersIsLoading,
  } = useMapStore();

  const { setConsumersTableCardAreaOfInterestOpen, setStreetViewModalOpen } = useCardStore();
  const { setColumnFiltersState } = useTableStore();
  // const { isStreetViewPossible } = usePositionStore();

  // const [hidePegman, setHidePegman] = useState(false);

  useEffect(() => {
    if (!polygonSelectionMode) {
      setConsumersTableCardAreaOfInterestOpen(false); //close table if area of interest is off
      setColumnFiltersState([]); //empty column filters for consumer table
    }
  }, [polygonSelectionMode]);

  // const [shake, setShake] = useState(false);
  // const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });

  // const playShakeAnimation = () => {
  //   setShake(true);

  //   setTimeout(() => {
  //     setShake(false);
  //   }, 400);
  // };

  useEffect(() => {
    if (!streetViewSelectionMode) {
      setStreetViewModalOpen(false); //close street view modal if street view selection mode is off
      return;
    }

    // const move = (e: MouseEvent) => {
    //   // const target = e.target as HTMLElement;

    //   // const shouldHidePegman =
    //   //   target.closest("[data-pegman-ignore]") !== null || target.closest("[data-streetview-modal]") !== null; // hide pegman/crosshair icon if hovering over the layers card or street view modal

    //   setCursorPos({
    //     x: e.clientX,
    //     y: e.clientY,
    //   });

    //   // setHidePegman(shouldHidePegman);
    // };

    // window.addEventListener("mousemove", move);

    // document.body.style.cursor = "none";

    // return () => {
    //   window.removeEventListener("mousemove", move);
    //   document.body.style.cursor = "default";
    // };
  }, [streetViewSelectionMode]);

  // useEffect(() => {
  //   if (!isStreetViewPossible && streetViewSelectionMode) {
  //     playShakeAnimation();
  //   }
  // }, [isStreetViewPossible, streetViewSelectionMode]);

  return (
    <>
      {/* {streetViewSelectionMode && !hidePegman && (
        <div
          className="pointer-events-none fixed z-[0]"
          style={{
            left: cursorPos.x,
            top: cursorPos.y,
            transform: "translate(-50%, -50%)",
          }}
        >
          <Crosshair className={cn("size-6 text-orange-500", shake && "crosshair-shake")} />
        </div>
      )} */}

      <div data-pegman-ignore className="absolute top-20 right-[0px] flex flex-col gap-2">
        {waterMetersIsLoading ? (
          <></>
        ) : (
          <Button
            className={cn(
              "z-50 h-18 w-[72px] rounded-none shadow-none transition-all transition-discrete duration-100",
              polygonSelectionMode ? "ui-color-button-danger rounded-l-lg" : "ui-color-button rounded-l-lg",
            )}
            onClick={() => {
              setPolygonSelectionMode(!polygonSelectionMode);
              setStreetViewSelectionMode(false);
            }}
          >
            {polygonSelectionMode ? (
              <X className="size-8 text-white select-none" />
            ) : (
              <MousePointer2 className="size-8 text-white" />
            )}
          </Button>
        )}

        <Button
          className={cn(
            "z-50 h-18 w-[72px] rounded-none shadow-none transition-all transition-discrete duration-100",
            streetViewSelectionMode ? "ui-color-button-danger rounded-l-lg" : "ui-color-button rounded-l-lg",
          )}
          onClick={() => {
            setStreetViewSelectionMode(!streetViewSelectionMode);
            setPolygonSelectionMode(false);
          }}
        >
          {streetViewSelectionMode ? (
            <X className="size-8 text-white select-none" />
          ) : (
            <PersonStanding className="size-8 text-white" />
          )}
        </Button>
      </div>
    </>
  );
};

export default MapToolbar;
