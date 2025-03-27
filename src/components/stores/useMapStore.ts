import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { Map } from "ol";
import { BaseLayerOptions } from "../enums";
import { TileLayerType, ViewPort } from "../types";

export type MapState = {
  // Map View configuration
  viewport: ViewPort;
  setViewport: (viewport: MapState["viewport"]) => void;

  // Reference to the OpenLayers Map instance
  mapRef: Map | null;
  setMapRef: (map: Map | null) => void;

  // Map style
  mapStyle: BaseLayerOptions;
  setMapStyle: (style: BaseLayerOptions) => void;

  selectedBaseMap: string;
  setSelectedBaseMap: (selectedBaseMap: string) => void;

  geoserverLayers: Array<TileLayerType>;
  setGeoserverLayer: (geoserverLayer: TileLayerType) => void;

  // setLayerVisibility: (className: string, visibility: boolean) => void;
};

export const useMapStore = create<MapState>()(
  devtools((set) => ({
    // default map view options
    viewport: {
      projection: "EPSG:3857",
      center: [13934048.731470205, 682001.1655557732],
      zoom: 16,
      maxZoom: 25,
      minZoom: 12,
      extent: [13906485.166068409, 662066.9967097231, 13948865.159361392, 706731.4638312651], // bottom-left, bottom-right, top-left, top-right
    },
    setViewport: (viewport) => set({ viewport }),

    // Map reference
    mapRef: null,
    setMapRef: (map) => set({ mapRef: map }),

    // Map style (default is Bing Aerial)
    mapStyle: BaseLayerOptions.OSM,
    setMapStyle: (style) => set({ mapStyle: style }),

    selectedBaseMap: "",
    setSelectedBaseMap: (selectedBaseMap) => set({ selectedBaseMap }),

    geoserverLayers: [],
    setGeoserverLayer: (geoserverLayer: TileLayerType) =>
      set((state) => ({ geoserverLayers: [...state.geoserverLayers, geoserverLayer] })),

    //     setLayerVisibility: (className: string, visibility: boolean) => set((state) =>
    // (  {  geoserverLayers: geoserverLayers.map(item) => className === Item.className  })
    //     ),
  })),
);
