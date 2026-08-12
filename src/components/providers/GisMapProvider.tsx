"use client";

import { useContext, useEffect, useState, type FunctionComponent, type PropsWithChildren } from "react";
import { MapManager } from "@srms/lib/mapstudio/mapManager";
import { FeatureStyles } from "@srms/server/types";
import { GisMapContext } from "../features/gisMap/contexts/useGisMapContext";
import { featureStylesDefault } from "@srms/server/constants";
import { useQuery } from "@tanstack/react-query";
import { AbilityContext } from "@srms/app/(protected)/dashboard/contexts/AbilityContext";
import { TracksolidContext } from "../features/gisMap/contexts/useTracksolid";
import { toast } from "sonner";
import { tracksolidApi } from "@srms/lib/tracksolid/tracksolidHelper";

const mapManager = new MapManager();

type Props = PropsWithChildren<{
  initialAccessToken: string | null;
}>;

export const GisMapProvider: FunctionComponent<Props> = ({ children, initialAccessToken }) => {
  const [properties, setProperties] = useState<FeatureStyles>(featureStylesDefault);

  const ability = useContext(AbilityContext);

  const hasFleetAbility = ability?.can("access", "fleetLayer") ?? false;

  const {
    data: accessToken,
    isLoading,
    isFetching,
    isError,
    error,
  } = useQuery({
    queryKey: ["tracksolid-session"],

    enabled: hasFleetAbility,

    initialData: initialAccessToken ?? undefined,

    staleTime: 1000 * 60 * 60 * 2,

    retry: false,

    queryFn: async () => {
      const response = await tracksolidApi.post("/v1/tracksolid/access_token", {});

      const token = response.data.result.accessToken as string;

      return token;
    },
  });

  const isTracksolidReady = hasFleetAbility && !!accessToken;

  const loadingToast = (message: string) => {
    toast.info("Loading", {
      description: message,
      position: "top-center",
    });
  };

  const successToast = (message: string) => {
    toast.success("Success", {
      description: message,
      position: "top-center",
    });
  };

  const errorToast = (message: string) => {
    toast.error("Error", {
      description: message,
      position: "top-center",
    });
  };

  useEffect(() => {
    if (isLoading) {
      loadingToast("Initializing access token...");
    }

    if (accessToken) {
      successToast("Tracksolid handshake success");
    }

    if (isError) {
      errorToast("Error message: " + error);
    }
  }, [isLoading, accessToken, isError]);

  return (
    <TracksolidContext.Provider
      value={{
        accessToken: accessToken ?? null,
        hasFleetAbility,
        isLoading: isLoading || isFetching,
        isTracksolidReady,
      }}
    >
      <GisMapContext.Provider
        value={{
          mapManager,
          properties,
          setProperties,
        }}
      >
        {children}
      </GisMapContext.Provider>
    </TracksolidContext.Provider>
  );
};
