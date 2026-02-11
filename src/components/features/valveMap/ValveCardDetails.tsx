import { ValveCodeTypes, ValveNameTypes, ValveStatus } from "@srms/components/enums/valveTypes.enum";
import { Spinner } from "@srms/components/ui-custom/Spinner";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@srms/components/ui/Accordion";
import { Badge } from "@srms/components/ui/Badge";
import { Label } from "@srms/components/ui/Label";
import { ScrollArea } from "@srms/components/ui/ScrollArea";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@srms/components/ui/Sheet";
import { MapValveData } from "@srms/lib/pms/types";
import { isEmpty } from "@srms/utils/isEmpty";
import { Dispatch, FunctionComponent, SetStateAction } from "react";

interface ValveCardDetailsDrops {
  open: boolean;
  onOpenChange: Dispatch<SetStateAction<boolean>>;
  featureData: MapValveData | undefined;
}

const ValveCardDetails: FunctionComponent<ValveCardDetailsDrops> = ({ open, onOpenChange, featureData }) => {
  // Valve type badge design
  const badgeValveType = (type: string) => {
    if (type === ValveCodeTypes.ISO) {
      return (
        <Badge variant="secondary" className="bg-red-500 text-white dark:bg-red-600">
          {ValveNameTypes.ISO}
        </Badge>
      );
    } else if (type === ValveCodeTypes.BOV) {
      return (
        <Badge variant="secondary" className="bg-violet-500 text-white dark:bg-violet-600">
          {ValveNameTypes.BOV}
        </Badge>
      );
    } else if (type === ValveCodeTypes.PROD) {
      return (
        <Badge variant="secondary" className="bg-yellow-500 text-white dark:bg-yellow-600">
          {ValveNameTypes.PROD}
        </Badge>
      );
    } else if (type === ValveCodeTypes.PRV) {
      return (
        <Badge variant="secondary" className="bg-blue-500 text-white dark:bg-blue-600">
          {ValveNameTypes.PRV}
        </Badge>
      );
    } else if (type === ValveCodeTypes.SCV) {
      return (
        <Badge variant="secondary" className="bg-orange-500 text-white dark:bg-orange-600">
          {ValveNameTypes.SCV}
        </Badge>
      );
    } else if (type === ValveCodeTypes.ARV) {
      return (
        <Badge variant="secondary" className="bg-green-500 text-white dark:bg-green-600">
          {ValveNameTypes.ARV}
        </Badge>
      );
    } else {
      return (
        <Badge variant="secondary" className="bg-gray-500 text-white dark:bg-gray-600">
          No Data
        </Badge>
      );
    }
  };

  // Valve status badge design
  const badgeValveStatus = (status: string) => {
    if (status === ValveStatus.OPEN) {
      return (
        <Badge variant="secondary" className="bg-blue-500 text-white dark:bg-blue-600">
          {ValveStatus.OPEN}
        </Badge>
      );
    } else if (status === ValveStatus.CLOSE) {
      return (
        <Badge variant="secondary" className="bg-red-500 text-white dark:bg-red-600">
          {ValveStatus.CLOSE}
        </Badge>
      );
    } else {
      return (
        <Badge variant="secondary" className="bg-violet-500 text-white dark:bg-violet-600">
          No Data
        </Badge>
      );
    }
  };

  return (
    <Sheet key="right" open={open} onOpenChange={onOpenChange} modal={false}>
      <SheetContent
        className="ui-color-base primary-text-color m-1.5 h-[98.5vh] w-[400px] gap-0 rounded-lg border-0"
        onInteractOutside={(e) => e.preventDefault()}
      >
        <SheetHeader className="m-6 mb-2 p-0">
          <SheetTitle className="text-black">{}</SheetTitle>
          <SheetDescription className="text-stone-600">{}</SheetDescription>
        </SheetHeader>

        <ScrollArea className="h-[90vh]">
          {isEmpty(featureData) ? (
            <Spinner size={"lg"} />
          ) : (
            <>
              <div className="m-4 rounded-md border-1 border-stone-300 p-5">
                <h3 className="pb-3 font-bold">{featureData?.id}</h3>

                <div className="grid gap-2">
                  <div className="flex space-x-1.5 text-sm">
                    <Label htmlFor="vbv" className="w-[50%]">
                      Status
                    </Label>
                    <p id="vbv" className="w-[50%] text-right font-bold">
                      {badgeValveStatus(featureData!.status)}
                    </p>
                  </div>

                  <div className="flex space-x-1.5 text-sm">
                    <Label htmlFor="vbv" className="w-[50%]">
                      Type
                    </Label>
                    <p id="vbv" className="w-[50%] text-right font-bold">
                      {!isEmpty(featureData?.type) ? badgeValveType(featureData!.type) : null}
                    </p>
                  </div>

                  <div className="flex space-x-1.5 text-sm">
                    <Label htmlFor="vbv" className="w-[50%]">
                      Diameter
                    </Label>
                    <p id="vbv" className="w-[50%] text-right font-bold">
                      {featureData?.diameter}
                    </p>
                  </div>

                  <div className="flex space-x-1.5 text-sm">
                    <Label htmlFor="vbv" className="w-[50%]">
                      Brand
                    </Label>
                    <p id="vbv" className="w-[50%] text-right font-bold">
                      {featureData?.brand ? featureData?.brand : "--"}
                    </p>
                  </div>

                  <div className="flex space-x-1.5 text-sm">
                    <Label htmlFor="vbv" className="w-[50%]">
                      Year Installed
                    </Label>
                    <p id="vbv" className="w-[50%] text-right font-bold">
                      {featureData?.["yr.install"] ? featureData?.["yr.install"] : "--"}
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}

          <div className="m-4 rounded-md border-1 border-stone-300 p-5">
            <h3 className="pb-3 font-bold">Current Settings</h3>

            <div className="grid gap-2">
              <div className="flex space-x-1.5 text-sm">
                <Label htmlFor="vbv" className="w-[50%]">
                  No. of Turns
                </Label>
                <p id="vbv" className="w-[50%] text-right font-bold">
                  6 of 10
                </p>
              </div>

              <div className="flex space-x-1.5 text-sm">
                <Label htmlFor="vbv" className="w-[50%]">
                  Opening Percentage
                </Label>
                <p id="vbv" className="w-[50%] text-right font-bold">
                  60%
                </p>
              </div>

              <div className="flex space-x-1.5 text-sm">
                <Label htmlFor="vbv" className="w-[50%]">
                  Valve Man
                </Label>
                <p id="vbv" className="w-[50%] text-right font-bold">
                  John Doe
                </p>
              </div>
            </div>
          </div>

          <div className="m-4 rounded-md border-1 border-stone-300 p-5">
            <h3 className="pb-3 font-bold">History</h3>

            <Accordion type="single" collapsible className="primary-text-color w-full">
              <AccordionItem value="id-1">
                <AccordionTrigger className="rounded-none bg-indigo-500/50 p-3">
                  May 15, 2025 - June 01, 2025
                </AccordionTrigger>
                <AccordionContent className="flex flex-col gap-4 p-3 text-balance">
                  <div className="grid gap-2">
                    <div className="flex space-x-1.5 text-sm">
                      <Label htmlFor="vbv" className="w-[50%]">
                        Status
                      </Label>
                      <p id="vbv" className="w-[50%] text-right font-bold">
                        OPEN
                      </p>
                    </div>

                    <div className="flex space-x-1.5 text-sm">
                      <Label htmlFor="vbv" className="w-[50%]">
                        No. of Turns
                      </Label>
                      <p id="vbv" className="w-[50%] text-right font-bold">
                        5 of 10
                      </p>
                    </div>

                    <div className="flex space-x-1.5 text-sm">
                      <Label htmlFor="vbv" className="w-[50%]">
                        Opening Percentage
                      </Label>
                      <p id="vbv" className="w-[50%] text-right font-bold">
                        50%
                      </p>
                    </div>

                    <div className="flex space-x-1.5 text-sm">
                      <Label htmlFor="vbv" className="w-[50%]">
                        Valve Man
                      </Label>
                      <p id="vbv" className="w-[50%] text-right font-bold">
                        John Doe
                      </p>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="id-2">
                <AccordionTrigger className="rounded-none bg-indigo-500/50 p-3">
                  February 21, 2025 - May 15, 2025
                </AccordionTrigger>
                <AccordionContent className="flex flex-col gap-4 p-3 text-balance">
                  <div className="grid gap-2">
                    <div className="flex space-x-1.5 text-sm">
                      <Label htmlFor="vbv" className="w-[50%]">
                        Status
                      </Label>
                      <p id="vbv" className="w-[50%] text-right font-bold">
                        OPEN
                      </p>
                    </div>

                    <div className="flex space-x-1.5 text-sm">
                      <Label htmlFor="vbv" className="w-[50%]">
                        No. of Turns
                      </Label>
                      <p id="vbv" className="w-[50%] text-right font-bold">
                        8 of 10
                      </p>
                    </div>

                    <div className="flex space-x-1.5 text-sm">
                      <Label htmlFor="vbv" className="w-[50%]">
                        Opening Percentage
                      </Label>
                      <p id="vbv" className="w-[50%] text-right font-bold">
                        80%
                      </p>
                    </div>

                    <div className="flex space-x-1.5 text-sm">
                      <Label htmlFor="vbv" className="w-[50%]">
                        Valve Man
                      </Label>
                      <p id="vbv" className="w-[50%] text-right font-bold">
                        Juan Dela Cruz
                      </p>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="id-3">
                <AccordionTrigger className="rounded-none bg-indigo-500/50 p-3">
                  Month XX, XXXX - Month XX, XXXX
                </AccordionTrigger>
                <AccordionContent className="flex flex-col gap-4 p-3 text-balance"></AccordionContent>
              </AccordionItem>

              <AccordionItem value="id-4">
                <AccordionTrigger className="rounded-none bg-indigo-500/50 p-3">
                  Month XX, XXXX - Month XX, XXXX
                </AccordionTrigger>
                <AccordionContent className="flex flex-col gap-4 p-3 text-balance"></AccordionContent>
              </AccordionItem>

              <AccordionItem value="id-5">
                <AccordionTrigger className="rounded-none bg-indigo-500/50 p-3">
                  Month XX, XXXX - Month XX, XXXX
                </AccordionTrigger>
                <AccordionContent className="flex flex-col gap-4 p-3 text-balance"></AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};

export default ValveCardDetails;
