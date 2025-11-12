import { create } from "zustand";
import { devtools } from "zustand/middleware";

export type CardState = {
  layerToggleCardOpen: boolean;
  setLayerToggleCardOpen: (layerToggleCardOpen: boolean) => void;

  waterMeterTableCardOpen: boolean;
  setWaterMeterTableCardOpen: (waterMeterTableCardOpen: boolean) => void;

  waterMeterDetailsCardOpen: boolean;
  setWaterMeterDetailsCardOpen: (waterMeterDetailsCardOpen: boolean) => void;

  loggerDetailsCardOpen: boolean;
  setLoggerDetailsCardOpen: (loggerDetailsCardOpen: boolean) => void;

  pumpingStationCardOpen: number;
  setPumpingStationCardOpen: (pumpingStationCardOpen: number) => void;
};

export const useCardStore = create<CardState>()(
  devtools((set) => ({
    layerToggleCardOpen: false,
    setLayerToggleCardOpen: (layerToggleCardOpen) => set({ layerToggleCardOpen }),

    waterMeterTableCardOpen: false,
    setWaterMeterTableCardOpen: (waterMeterTableCardOpen) => set({ waterMeterTableCardOpen }),

    waterMeterDetailsCardOpen: false,
    setWaterMeterDetailsCardOpen: (waterMeterDetailsCardOpen) => set({ waterMeterDetailsCardOpen }),

    loggerDetailsCardOpen: false,
    setLoggerDetailsCardOpen: (loggerDetailsCardOpen) => set({ loggerDetailsCardOpen }),

    pumpingStationCardOpen: 0,
    setPumpingStationCardOpen: (pumpingStationCardOpen) => set({ pumpingStationCardOpen }),
  })),
);
