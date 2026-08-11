"use client";

import { Accordion, AccordionItem } from "@srms/components/ui/Accordion";
import { Button } from "@srms/components/ui/Button";
import { ScrollArea } from "@srms/components/ui/ScrollArea";
import { Layers, X } from "lucide-react";
import React, { FunctionComponent, useContext, useState } from "react";
import VehicleRenderToggleList from "./VehicleRenderToggleList";
import PipelineRenderToggleList from "./PipelineRenderToggleList";
import WaterMeterRenderToggleList from "./WaterMeterRenderToggleList";
import { Token } from "@srms/components/types";
import { Card, CardContent, CardHeader, CardAction } from "@srms/components/ui/Card";
import { cn } from "@srms/utils/shadcn";
import { useCardStore } from "@srms/components/stores/useCardStore";
import { ValveRenderToggleList } from "./ValveRenderToggleList";
import { motion } from "framer-motion";
import { AbilityContext } from "@srms/app/(protected)/dashboard/contexts/AbilityContext";

// export const LayersCard: FunctionComponent<LayersCardProps> = ({ accessToken }) => {
export const LayersCard: FunctionComponent = () => {
  const { layerToggleCardOpen, setLayerToggleCardOpen, consumersTableCardOpen, setConsumersTableCardOpen } =
    useCardStore();

  const [initialNavAnimation, setInitialNavAnimation] = useState<boolean>(true);

  const ability = useContext(AbilityContext);

  // Open modal for layers card
  const toggleModal = () => {
    setLayerToggleCardOpen(!layerToggleCardOpen);
    setInitialNavAnimation(false);
    if (consumersTableCardOpen) {
      setConsumersTableCardOpen(!consumersTableCardOpen);
    }
  };

  return (
    <React.Fragment>
      <Button
        className={cn(
          "ui-color-button absolute z-70 h-18 w-18 rounded-none rounded-br-lg transition-all transition-discrete duration-100",
          layerToggleCardOpen ? "hidden opacity-0" : "intro-animation backdrop-blur",
        )}
        onClick={() => toggleModal()}
      >
        <Layers className="size-8 text-white" />
      </Button>

      {/* Layer Sidebar */}
      <motion.div
        initial={{ opacity: 1, x: 50 }} // Initial state (invisible, slightly below)
        animate={{ opacity: 1, x: 0 }} // Animate to (visible, normal position)
        transition={{ duration: 0.8, ease: "easeOut" }} // Animation properties
        className="intro-div absolute" // Add your CSS classes for styling
      >
        <Card
          className={cn(
            "vehicle-layers ui-color-base absolute z-60 h-[calc(100vh-65px)] w-[280px] overflow-x-hidden overflow-y-hidden rounded-lg border-none transition-all duration-100",
            layerToggleCardOpen
              ? "nav-intro-animated block backdrop-blur peer-checked:opacity-100"
              : initialNavAnimation
                ? "opacity-0"
                : "nav-outro-animated peer-checked:opacity-0",
          )}
        >
          <div className="absolute -right-14 -mt-44 h-70 w-70 rounded-full bg-blue-300/10"></div>
          <div className="absolute -right-40 -mt-42 h-80 w-70 rounded-full bg-blue-300/10"></div>
          <div className="absolute -bottom-54 -left-20 h-80 w-80 rounded-full bg-blue-400/10"></div>
          <label className="primary-text-color absolute bottom-0 left-0 p-4 text-xs">
            OMMS Version 1.0.2
          </label>
          <CardHeader className="flex p-0">
            <CardAction className="z-40 self-end">
              <Button variant="link" onClick={() => toggleModal()}>
                <X className="primary-text-color size-5" />
              </Button>
            </CardAction>
          </CardHeader>

          <ScrollArea className="mx-2 h-[78vh] overflow-y-hidden">
            <CardContent className="mr-1 p-1 text-white">
              <Accordion type="single" collapsible className="w-full">
                {ability?.can("access", "fleetLayer") && (
                  <AccordionItem value="item-1">
                    <VehicleRenderToggleList />
                    {/* <VehicleRenderToggleList accessToken={accessToken} /> */}
                  </AccordionItem>
                )}

                {ability?.can("access", "pipelineLayer") && (
                  <AccordionItem value="item-2">
                    <PipelineRenderToggleList />
                  </AccordionItem>
                )}

                {ability?.can("access", "waterMeterLayer") && (
                  <AccordionItem value="item-3">
                    <WaterMeterRenderToggleList />
                  </AccordionItem>
                )}

                {ability?.can("access", "valveLayer") && (
                  <AccordionItem value="item-4">
                    <ValveRenderToggleList />
                  </AccordionItem>
                )}
                {/* <AccordionItem value="item-5">
                  <WebSocketTest />
                </AccordionItem>
                <AccordionItem value="item-6">
                  <WebSocketMockTest />
                </AccordionItem> */}
              </Accordion>
            </CardContent>
          </ScrollArea>
        </Card>

        <div
          className={`ui-color-button-no-hover absolute z-50 mt-2 ml-2 w-[280px] rounded-lg p-1 text-center leading-none text-white backdrop-blur ${
            layerToggleCardOpen
              ? "nav-title-intro-animated block"
              : initialNavAnimation
                ? "hidden"
                : "nav-title-outro-animated"
          }`}
        >
          OPERATIONS MONITORING & MANAGEMENT SYSTEM
        </div>
      </motion.div>
    </React.Fragment>
  );
};
