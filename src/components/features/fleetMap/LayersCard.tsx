"use client";

import { Accordion, AccordionItem } from "@srms/components/ui/Accordion";
import { Button } from "@srms/components/ui/Button";
import { ScrollArea } from "@srms/components/ui/ScrollArea";
import { Layers, X } from "lucide-react";
import React, { FunctionComponent, useState } from "react";
import VehicleRenderToggleList from "./VehicleRenderToggleList";
import PipelineRenderToggleList from "./PipelineRenderToggleList";
import WaterMeterRenderToggleList from "./WaterMeterRenderToggleList";
import { Token } from "@srms/components/types";
import { Card, CardContent, CardHeader, CardAction } from "@srms/components/ui/Card";
import { cn } from "@srms/utils/shadcn";
import { useCardStore } from "@srms/components/stores/useCardStore";
import { ValveRenderToggleList } from "./ValveRenderToggleList";
import { motion } from "framer-motion";
import WebSocketTest from "./WebSocketTest";
import WebSocketMockTest from "./WebSocketMockTest";

interface LayersCardProps {
  accessToken: Token;
}

export const LayersCard: FunctionComponent<LayersCardProps> = ({ accessToken }) => {
  const {
    layerToggleCardOpen,
    setLayerToggleCardOpen,
    waterMeterTableCardOpen,
    setWaterMeterTableCardOpen,
    setWaterMeterDetailsCardOpen,
    waterMeterDetailsCardOpen,
  } = useCardStore();

  const [initialNavAnimation, setInitialNavAnimation] = useState<boolean>(true);

  // Open modal for layers card
  const toggleModal = () => {
    setLayerToggleCardOpen(!layerToggleCardOpen);
    setInitialNavAnimation(false);
    if (waterMeterTableCardOpen) {
      setWaterMeterTableCardOpen(!waterMeterTableCardOpen);
    }

    if (waterMeterDetailsCardOpen) {
      setWaterMeterDetailsCardOpen(!waterMeterDetailsCardOpen);
    }
  };

  return (
    <React.Fragment>
      <Button
        className={cn(
          "hover:bg-gradient-to-tr/50 absolute z-50 h-18 w-18 rounded-none rounded-br-lg bg-gradient-to-tr from-blue-600/90 via-blue-400/90 to-sky-300/90 transition-all transition-discrete duration-100 hover:from-blue-600/50 hover:via-blue-400/50 hover:to-sky-300/50",
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
            "vehicle-layers absolute z-20 h-[calc(100vh-80px)] w-[230px] overflow-x-hidden overflow-y-hidden rounded-lg border-none bg-gradient-to-tr from-blue-600/80 via-blue-400/80 to-sky-300/80 transition-all duration-100",
            layerToggleCardOpen
              ? "nav-intro-animated block backdrop-blur peer-checked:opacity-100"
              : initialNavAnimation
                ? "opacity-0"
                : "nav-outro-animated peer-checked:opacity-0",
          )}
        >
          <div className="absolute -right-14 -mt-44 h-70 w-70 rounded-full bg-blue-500/20"></div>
          <div className="absolute -right-40 -mt-42 h-80 w-70 rounded-full bg-blue-500/20"></div>
          <div className="absolute -bottom-54 -left-20 h-80 w-80 rounded-full bg-blue-500/20"></div>
          <label className="absolute bottom-0 left-0 p-4 text-xs">OMMS Version 1.0.2</label>
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

                <AccordionItem value="item-4">
                  <ValveRenderToggleList />
                </AccordionItem>
                <AccordionItem value="item-5">
                  <WebSocketTest />
                </AccordionItem>
                <AccordionItem value="item-6">
                  <WebSocketMockTest />
                </AccordionItem>
              </Accordion>
            </CardContent>
          </ScrollArea>
        </Card>

        <div
          className={`absolute z-50 mt-2 ml-2 w-[230px] rounded-lg bg-gradient-to-tr from-blue-500/90 via-blue-400/90 to-sky-500/90 p-1 text-center leading-none text-white backdrop-blur ${
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
