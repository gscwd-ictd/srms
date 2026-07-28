import { useMapStore } from "@srms/components/stores/useMapStore";
import { cn } from "@srms/utils/shadcn";
import { MousePointer2, X } from "lucide-react";
import { FunctionComponent } from "react";

// interface WaterMeterCardProps {
//   open: boolean;
//   onOpenChange?(open: boolean): void;
// }

const ConsumerTableToolbar: FunctionComponent = () => {
  const { polygonSelectionMode, setPolygonSelectionMode } = useMapStore();
  return (
    <div className="p-1">
      <div
        className={cn(
          `flex h-8 w-8 cursor-pointer items-center justify-center overflow-hidden rounded-lg border p-2 shadow-xs transition-all hover:shadow-lg ${polygonSelectionMode ? "border-none bg-red-200 hover:border-red-300" : "border-blue-400 hover:border-blue-200"}`,
        )}
        onClick={() => {
          setPolygonSelectionMode(!polygonSelectionMode);
        }}
      >
        {polygonSelectionMode ? (
          <X className="size-8 w-full object-cover text-red-600 select-none" />
        ) : (
          <MousePointer2 className="size-4 w-full object-cover text-blue-400 select-none" />
        )}
      </div>
    </div>
  );
};

export default ConsumerTableToolbar;
