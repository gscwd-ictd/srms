"use client";

import { type FunctionComponent } from "react";
import { Card, CardContent, CardHeader } from "@srms/components/ui/Card";
import { PreviewTool } from "./PreviewTool";
import { StylingTool } from "./StylingTool";
import { SnappingTool } from "./SnappingTool";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@srms/components/ui/Collapsible";
import { ChevronRight } from "lucide-react";
import { Separator } from "@srms/components/ui/Separator";
// import { Button } from "@srms/components/ui/Button";
// import { Fill, Stroke, Style } from "ol/style";
// import { ServiceableAreaMapContenxt } from "./ServiceableAreaMap";

export const DrawingTools: FunctionComponent = () => {
  //const mapConfig = useContext(ServiceableAreaMapContenxt);

  return (
    <Card className="bg-sidebar border-none shadow-none">
      <CardHeader className="py-0">
        <PreviewTool />
      </CardHeader>

      <CardContent className="mt-6 mb-4 space-y-2 p-0">
        <Collapsible className="group/collapsible px-4" defaultOpen>
          <CollapsibleTrigger className="hover:bg-secondary flex w-full items-center justify-between rounded-md py-2 pr-2 pl-4">
            <span className="text-sm font-semibold">Feature Style</span>
            <ChevronRight className="ml-auto h-5 w-5 transition-transform group-data-[state=open]/collapsible:rotate-90" />
          </CollapsibleTrigger>
          <CollapsibleContent className="bg-secondary/40 mt-2 space-y-5 rounded-lg border p-5">
            <StylingTool />
          </CollapsibleContent>
        </Collapsible>

        <Separator />

        <Collapsible className="group/collapsible px-4" defaultOpen>
          <CollapsibleTrigger className="hover:bg-secondary flex w-full items-center justify-between rounded-md py-2 pr-2 pl-4">
            <span className="text-sm font-semibold">Snapping Interaction</span>
            <ChevronRight className="ml-auto h-5 w-5 transition-transform group-data-[state=open]/collapsible:rotate-90" />
          </CollapsibleTrigger>
          <CollapsibleContent className="bg-secondary/40 mt-2 space-y-5 rounded-lg border p-5">
            <SnappingTool />
          </CollapsibleContent>
        </Collapsible>
      </CardContent>

      {/* <CardFooter className="flex items-center justify-end px-4 pt-4">
        <Button
          variant="secondary"
          className="w-full"
          onClick={() => {
            const style = new Style({
              fill: new Fill({
                color: mapConfig?.properties.fillColor,
              }),
              stroke: new Stroke({
                color: mapConfig?.properties.strokeColor,
                width: mapConfig?.properties.strokeWidth[0],
                lineDash: mapConfig?.properties.outlineStyle === "dashed" ? [5, 10] : undefined,
              }),
            });

            mapConfig?.mapManager?.getInteractionManager().enableDrawing("Polygon", style, true);
          }}
        >
          <Pointer className="h-10 w-10" />
          <span>Begin Mapping</span>
        </Button>
      </CardFooter> */}
    </Card>
  );
};
