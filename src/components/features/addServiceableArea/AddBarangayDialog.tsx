"use client";

import { type FunctionComponent, MouseEvent, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@srms/components/ui/Dialog";
import { Button } from "@srms/components/ui/Button";
import { Check } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@srms/components/ui/Tooltip";
import { Label } from "@srms/components/ui/Label";
import { Input } from "@srms/components/ui/Input";
import { Textarea } from "@srms/components/ui/Textarea";
import { Coordinate } from "ol/coordinate";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import $api from "@srms/lib/sdk/apiClient";
import { useServiceableAreaMap } from "./contexts/useServiceableMapContext";

type AddBarangayDialogProps = {
  disabled: boolean;
  setDisabled: (state: boolean) => void;
  onClickAction: (e: MouseEvent) => void;
  boundaries: Coordinate[][][] | undefined;
};

export const AddBarangayDialog: FunctionComponent<AddBarangayDialogProps> = ({
  onClickAction,
  disabled = true,
  setDisabled,
  boundaries,
}) => {
  const [open, setOpen] = useState(false);
  const [barangay, setBarangay] = useState("");
  const [details, setDetails] = useState<string | undefined>();

  const serviceableArea = useServiceableAreaMap();

  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationKey: ["add-serviceable-area"],
    mutationFn: async () => {
      return await $api.serviceableAreas.addServiceableArea({
        barangay: barangay,
        details: details,
        boundaries: boundaries as number[][][][],
        featureStyles: serviceableArea.properties,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["get-all-serviceable-areas"] });
      setOpen(false);
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Tooltip>
        <TooltipTrigger asChild>
          <DialogTrigger asChild>
            <Button variant="ghost" className="h-7 w-7" onClick={onClickAction} disabled={disabled}>
              <Check />
            </Button>
          </DialogTrigger>
        </TooltipTrigger>
        <TooltipContent>Add Barangay</TooltipContent>
      </Tooltip>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Barangay</DialogTitle>
          <DialogDescription>
            Include this barangay as part of the covered serviceable area.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-7 py-4">
          <section className="flex flex-col gap-3">
            <Label>Barangay Name</Label>
            <Input
              placeholder="Name of barangay"
              defaultValue={barangay}
              onChange={(e) => setBarangay(e.target.value)}
            />
          </section>

          <section className="flex flex-col gap-3">
            <Label>Details</Label>
            <Textarea defaultValue={details} onChange={(e) => setDetails(e.target.value)} />
          </section>
        </div>

        <DialogFooter>
          <Button
            onClick={() => {
              mutate();
              setDisabled(false);
            }}
          >
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
