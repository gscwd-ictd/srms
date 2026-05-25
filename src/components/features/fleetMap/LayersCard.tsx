"use client";

import { Accordion, AccordionItem } from "@srms/components/ui/Accordion";
import { Button } from "@srms/components/ui/Button";
import { ScrollArea } from "@srms/components/ui/ScrollArea";
import { Layers, X } from "lucide-react";
import React, { FunctionComponent, useEffect, useState } from "react";
import VehicleRenderToggleList from "./VehicleRenderToggleList";
import PipelineRenderToggleList from "./PipelineRenderToggleList";
import WaterMeterRenderToggleList from "./WaterMeterRenderToggleList";
import { Token } from "@srms/components/types";
import { Card, CardContent, CardHeader, CardAction } from "@srms/components/ui/Card";
import { cn } from "@srms/utils/shadcn";
import { useCardStore } from "@srms/components/stores/useCardStore";
import { ValveRenderToggleList } from "./ValveRenderToggleList";
import { motion } from "framer-motion";
import WaterMeterDetailsCard from "./ConsumerDetailsCardDraggable";
import VehicleDetailsCard from "./VehicleDetailsCardDraggable";
import ValveDetailsCard from "./ValveDetailsCardDraggable";
import { useValveStore } from "@srms/components/stores/useValveStore";
import { useRouter } from "next/navigation";
import GooglePlacesRenderToggleList from "./GooglePlacesRenderToggleList";

interface LayersCardProps {
  accessToken: Token;
}

export const LayersCard: FunctionComponent<LayersCardProps> = ({ accessToken }) => {
  // const { layerToggleCardOpen, setLayerToggleCardOpen, consumersTableCardOpen, setConsumersTableCardOpen } =
  //   useCardStore();
  const router = useRouter();
  const [initialNavAnimation, setInitialNavAnimation] = useState<boolean>(true);

  // Open modal for layers card
  const toggleModal = () => {
    setLayerToggleCardOpen((prev) => !prev);
    setInitialNavAnimation(false);
    if (consumersTableCardOpen && !layerToggleCardOpen) {
      setConsumersTableCardOpen(!consumersTableCardOpen);
    }
  };

  const {
    layerToggleCardOpen,
    setLayerToggleCardOpen,
    consumersTableCardOpen,
    setConsumersTableCardOpen,
    consumerDetailsCardOpen,
    setConsumerDetailsCardOpen,
    valveDetailsCardOpen,
    setValveDetailsCardOpen,
    vehicleDetailsCardOpen,
    setVehicleDetailsCardOpen,
  } = useCardStore();

  const { selectedValve } = useValveStore();

  //open and close nav when esc key is pressed
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        toggleModal();
      }
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

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
            "vehicle-layers ui-color-base absolute z-60 h-[calc(100vh-60px)] w-[280px] overflow-x-hidden overflow-y-hidden rounded-none border-none transition-all duration-100",
            layerToggleCardOpen
              ? "nav-intro-animated block backdrop-blur peer-checked:opacity-100"
              : initialNavAnimation
                ? "-left-100 opacity-0"
                : "nav-outro-animated h-0 peer-checked:opacity-100",
          )}
        >
          <div className="absolute -right-14 -mt-44 h-70 w-70 rounded-full bg-blue-300/10"></div>
          <div className="absolute -right-40 -mt-42 h-80 w-70 rounded-full bg-blue-300/10"></div>
          <div className="absolute -bottom-54 -left-20 h-80 w-80 rounded-full bg-blue-400/10"></div>
          <div className="jusitfy-between absolute bottom-0 left-0 flex w-full flex-col items-start p-4">
            <div className="ui-color-button-no-hover relative w-full rounded-lg px-6 pt-10 pb-4 text-center text-white shadow-lg">
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 transform">
                <div className="ui-color-button-no-hover flex h-12 w-12 items-center justify-center rounded-full border-4 border-white shadow">
                  <span className="text-lg font-bold text-white">?</span>
                </div>
              </div>

              {/* <h2 className="text-md mb-2 font-semibold">Service Reqiuest Management System</h2> */}
              <p className="mb-4 text-sm text-blue-100">
                OMMS Version {process.env.NEXT_PUBLIC_APP_VERSION ?? "1.0.0"}
              </p>

              <Button className="w-30" variant="default" onClick={() => router.push("/dashboard")}>
                Dashboard
              </Button>
            </div>
          </div>

          <CardHeader className="mb-8 flex p-0">
            <CardAction className="z-40 self-end">
              {/* <Button variant="link" onClick={() => toggleModal()}>
                <X className="primary-text-color size-5" />
              </Button> */}
            </CardAction>
          </CardHeader>

          <ScrollArea className="mx-2 h-[65vh] overflow-y-hidden">
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
                  <GooglePlacesRenderToggleList />
                </AccordionItem>
              </Accordion>
            </CardContent>
          </ScrollArea>
        </Card>

        <div
          className={`ui-color-button-no-hover absolute z-60 flex h-[60px] w-[280px] items-center justify-center p-1 text-center leading-none text-white backdrop-blur ${
            layerToggleCardOpen
              ? "nav-title-intro-animated block"
              : initialNavAnimation
                ? "hidden"
                : "nav-title-outro-animated"
          }`}
        >
          <h2 className="mb-5 text-xs font-semibold">SERVICE REQUEST MANAGEMENT SYSTEM</h2>

          <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 transform">
            <div
              className="group ui-color-button-no-hover flex h-12 w-12 cursor-pointer items-center justify-center rounded-full border-4 border-white shadow duration-150 ease-in-out hover:border-white/50"
              onClick={() => toggleModal()}
            >
              <X className="size-5 text-white duration-150 ease-in-out group-hover:size-6" />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Consumers Details Draggable Card */}
      <WaterMeterDetailsCard open={consumerDetailsCardOpen} onOpenChange={setConsumerDetailsCardOpen} />

      <VehicleDetailsCard
        accessToken={accessToken}
        open={vehicleDetailsCardOpen}
        onOpenChange={setVehicleDetailsCardOpen}
      />

      <ValveDetailsCard
        open={valveDetailsCardOpen}
        onOpenChange={setValveDetailsCardOpen}
        featureData={selectedValve}
      />
    </React.Fragment>
  );
};
