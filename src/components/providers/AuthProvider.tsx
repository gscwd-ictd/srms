"use client";

import { useEffect, useState, type FunctionComponent, type PropsWithChildren } from "react";
import { AbilityContext } from "@srms/app/(protected)/dashboard/contexts/AbilityContext";
// import { defineAbilityFor } from "../functions/defineAbilityFor";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { useUserStore } from "../stores/useUserStore";
import { isEmpty } from "@srms/utils/isEmpty";
import { AnyMongoAbility, defineAbility, PureAbility } from "@casl/ability";
import { ApplicationRole, RoleDetail } from "@srms/lib/authentication/types";

type AppAbility = PureAbility<Actions> & AnyMongoAbility;
type Actions = "access";

export const AuthProvider: FunctionComponent<PropsWithChildren> = ({ children }) => {
  const { setUserDetails } = useUserStore();
  const [ability, setAbility] = useState<AppAbility>();

  const { data: roles } = useQuery({
    queryKey: ["get-user-roles"],
    refetchOnReconnect: false,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    queryFn: async () => {
      const { data } = await axios.get(`/api/v1/user-roles`, {});

      return data;
    },
    throwOnError: false,
  });

  useEffect(() => {
    if (!isEmpty(roles)) {
      const applicationRole = roles.apps.filter(
        (app: ApplicationRole) => app.name === process.env.NEXT_PUBLIC_APP_NAME,
      );

      const appRoles = applicationRole[0] || ({} as ApplicationRole);

      const ability = defineAbility<AppAbility>((can) => {
        const userAccessArr = appRoles?.roles?.map((access: RoleDetail) => {
          return access;
        });

        console.log(userAccessArr);
        if (appRoles.isSuperuserAdmin) {
          can("access", "all");
        } else {
          if (!isEmpty(userAccessArr)) {
            userAccessArr.map((permission: RoleDetail) => {
              can("access", permission.slug);
            });
          }
        }
      });

      setAbility(ability);

      setUserDetails(roles);
    }
  }, [roles]);

  if (!ability) return null;

  return <AbilityContext.Provider value={ability}>{children}</AbilityContext.Provider>;
};
