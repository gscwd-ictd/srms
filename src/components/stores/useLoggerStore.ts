import { LoggerChannelEntry } from "@srms/lib/pms/types";
import { PumpData } from "@srms/lib/pumpstation/pumpStationType";
import { create } from "zustand";
import { devtools } from "zustand/middleware";

export type LoggerState = {
  pressureChannelLogs: LoggerChannelEntry;
  setPressureChannelLogs: (pressureChannelLogs: LoggerChannelEntry) => void;

  latestPressureLog: LoggerChannelEntry;
  setLatestPressureLog: (latestPressureLog: LoggerChannelEntry) => void;

  flowChannelLogs: LoggerChannelEntry;
  setFlowChannelLogs: (flowChannelLogs: LoggerChannelEntry) => void;

  latestFlowLog: LoggerChannelEntry;
  setLatestFlowLog: (latestFlowLog: LoggerChannelEntry) => void;

  pumpData: PumpData[];
  setPumpData: (updater: PumpData[] | ((prev: PumpData[]) => PumpData[])) => void;
};

export const useLoggerStore = create<LoggerState>()(
  devtools((set) => ({
    pressureChannelLogs: {},
    setPressureChannelLogs: (pressureChannelLogs) => set({ pressureChannelLogs }),

    latestPressureLog: {},
    setLatestPressureLog: (latestPressureLog) => set({ latestPressureLog }),

    flowChannelLogs: {},
    setFlowChannelLogs: (flowChannelLogs) => set({ flowChannelLogs }),

    latestFlowLog: {},
    setLatestFlowLog: (latestFlowLog) => set({ latestFlowLog }),

    pumpData: [],
    setPumpData: (updater) =>
      set((state) => ({
    pumpData: typeof updater === "function" ? updater(state.pumpData) : updater,
    })),
  })),
);
