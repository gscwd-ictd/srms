import { ReservoirWSData } from "@srms/lib/pumpstation/pumpStationType";
import { create } from "zustand";
import { devtools } from "zustand/middleware";

export type ReservoirState = {
  reservoirData: ReservoirWSData[];
  setReservoirData: (updater: ReservoirWSData[] | ((prev: ReservoirWSData[]) => ReservoirWSData[])) => void;
};

export const useReservoirStore = create<ReservoirState>()(
  devtools((set) => ({
    reservoirData: [],
    setReservoirData: (updater) =>
      set((state) => ({
        reservoirData: typeof updater === "function" ? updater(state.reservoirData) : updater,
      })),
  })),
);
