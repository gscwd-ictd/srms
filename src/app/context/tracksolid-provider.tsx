"use client";

import { getTracksolidCookie } from "@mapstudio/app/utils/functions/get-tracksolid-cookie";
import { TrackSolidTokens } from "@mapstudio/app/utils/types/tracksolid-auth";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { isEmpty } from "lodash";
import { createContext, Dispatch, SetStateAction, useContext, useEffect, useState } from "react";

const TokensContext = createContext<any>(null);

export const TokensProvider = ({ children }: { children: React.ReactNode }) => {
  // const [trackSolidTk, setTrackSolidTk] = useState<TrackSolidTokens>();

  return (
    <TokensContext.Provider value={{}}>{children}</TokensContext.Provider>
    // <TokensContext.Provider value={{ trackSolidTk, setTrackSolidTk }}>
    //   {children}
    // </TokensContext.Provider>
  );
};

export const useTokens = () => {
  const context = useContext(TokensContext);
  if (context === undefined) {
    throw new Error("context not found");
  }
  return context;
};
