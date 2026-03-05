import { create } from "zustand";
import { devtools } from "zustand/middleware";

export type CardState = {
  layerToggleCardOpen: boolean;
  setLayerToggleCardOpen: (layerToggleCardOpen: boolean) => void;

  vehicleDetailsCardOpen: boolean;
  setVehicleDetailsCardOpen: (vehicleDetailsCardOpen: boolean) => void;

  valveDetailsCardOpen: boolean;
  setValveDetailsCardOpen: (valveDetailsCardOpen: boolean) => void;

  waterMeterTableCardOpen: boolean;
  setWaterMeterTableCardOpen: (waterMeterTableCardOpen: boolean) => void;

  waterMeterDetailsCardOpen: boolean;
  setWaterMeterDetailsCardOpen: (waterMeterDetailsCardOpen: boolean) => void;

  xilogDetailsCardOpen: boolean;
  setXilogDetailsCardOpen: (xilogDetailsCardOpen: boolean) => void;

  multilogDetailsCardOpen: boolean;
  setMultilogDetailsCardOpen: (multilogDetailsCardOpen: boolean) => void;

  pumpingStationCardOpen: number;
  setPumpingStationCardOpen: (pumpingStationCardOpen: number) => void;
};

export const useCardStore = create<CardState>()(
  devtools((set) => ({
    layerToggleCardOpen: false,
    setLayerToggleCardOpen: (layerToggleCardOpen) => set({ layerToggleCardOpen }),

    vehicleDetailsCardOpen: false,
    setVehicleDetailsCardOpen: (vehicleDetailsCardOpen) => set({ vehicleDetailsCardOpen }),

    valveDetailsCardOpen: false,
    setValveDetailsCardOpen: (valveDetailsCardOpen) => set({ valveDetailsCardOpen }),

    waterMeterTableCardOpen: false,
    setWaterMeterTableCardOpen: (waterMeterTableCardOpen) => set({ waterMeterTableCardOpen }),

    waterMeterDetailsCardOpen: false,
    setWaterMeterDetailsCardOpen: (waterMeterDetailsCardOpen) => set({ waterMeterDetailsCardOpen }),

    xilogDetailsCardOpen: false,
    setXilogDetailsCardOpen: (xilogDetailsCardOpen) => set({ xilogDetailsCardOpen }),

    multilogDetailsCardOpen: false,
    setMultilogDetailsCardOpen: (multilogDetailsCardOpen) => set({ multilogDetailsCardOpen }),

    pumpingStationCardOpen: 0,
    setPumpingStationCardOpen: (pumpingStationCardOpen) => set({ pumpingStationCardOpen }),
  })),
);
