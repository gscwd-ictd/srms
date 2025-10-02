"use client";

import { Accordion, AccordionItem } from "@srms/components/ui/Accordion";
import { Button } from "@srms/components/ui/Button";
import { ScrollArea } from "@srms/components/ui/ScrollArea";
import { Layers, X } from "lucide-react";
import React, { FunctionComponent } from "react";
import VehicleRenderToggleList from "./VehicleRenderToggleList";
import PipelineRenderToggleList from "./PipelineRenderToggleList";
import WaterMeterRenderToggleList from "./WaterMeterRenderToggleList";
import { Token } from "@srms/components/types";
import { Card, CardContent, CardHeader, CardAction } from "@srms/components/ui/Card";
import { cn } from "@srms/utils/shadcn";
import { useCardStore } from "@srms/components/stores/useCardStore";

interface LayersCardProps {
  accessToken: Token;
}

export const LayersCard: FunctionComponent<LayersCardProps> = ({ accessToken }) => {
  const { layerToggleCardOpen, setLayerToggleCardOpen } = useCardStore();

  // Open modal for layers card
  const toggleModal = () => {
    setLayerToggleCardOpen(!layerToggleCardOpen);
  };

  return (
    <React.Fragment>
      <Button
        className={cn(
          "backdrio-blur-md absolute z-50 h-18 w-18 rounded-none bg-gradient-to-r from-cyan-500 to-blue-500 transition-all transition-discrete duration-100 hover:bg-cyan-500",
          layerToggleCardOpen ? "hidden opacity-0" : "opacity-85",
        )}
        onClick={() => toggleModal()}
      >
        <Layers className="size-8 text-white" />
      </Button>

      {/* Layer Sidebar */}
      <Card
        className={cn(
          "vehicle-layers absolute z-20 mt-14 ml-2 h-[calc(100vh-80px)] w-[230px] overflow-x-hidden overflow-y-hidden rounded-2xl border-none bg-gradient-to-r from-cyan-500 to-blue-500 backdrop-blur-3xl transition-all transition-discrete duration-100",
          layerToggleCardOpen
            ? "lock opacity-90 peer-checked:opacity-100"
            : "hidden opacity-0 peer-checked:opacity-0",
        )}
      >
        <div className="absolute -right-14 -mt-44 h-70 w-70 rounded-full bg-blue-600/30"></div>
        <div className="absolute -right-32 -mt-42 h-80 w-70 rounded-full bg-blue-600/30"></div>
        <div className="absolute -bottom-54 -left-20 h-80 w-80 rounded-full bg-blue-500/40"></div>
        <label className="absolute bottom-0 left-0 p-4 text-xs">OWMS Version 1.3.2</label>
        <CardHeader className="flex p-0">
          <CardAction className="z-40 self-end">
            <Button variant="link" onClick={() => toggleModal()}>
              <X className="size-5 text-white" />
            </Button>
          </CardAction>
        </CardHeader>
        <ScrollArea className="mx-2 h-[95vh]">
          <CardContent className="mr-1 p-1 text-white">
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <VehicleRenderToggleList accessToken={accessToken} />
              </AccordionItem>

              <AccordionItem value="item-2">
                <PipelineRenderToggleList />
              </AccordionItem>

              <AccordionItem value="item-3">
                <WaterMeterRenderToggleList />
              </AccordionItem>
            </Accordion>
          </CardContent>
        </ScrollArea>
      </Card>
      <label
        className={`absolute z-50 mt-2 ml-2 w-60 text-lg leading-none font-bold text-blue-800 ${layerToggleCardOpen ? "block" : "hidden"}`}
      >
        OPERATIONS MONITORING & MANAGEMENT SYSTEM
      </label>
    </React.Fragment>
  );
};
