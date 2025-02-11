"use client";

import { FunctionComponent, useContext, useState } from "react";
import { Button } from "../ui/Button";
import { WebMapContext } from "./WebMap";
import { useMutation } from "@tanstack/react-query";
import $api from "@srms/lib/sdk/apiClient";
import { Coordinate } from "ol/coordinate";

export const TestButton: FunctionComponent = () => {
  const [boundaries, setBoundaries] = useState<Coordinate[] | undefined>(undefined);
  const mapManager = useContext(WebMapContext);

  const { mutate } = useMutation({
    mutationKey: ["add-brgy"],
    mutationFn: async () => {
      const res = await $api.serviceableAreas.postServiceableAreas({
        barangayName: "My Brgy.",
        boundaries: boundaries as number[][],
      });

      return res;
    },
  });

  return (
    <div className="absolute top-10 right-10 z-10 flex gap-5">
      <Button
        variant={"secondary"}
        onClick={() => {
          mapManager?.getInteractionManager().enableDrawing("Polygon", true, (coords) => {
            setBoundaries(coords);
          });
        }}
      >
        Draw
      </Button>

      <Button
        variant={"secondary"}
        onClick={() => {
          console.log(mapManager?.getMap().getAllLayers());
        }}
      >
        Get Layers
      </Button>

      <Button onClick={() => mutate()}>Add Barangay</Button>
    </div>
  );
};
