import {
  Consumer,
  ConsumerLedger,
  ConsumerLedgerEntry,
  Consumers,
  ConsumerServiceRequests,
  ConsumerTcms,
} from "@srms/lib/tcms/types";
import { create } from "zustand";
import { devtools } from "zustand/middleware";

export type ConsumerState = {
  consumerInit: ConsumerTcms;
  setConsumerTcms: (consumerInit: ConsumerTcms) => void;

  consumerInformation: Consumer;
  setConsumerInformation: (consumerInformation: Consumer) => void;

  consumers: Consumers;
  setConsumers: (consumers: Consumers) => void;

  filteredConsumers: Consumers;
  setFilteredConsumers: (filteredConsumers: Consumers) => void;

  consumerLedger: ConsumerLedger;
  setConsumerLedger: (consumerLedger: ConsumerLedger) => void;

  ledgerPrevYearLastEntry: ConsumerLedgerEntry;
  setLedgerPrevYearLastEntry: (ledgerPrevYearLastEntry: ConsumerLedgerEntry) => void;

  consumerServiceRequests: ConsumerServiceRequests;
  setConsumerServiceRequests: (consumerServiceRequests: ConsumerServiceRequests) => void;
};

export const useConsumerStore = create<ConsumerState>()(
  devtools((set) => ({
    consumerInit: {} as ConsumerTcms,
    setConsumerTcms: (consumerInit: ConsumerTcms) => set({ consumerInit }),

    consumerInformation: {} as Consumer,
    setConsumerInformation: (consumerInformation: Consumer) => set({ consumerInformation }),

    consumers: {} as Consumers,
    setConsumers: (consumers: Consumers) => set({ consumers }),

    filteredConsumers: {} as Consumers,
    setFilteredConsumers: (filteredConsumers: Consumers) => set({ filteredConsumers }),

    consumerLedger: [] as ConsumerLedger,
    setConsumerLedger: (consumerLedger: ConsumerLedger) => set({ consumerLedger }),

    ledgerPrevYearLastEntry: {} as ConsumerLedgerEntry,
    setLedgerPrevYearLastEntry: (ledgerPrevYearLastEntry: ConsumerLedgerEntry) =>
      set({ ledgerPrevYearLastEntry }),

    consumerServiceRequests: [] as ConsumerServiceRequests,
    setConsumerServiceRequests: (consumerServiceRequests: ConsumerServiceRequests) =>
      set({ consumerServiceRequests }),
  })),
);
