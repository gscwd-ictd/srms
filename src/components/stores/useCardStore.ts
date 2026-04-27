import { create } from "zustand";
import { devtools } from "zustand/middleware";

export type CardState = {
  layerToggleCardOpen: boolean;
  setLayerToggleCardOpen: (value: boolean | ((prev: boolean) => boolean)) => void;

  vehicleDetailsCardOpen: boolean;
  setVehicleDetailsCardOpen: (vehicleDetailsCardOpen: boolean) => void;

  vehicleDetailsToFetch: boolean;
  setVehicleDetailsToFetch: (vehicleDetailsToFetch: boolean) => void;

  valveDetailsCardOpen: boolean;
  setValveDetailsCardOpen: (valveDetailsCardOpen: boolean) => void;

  consumersTableCardOpen: boolean;
  setConsumersTableCardOpen: (value: boolean | ((prev: boolean) => boolean)) => void;

  consumerDetailsCardOpen: boolean;
  setConsumerDetailsCardOpen: (consumerDetailsCardOpen: boolean) => void;

  xilogDetailsCardOpen: boolean;
  setXilogDetailsCardOpen: (xilogDetailsCardOpen: boolean) => void;

  multilogDetailsCardOpen: boolean;
  setMultilogDetailsCardOpen: (multilogDetailsCardOpen: boolean) => void;

  pumpingStationCardOpen: number;
  setPumpingStationCardOpen: (pumpingStationCardOpen: number) => void;

  ledgerCardOpen: boolean;
  setLedgerCardOpen: (ledgerCardOpen: boolean) => void;

  serviceRequestCardOpen: boolean;
  setServiceRequestCardOpen: (serviceRequestCardOpen: boolean) => void;
};

export const useCardStore = create<CardState>()(
  devtools((set) => ({
    layerToggleCardOpen: false,
    setLayerToggleCardOpen: (value) =>
      set((state) => ({
        layerToggleCardOpen: typeof value === "function" ? value(state.layerToggleCardOpen) : value,
      })),

    vehicleDetailsCardOpen: false,
    setVehicleDetailsCardOpen: (vehicleDetailsCardOpen) => set({ vehicleDetailsCardOpen }),

    vehicleDetailsToFetch: false,
    setVehicleDetailsToFetch: (vehicleDetailsToFetch) => set({ vehicleDetailsToFetch }),

    valveDetailsCardOpen: false,
    setValveDetailsCardOpen: (valveDetailsCardOpen) => set({ valveDetailsCardOpen }),

    consumersTableCardOpen: false,
    setConsumersTableCardOpen: (value) =>
      set((state) => ({
        consumersTableCardOpen: typeof value === "function" ? value(state.consumersTableCardOpen) : value,
      })),

    consumerDetailsCardOpen: false,
    setConsumerDetailsCardOpen: (consumerDetailsCardOpen) => set({ consumerDetailsCardOpen }),

    xilogDetailsCardOpen: false,
    setXilogDetailsCardOpen: (xilogDetailsCardOpen) => set({ xilogDetailsCardOpen }),

    multilogDetailsCardOpen: false,
    setMultilogDetailsCardOpen: (multilogDetailsCardOpen) => set({ multilogDetailsCardOpen }),

    pumpingStationCardOpen: 0,
    setPumpingStationCardOpen: (pumpingStationCardOpen) => set({ pumpingStationCardOpen }),

    ledgerCardOpen: false,
    setLedgerCardOpen: (ledgerCardOpen) => set({ ledgerCardOpen }),

    serviceRequestCardOpen: false,
    setServiceRequestCardOpen: (serviceRequestCardOpen) => set({ serviceRequestCardOpen }),
  })),
);
