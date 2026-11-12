"use client";

import { createContext, useContext } from "react";

export type TracksolidContextType = {
  accessToken: string | null;
  hasFleetAbility: boolean;
  isLoading: boolean;
  isTracksolidReady: boolean;
};

export const TracksolidContext = createContext<TracksolidContextType>({
  accessToken: null,
  hasFleetAbility: false,
  isLoading: false,
  isTracksolidReady: false,
});

export function useTracksolid() {
  return useContext(TracksolidContext);
}
