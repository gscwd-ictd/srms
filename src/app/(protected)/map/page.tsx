import { Map } from "@srms/components/features/geoserverLayers/Map";
import { MapProvider } from "@srms/components/providers/MapProvider";

export default function MapPage() {
  return (
    <MapProvider>
      <Map></Map>
    </MapProvider>
  );
}
