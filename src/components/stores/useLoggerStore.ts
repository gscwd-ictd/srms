import { LoggerChannelEntry, MultilogLogger } from "@srms/lib/pms/types";
import { create } from "zustand";
import { devtools } from "zustand/middleware";

export type LoggerState = {
  // Xilog
  pressureChannelLogs: LoggerChannelEntry;
  setPressureChannelLogs: (pressureChannelLogs: LoggerChannelEntry) => void;

  latestPressureLog: LoggerChannelEntry;
  setLatestPressureLog: (latestPressureLog: LoggerChannelEntry) => void;

  flowChannelLogs: LoggerChannelEntry;
  setFlowChannelLogs: (flowChannelLogs: LoggerChannelEntry) => void;

  latestFlowLog: LoggerChannelEntry;
  setLatestFlowLog: (latestFlowLog: LoggerChannelEntry) => void;

  // Multilog
  latestMultilogPressureFlowLog: Array<MultilogLogger>;
  setLatestMultilogPressureFlowLog: (latestMultilogPressureFlowLog: Array<MultilogLogger>) => void;
};

export const useLoggerStore = create<LoggerState>()(
  devtools((set) => ({
    // Xilog
    pressureChannelLogs: {},
    setPressureChannelLogs: (pressureChannelLogs) => set({ pressureChannelLogs }),

    latestPressureLog: {},
    setLatestPressureLog: (latestPressureLog) => set({ latestPressureLog }),

    flowChannelLogs: {},
    setFlowChannelLogs: (flowChannelLogs) => set({ flowChannelLogs }),

    latestFlowLog: {},
    setLatestFlowLog: (latestFlowLog) => set({ latestFlowLog }),

    // Multilog
    latestMultilogPressureFlowLog: [],
    setLatestMultilogPressureFlowLog: (latestMultilogPressureFlowLog) =>
      set({ latestMultilogPressureFlowLog }),
  })),
);
