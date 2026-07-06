"use client";

import { useEffect, useState, type FunctionComponent, type PropsWithChildren } from "react";
import { AbilityContext } from "@srms/app/(protected)/dashboard/contexts/AbilityContext";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { useUserStore } from "../stores/useUserStore";
import { isEmpty } from "@srms/utils/isEmpty";
import { AnyMongoAbility, defineAbility, PureAbility } from "@casl/ability";
import { ApplicationRole, RoleDetail } from "@srms/lib/authentication/types";
// import { postTsAuth, setTsCookies } from "@srms/app/helpers/tracksolid-auth-helper";
// import { toast } from "sonner";
// import { TrackSolidAuth } from "@srms/lib/tracksolid/types";

type AppAbility = PureAbility<Actions> & AnyMongoAbility;
type Actions = "access";

export const AuthProvider: FunctionComponent<PropsWithChildren> = ({ children }) => {
  const { setUserDetails } = useUserStore();
  const [ability, setAbility] = useState<AppAbility>();
  // const [enableTSFetchToken, setEnableTSFetchToken] = useState<boolean>(false);

  // Get user roles
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

  // Run tracksolid to get access token and refresh token
  // const { data: tsTokens } = useQuery({
  //   queryKey: ["get-tracksolid-tokens"],
  //   enabled: !!enableTSFetchToken,
  //   queryFn: async () => {
  //     const { result } = await postTsAuth();

  //     console.log(result);
  //     return result;
  //   },
  //   throwOnError: false,
  // });

  // Run tracksolid to get access token and refresh token
  // const tracksolidTokens = useMutation({
  //   mutationKey: ["get-tracksolid-token"],
  //   mutationFn: async () => {
  //     const response = await postTsAuth();

  //     return response as unknown as TrackSolidAuth;
  //   },

  //   onSuccess: async (data: TrackSolidAuth) => {
  //     console.log("postTsAuth return: ", data);
  //     await setTsCookies(data);
  //     // successToast("Credentials verified");
  //   },
  //   onError: (error: AxiosError<{ message: string }>) => {
  //     console.log(error);
  //   },
  // });

  // const successToast = (message: string) => {
  //   toast.success("Successful Fetch of TrackSolid Tokens", {
  //     description: message,
  //     position: "top-center",
  //   });
  // };

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

        if (appRoles.isSuperuserAdmin) {
          can("access", "all");
          // tracksolidTokens.mutate();
        } else {
          if (!isEmpty(userAccessArr)) {
            userAccessArr.map((permission: RoleDetail) => {
              can("access", permission.slug);

              // if (permission.slug === "fleetLayer") {
              // console.log("trigger Ts fetch");
              // tracksolidTokens.mutate();
              // }
            });
          }
        }
      });

      setAbility(ability);

      setUserDetails(roles);
    }
  }, [roles]);

  // useEffect(() => {
  //   console.log(tracksolidTokens.data);
  // if (!isEmpty(tsTokens)) {
  //   console.log("tsTokens success");
  //   successToast("Credentials verified");
  // } else {
  //   console.log("tsTokens fail");
  // }
  // }, [tracksolidTokens]);

  if (!ability) return null;

  return <AbilityContext.Provider value={ability}>{children}</AbilityContext.Provider>;
};
