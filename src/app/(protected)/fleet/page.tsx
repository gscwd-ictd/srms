import BaseLayerPicker from "@srms/components/features/fleetMap/BaseLayerPicker";
import { FleetMap } from "@srms/components/features/fleetMap/FleetMap";
import PipelineRenderToggleList from "@srms/components/features/fleetMap/PipelineRenderToggleList";
import VehicleRenderToggleList from "@srms/components/features/fleetMap/VehicleRenderToggleList";
import { FleetMapProvider } from "@srms/components/providers/FleetMapProvider";
import { Token } from "@srms/components/types";
import { Accordion, AccordionItem } from "@srms/components/ui/Accordion";
import { Card, CardContent } from "@srms/components/ui/Card";
import { ScrollArea } from "@srms/components/ui/ScrollArea";
import { Metadata } from "next";
import { cookies } from "next/headers";

export const metadata: Metadata = {
  title: "Fleet Tracking",
};

export default async function FleetPage() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken") as Token;

  return (
    <FleetMapProvider>
      <FleetMap />

      <BaseLayerPicker />

      {/* Layer Sidebar */}
      <Card className="vehicle-layers absolute z-20 h-lvh w-[380px] rounded-none border-none bg-white p-3">
        <ScrollArea className="h-full">
          <CardContent className="mr-1 border-b border-b-stone-400 p-1">
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <VehicleRenderToggleList accessToken={accessToken} />
              </AccordionItem>

              <AccordionItem value="item-2">
                <PipelineRenderToggleList />
              </AccordionItem>
            </Accordion>
          </CardContent>
        </ScrollArea>
      </Card>
    </FleetMapProvider>
  );
}
