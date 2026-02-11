import { create } from "zustand";
import { devtools } from "zustand/middleware";

export type PositionState = {
  lat: number;
  setLat: (lat: number) => void;

  lng: number;
  setLng: (lng: number) => void;
};

export const usePositionStore = create<PositionState>()(
  devtools((set) => ({
    lat: 6.1256925128083735,
    setLat: (lat) => set({ lat }),

    lng: 125.18468847048185,
    setLng: (lng) => set({ lng }),
  })),
);
