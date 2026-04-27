"use client";

import { createContext, useContext } from "react";

const TokensContext = createContext<unknown>(null);

export const TokensProvider = ({ children }: { children: React.ReactNode }) => {
  return <TokensContext.Provider value={{}}>{children}</TokensContext.Provider>;
};

export const useTokens = () => {
  const context = useContext(TokensContext);
  if (context === undefined) {
    throw new Error("context not found");
  }
  return context;
};
