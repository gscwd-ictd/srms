"use client";

import { type FunctionComponent } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@srms/components/ui/Sheet";
import { ScrollArea } from "@srms/components/ui/ScrollArea";
import { Button } from "@srms/components/ui/Button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@srms/components/ui/Collapsible";
import { ChevronRight, RefreshCcw, Settings2 } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@srms/components/ui/Tooltip";
import { useServiceableAreaMap } from "./contexts/useServiceableMapContext";
import { isDeepEqual } from "@srms/utils/isDeepEqual";
import { PreviewTool } from "./PreviewTool";
import { StylingTool } from "./StylingTool";
import { InteractionTool } from "./InteractionTool";
import { featureStylesDefault } from "@srms/utils/constants";

export const DrawingTools: FunctionComponent = () => {
  const serviceableArea = useServiceableAreaMap();

  return (
    <Sheet modal={false}>
      <Tooltip>
        <TooltipTrigger asChild>
          <SheetTrigger asChild>
            <Button variant="ghost" className="h-7 w-7 rounded-md">
              <Settings2 />
            </Button>
          </SheetTrigger>
        </TooltipTrigger>
        <TooltipContent>Customize Style</TooltipContent>
      </Tooltip>

      <SheetContent className="bg-sidebar w-80" onInteractOutside={(e) => e.preventDefault()}>
        <SheetHeader className="px-6">
          <SheetTitle>Preview</SheetTitle>
          {/** Empty description just to get rid of warning */}
          <SheetDescription />
          <PreviewTool />
        </SheetHeader>

        <ScrollArea className="h-full">
          <div className="mb-4 space-y-2 p-0">
            <Collapsible className="group/collapsible px-4" defaultOpen>
              <CollapsibleTrigger className="hover:bg-secondary data-[state=open]:bg-secondary flex w-full items-center justify-between rounded-md py-2 pr-2 pl-4">
                <span className="text-sm font-semibold">Styling</span>
                <ChevronRight className="ml-auto h-5 w-5 transition-transform group-data-[state=open]/collapsible:rotate-90" />
              </CollapsibleTrigger>
              <CollapsibleContent className="bg-secondary/30 mt-2 space-y-5 rounded-lg border p-5">
                <StylingTool />
              </CollapsibleContent>
            </Collapsible>

            <Collapsible className="group/collapsible px-4" defaultOpen>
              <CollapsibleTrigger className="hover:bg-secondary data-[state=open]:bg-secondary flex w-full items-center justify-between rounded-md py-2 pr-2 pl-4">
                <span className="text-sm font-semibold">Interactions</span>
                <ChevronRight className="ml-auto h-5 w-5 transition-transform group-data-[state=open]/collapsible:rotate-90" />
              </CollapsibleTrigger>
              <CollapsibleContent className="bg-secondary/30 mt-2 space-y-5 rounded-lg border p-5">
                <InteractionTool />
              </CollapsibleContent>
            </Collapsible>
          </div>
        </ScrollArea>

        <SheetFooter>
          <Button
            variant="secondary"
            onClick={() => {
              serviceableArea.setProperties?.(featureStylesDefault);
              serviceableArea.mapManager.getInteractionManager().disableDrawing();
            }}
            disabled={isDeepEqual(serviceableArea.properties, featureStylesDefault)}
          >
            <RefreshCcw />
            <span>Reset</span>
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};
