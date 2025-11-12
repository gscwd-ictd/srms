"use client";

import { Accordion, AccordionItem } from "@srms/components/ui/Accordion";
import { Button } from "@srms/components/ui/Button";
import { ScrollArea } from "@srms/components/ui/ScrollArea";
import { Layers, X } from "lucide-react";
import React, { FunctionComponent } from "react";
import { Card, CardContent, CardHeader, CardAction } from "@srms/components/ui/Card";
import { cn } from "@srms/utils/shadcn";
import { useCardStore } from "@srms/components/stores/useCardStore";
import PipelineRenderToggleList from "./PipelineRenderToggleList";
import XilogLoggerToggleList from "./XilogLoggerToggleList";
import MultilogLoggerToggleList from "./MultilogLoggerToggleList";

export const LayersCard: FunctionComponent = () => {
  const { layerToggleCardOpen, setLayerToggleCardOpen } = useCardStore();

  // Open modal for layers card
  const toggleModal = () => {
    setLayerToggleCardOpen(!layerToggleCardOpen);
  };

  return (
    <React.Fragment>
      <Button
        className={cn(
          "absolute z-50 h-18 w-18 rounded-none bg-cyan-600 transition-all transition-discrete duration-100 hover:bg-cyan-500",
          layerToggleCardOpen ? "hidden opacity-0" : "opacity-100",
        )}
        onClick={() => toggleModal()}
      >
        <Layers className="size-8 text-white" />
      </Button>

      {/* Layer Sidebar */}
      <Card
        className={cn(
          "vehicle-layers absolute z-20 h-screen w-[360px] rounded-none border-none bg-white transition-all transition-discrete duration-100",
          layerToggleCardOpen
            ? "block opacity-100 peer-checked:opacity-100"
            : "hidden opacity-0 peer-checked:opacity-0",
        )}
      >
        <CardHeader className="flex p-0">
          <CardAction className="self-end">
            <Button variant="link" onClick={() => toggleModal()}>
              <X className="size-5 text-stone-700" />
            </Button>
          </CardAction>
        </CardHeader>

        <ScrollArea className="mx-2 h-[95vh]">
          <CardContent className="mr-1 p-1">
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <PipelineRenderToggleList />
              </AccordionItem>

              <AccordionItem value="item-2">
                <XilogLoggerToggleList />
              </AccordionItem>

              <AccordionItem value="item-3">
                <MultilogLoggerToggleList />
              </AccordionItem>

              {/* <AccordionItem value="item-4">
                <ValveRenderToggleList />
              </AccordionItem> */}
            </Accordion>
          </CardContent>
        </ScrollArea>
      </Card>
    </React.Fragment>
  );
};
