import { MapValveData } from "@srms/lib/pms/types/ValveTypes";
import { create } from "zustand";
import { devtools } from "zustand/middleware";

export type ValveState = {
  selectedValve: MapValveData;
  setSelectedValve: (selectedValve: MapValveData) => void;
};

export const useValveStore = create<ValveState>()(
  devtools((set) => ({
    selectedValve: {} as MapValveData,
    setSelectedValve: (selectedValve: MapValveData) => set({ selectedValve }),
  })),
);
