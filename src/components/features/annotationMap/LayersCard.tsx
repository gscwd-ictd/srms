"use client";

import { Button } from "@srms/components/ui/Button";
import { ScrollArea } from "@srms/components/ui/ScrollArea";
import { Hexagon, Layers, MousePointer2, PenLine, Pin, Plus, X } from "lucide-react";
import React, { FunctionComponent, useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardAction } from "@srms/components/ui/Card";
import { cn } from "@srms/utils/shadcn";
import { useCardStore } from "@srms/components/stores/useCardStore";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useAnnotationStore } from "@srms/components/stores/useAnnotationStore";
import { AnnotationTypeOptions } from "@srms/components/enums/annotationTypeOptions.enum";
import { Accordion, AccordionItem } from "@srms/components/ui/Accordion";
import PolygonsRenderToggleList from "./PolygonToggleList";
import AnnotationCard from "./AnnotationCardDraggable";

export const LayersCard: FunctionComponent = () => {
  const router = useRouter();
  const [initialNavAnimation, setInitialNavAnimation] = useState<boolean>(true);
  const { selectedAnnotationType, setSelectedAnnotationType } = useAnnotationStore();

  // Open modal for layers card
  const toggleModal = () => {
    setLayerToggleCardOpen((prev) => !prev);
    setInitialNavAnimation(false);
  };

  const { layerToggleCardOpen, setLayerToggleCardOpen } = useCardStore();
  const { addAnnotationModalOpen, setAddAnnotationModalOpen } = useAnnotationStore();

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
            <CardContent className="jusitfy-between mr-1 flex flex-col items-center gap-3 p-1 text-white">
              <div className="jusitfy-between mr-1 flex w-full items-center gap-3 p-1 text-white">
                {Object.values(AnnotationTypeOptions).map((annotationType) => (
                  <label key={annotationType} className="cursor-pointer" htmlFor="field-osm">
                    {/* Square with image */}
                    <div
                      className={cn(
                        layerToggleCardOpen ? "basemap-intro-animated" : "basemap-outro-animated",
                        "flex items-center justify-center overflow-hidden rounded-lg shadow-xs transition transition-all peer-checked:border-blue-500 hover:shadow-lg",
                        !selectedAnnotationType && annotationType === AnnotationTypeOptions.POINT
                          ? "h-8 w-8 shadow-lg transition-all"
                          : selectedAnnotationType === annotationType
                            ? "h-8 w-8 border border-blue-200 shadow-lg transition-all" // selected (bigger)
                            : "h-8 w-8 border border-blue-400 shadow-xs transition-all hover:border-blue-200 hover:shadow-lg", // normal
                        "overflow-hidden rounded-lg transition-all peer-checked:border-blue-500",
                      )}
                      onClick={() => setSelectedAnnotationType(annotationType)}
                    >
                      {annotationType === AnnotationTypeOptions.POINT ? (
                        <Pin className="size-4 w-full object-cover text-blue-400 select-none" />
                      ) : // ) : annotationType === AnnotationTypeOptions.CIRCLE ? (
                      //   <Circle className="size-4 w-full object-cover text-blue-400 select-none" />
                      annotationType === AnnotationTypeOptions.LINE_STRING ? (
                        <PenLine className="size-4 w-full object-cover text-blue-400 select-none" />
                      ) : annotationType === AnnotationTypeOptions.POLYGON ? (
                        <Hexagon className="size-4 w-full object-cover text-blue-400 select-none" />
                      ) : (
                        <MousePointer2 className="size-4 w-full object-cover text-blue-400 select-none" />
                      )}
                    </div>
                  </label>
                ))}
                <div
                  className={cn(
                    "flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg border border-blue-400 shadow-xs transition-all peer-checked:border-blue-500 hover:border-blue-200 hover:shadow-lg",
                  )}
                  onClick={() => setAddAnnotationModalOpen(true)}
                >
                  <Plus className="size-4 w-full object-cover text-blue-400 select-none" />
                </div>
              </div>

              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <PolygonsRenderToggleList />
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

      <AnnotationCard open={addAnnotationModalOpen} onOpenChange={setAddAnnotationModalOpen} />
    </React.Fragment>
  );
};
