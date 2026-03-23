import { create } from "zustand";
import { devtools } from "zustand/middleware";

export type CardState = {
  layerToggleCardOpen: boolean;
  setLayerToggleCardOpen: (layerToggleCardOpen: boolean) => void;

  vehicleDetailsCardOpen: boolean;
  setVehicleDetailsCardOpen: (vehicleDetailsCardOpen: boolean) => void;

  valveDetailsCardOpen: boolean;
  setValveDetailsCardOpen: (valveDetailsCardOpen: boolean) => void;

  consumersTableCardOpen: boolean;
  setConsumersTableCardOpen: (consumersTableCardOpen: boolean) => void;

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
    setLayerToggleCardOpen: (layerToggleCardOpen) => set({ layerToggleCardOpen }),

    vehicleDetailsCardOpen: false,
    setVehicleDetailsCardOpen: (vehicleDetailsCardOpen) => set({ vehicleDetailsCardOpen }),

    valveDetailsCardOpen: false,
    setValveDetailsCardOpen: (valveDetailsCardOpen) => set({ valveDetailsCardOpen }),

    consumersTableCardOpen: false,
    setConsumersTableCardOpen: (consumersTableCardOpen) => set({ consumersTableCardOpen }),

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
