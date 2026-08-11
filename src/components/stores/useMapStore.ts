import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { Map } from "ol";
import { TileLayerType, ViewPort } from "../types";
import { ValveData } from "@srms/lib/pms/types";

export type MapState = {
  // Map View configuration
  viewport: ViewPort;
  setViewport: (viewport: MapState["viewport"]) => void;

  //show or hide google places points of interest on the map
  poiVisible: boolean;
  setPoiVisible: (poiVisible: boolean) => void;

  // Reference to the OpenLayers Map instance
  mapRef: Map | null;
  setMapRef: (map: Map | null) => void;

  selectedBaseMap: string;
  setSelectedBaseMap: (selectedBaseMap: string) => void;

  geoserverLayers: Array<TileLayerType>;
  setGeoserverLayer: (geoserverLayer: TileLayerType) => void;

  valvesLayer: Array<ValveData>;
  setValvesLayer: (valvesLayer: Array<ValveData>) => void;

  baseMap: string;
  setBaseMap: (baseMap: string) => void;

  highlightedAccountNumbers: Array<string>;
  setHighlightedAccountNumbers: (highlightedAccountNumbers: Array<string>) => void;

  polygonSelectionMode: boolean;
  setPolygonSelectionMode: (value: boolean) => void;

  streetViewSelectionMode: boolean;
  setStreetViewSelectionMode: (value: boolean) => void;

  waterMetersIsLoading: boolean;
  setWaterMetersIsLoading: (value: boolean) => void;

  // setLayerVisibility: (className: string, visibility: boolean) => void;
};

export const useMapStore = create<MapState>()(
  devtools((set) => ({
    // default map view options
    viewport: {
      projection: "EPSG:4326",
      center: [125.17189194375173, 6.113035811082611],
      zoom: 15,
      maxZoom: 25,
      minZoom: 13,
      extent: [124.989222, 5.993127, 125.332908, 6.252108], // [minx, miny, maxx, maxy]
      // extent: [125.02823888167764, 6.115369299054277, 125.23760161189753, 6.213517901540954]
    },
    setViewport: (viewport) => set({ viewport }),

    poiVisible: false,
    setPoiVisible: (poiVisible) => set({ poiVisible }),

    // Map reference
    mapRef: null,
    setMapRef: (map) => set({ mapRef: map }),

    selectedBaseMap: "",
    setSelectedBaseMap: (selectedBaseMap) => set({ selectedBaseMap }),

    geoserverLayers: [],
    setGeoserverLayer: (geoserverLayer: TileLayerType) =>
      set((state) => ({ geoserverLayers: [...state.geoserverLayers, geoserverLayer] })),

    valvesLayer: [],
    setValvesLayer: (valvesLayer) => set({ valvesLayer }),

    //     setLayerVisibility: (className: string, visibility: boolean) => set((state) =>
    // (  {  geoserverLayers: geoserverLayers.map(item) => className === Item.className  })
    //     ),

    baseMap: "",
    setBaseMap: (baseMap) => set({ baseMap }),

    highlightedAccountNumbers: [],
    setHighlightedAccountNumbers: (highlightedAccountNumbers: Array<string>) =>
      set({ highlightedAccountNumbers: highlightedAccountNumbers }),

    polygonSelectionMode: false,
    setPolygonSelectionMode: (value: boolean) => set({ polygonSelectionMode: value }),

    streetViewSelectionMode: false,
    setStreetViewSelectionMode: (value: boolean) => set({ streetViewSelectionMode: value }),

    waterMetersIsLoading: false,
    setWaterMetersIsLoading: (value: boolean) => set({ waterMetersIsLoading: value }),
  })),
);
