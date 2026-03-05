import { Consumer, ConsumerLedger, ConsumerServiceRequests } from "@srms/lib/tcms/types";
import { create } from "zustand";
import { devtools } from "zustand/middleware";

export type ConsumerState = {
  consumerInformation: Consumer;
  setConsumerInformation: (consumerInformation: Consumer) => void;

  consumerLedger: ConsumerLedger;
  setConsumerLedger: (consumerLedger: ConsumerLedger) => void;

  consumerServiceRequests: ConsumerServiceRequests;
  setConsumerServiceRequests: (consumerServiceRequests: ConsumerServiceRequests) => void;
};

export const useConsumerStore = create<ConsumerState>()(
  devtools((set) => ({
    consumerInformation: {} as Consumer,
    setConsumerInformation: (consumerInformation: Consumer) => set({ consumerInformation }),

    consumerLedger: [] as ConsumerLedger,
    setConsumerLedger: (consumerLedger: ConsumerLedger) => set({ consumerLedger }),

    consumerServiceRequests: [] as ConsumerServiceRequests,
    setConsumerServiceRequests: (consumerServiceRequests: ConsumerServiceRequests) =>
      set({ consumerServiceRequests }),
  })),
);
