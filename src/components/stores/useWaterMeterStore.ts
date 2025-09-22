import { WaterMeterData, WaterMetersGeoJSON } from "@srms/lib/watermeters/types";
import { create } from "zustand";
import { devtools } from "zustand/middleware";

export type WaterMeterState = {
  waterMeters: WaterMetersGeoJSON;
  setWaterMeters: (waterMeters: WaterMetersGeoJSON) => void;

  selectedWaterMeter: WaterMeterData;
  setSelectedWaterMeter: (selectedWaterMeter: WaterMeterData) => void;
};

export const useWaterMeterStore = create<WaterMeterState>()(
  devtools((set) => ({
    waterMeters: {} as WaterMetersGeoJSON,
    setWaterMeters: (waterMeters: WaterMetersGeoJSON) => set({ waterMeters }),

    selectedWaterMeter: {} as WaterMeterData,
    setSelectedWaterMeter: (selectedWaterMeter: WaterMeterData) => set({ selectedWaterMeter }),
  })),
);
