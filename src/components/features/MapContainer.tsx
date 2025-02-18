import { PropsWithChildren, RefObject, type FunctionComponent } from "react";

type MapContainerProps = PropsWithChildren & {
  mapRef: RefObject<HTMLDivElement | null>;
};

export const MapContainer: FunctionComponent<MapContainerProps> = ({ mapRef, children }) => {
  return (
    <div ref={mapRef} className="relative z-20 h-full w-full">
      {children}
    </div>
  );
};
