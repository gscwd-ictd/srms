import { PumpData } from "@srms/lib/pumpstation/pumpStationType";
import { create } from "zustand";
import { devtools } from "zustand/middleware";

export type PumpingStationState = {
  pumpData: PumpData[];
    setPumpData: (updater: PumpData[] | ((prev: PumpData[]) => PumpData[])) => void;
};

export const usePumpingStationStore = create<PumpingStationState>()(
  devtools((set) => ({
    pumpData: [],
    setPumpData: (updater) =>
      set((state) => ({
    pumpData: typeof updater === "function" ? updater(state.pumpData) : updater,
    })),
  })),
);