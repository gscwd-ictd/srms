"use client";

import { useEffect, useState, type FunctionComponent, type PropsWithChildren } from "react";
import { AbilityContext } from "@srms/app/(protected)/dashboard/contexts/AbilityContext";
import { defineAbilityFor } from "../functions/defineAbilityFor";

export const AuthProvider: FunctionComponent<PropsWithChildren> = ({ children }) => {
  const [ability, setAbility] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");

    const user = getUserFromToken(token);
    const abilityInstance = defineAbilityFor(user);

    setAbility(abilityInstance);
  }, []);

  if (!ability) return null;

  return <AbilityContext.Provider value={ability}>{children}</AbilityContext.Provider>;
};
