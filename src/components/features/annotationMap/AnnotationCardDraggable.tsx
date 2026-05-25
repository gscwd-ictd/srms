import { Label } from "@radix-ui/react-label";
import { ScrollArea } from "@srms/components/ui/ScrollArea";
import { FunctionComponent } from "react";
import {
  DraggableModal,
  DraggableModalBody,
  DraggableModalContent,
  DraggableModalDescription,
  DraggableModalHeader,
  DraggableModalTitle,
} from "@srms/components/ui/DraggableModal";
import { Input } from "@srms/components/ui/Input";
import { Textarea } from "@srms/components/ui/Textarea";
import { useAnnotationStore } from "@srms/components/stores/useAnnotationStore";
import { Style, Stroke, Fill } from "ol/style";

interface AddAnnotationCardProps {
  open: boolean;
  onOpenChange?(open: boolean): void;
}

const AnnotationCard: FunctionComponent<AddAnnotationCardProps> = ({ open, onOpenChange }) => {
  const {
    selectedFeature,
    // selectedBorderColor,
    setSelectedBorderColor,
    // selectedFillColor,
    setSelectedFillColor,
  } = useAnnotationStore();

  if (!selectedFeature) return null;

  // useEffect(() => {
  //   if (!selectedFeature) return;

  //   setTitle(selectedFeature.get("title") || "");
  //   setDescription(selectedFeature.get("description") || "");
  //   setBorderColor(selectedFeature.get("borderColor") || "");
  //   setFillColor(selectedFeature.get("fillColor") || "");
  // }, [selectedFeature]);

  // useEffect(() => {
  //   setSelectedBorderColor(borderColor);
  //   setSelectedFillColor(fillColor);
  // }, [borderColor, fillColor]);

  if (!selectedFeature) return null;

  return (
    <DraggableModal open={open} onOpenChange={onOpenChange}>
      <DraggableModalContent className="top-2 right-2 h-auto w-[400px]">
        <DraggableModalHeader>
          <DraggableModalTitle>{"Annotation Details"}</DraggableModalTitle>
          <DraggableModalDescription>{"Annotation details and styling options."}</DraggableModalDescription>
        </DraggableModalHeader>

        <DraggableModalBody>
          <ScrollArea className="ui-color-base primary-text-color 3xl:h-auto h-[72vh] rounded-lg">
            <>
              <div className="m-4 rounded-md border-1 border-indigo-400 p-3 shadow">
                <h3 className="pb-2 font-bold">Details</h3>
                <div className="grid gap-2">
                  <div className="flex flex-col gap-2 space-x-1.5 text-sm">
                    <Label htmlFor="gnss" className="w-full">
                      Title
                    </Label>
                    <Input
                      className="w-full text-right font-bold"
                      value={selectedFeature.get("title") || ""}
                      onChange={(e) => {
                        selectedFeature.set("title", e.target.value);
                      }}
                    />

                    <Label htmlFor="gnss" className="w-full">
                      Description
                    </Label>
                    <Textarea
                      value={selectedFeature.get("description") || ""}
                      onChange={(e) => {
                        selectedFeature.set("description", e.target.value);
                      }}
                    />
                  </div>
                </div>
              </div>

              <div className="m-4 rounded-md border-1 border-indigo-400 p-3 shadow">
                <h3 className="pb-2 font-bold">Style</h3>

                {/* <div className="grid gap-2">
                  <div className="flex space-x-1.5 text-sm">
                    <Label htmlFor="todays-mileage" className="w-[50%]">
                      Type
                    </Label>
                    <p id="todays-mileage" className="w-[50%] text-right font-bold"></p>

                    <Select value={selectedAnnotationType} onValueChange={setSelectedAnnotationType}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select annotation type" />
                      </SelectTrigger>
                      <SelectContent className="w-full">
                        {Object.values(AnnotationTypeOptions).map((annotationType) => (
                          <SelectItem key={annotationType} value={annotationType}>
                            {annotationType}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div> */}

                <div className="grid gap-2">
                  <div className="flex gap-10">
                    <div className="flex flex-col text-sm">
                      <Label>Border Color</Label>

                      <div className="flex items-center justify-start gap-2">
                        <input
                          type="color"
                          // value={selectedBorderColor}
                          // onChange={(e) => setSelectedBorderColor(e.target.value)}
                          value={selectedFeature.get("borderColor") || "#000000"}
                          onChange={(e) => {
                            const color = e.target.value;

                            selectedFeature.set("borderColor", color);
                            setSelectedBorderColor(color);
                            selectedFeature.setStyle(
                              new Style({
                                stroke: new Stroke({
                                  color,
                                  width: 2,
                                }),
                                fill: new Fill({
                                  color: `${selectedFeature.get("fillColor")}33`,
                                }),
                              }),
                            );
                          }}
                        />

                        <p>{selectedFeature.get("fillColor")}</p>
                      </div>
                    </div>

                    <div className="flex flex-col text-sm">
                      <Label>Fill Color</Label>

                      <div className="flex items-center justify-start gap-2">
                        <input
                          type="color"
                          // value={selectedFillColor}
                          // onChange={(e) => setSelectedFillColor(e.target.value)}
                          value={selectedFeature.get("fillColor") || "#000000"}
                          onChange={(e) => {
                            const color = e.target.value;

                            selectedFeature.set("fillColor", color);
                            setSelectedFillColor(color);
                            selectedFeature.setStyle(
                              new Style({
                                stroke: new Stroke({
                                  color: selectedFeature.get("borderColor") || "#000000",
                                  width: 2,
                                }),
                                fill: new Fill({
                                  color: `${color}33`,
                                }),
                              }),
                            );
                          }}
                        />

                        <p>{selectedFeature.get("fillColor")}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          </ScrollArea>
        </DraggableModalBody>

        {/* <DraggableModalFooter>
            <Button variant="default" onClick={() => onOpenChange?.(false)}>
              Close
            </Button>
          </DraggableModalFooter> */}
      </DraggableModalContent>
    </DraggableModal>
  );
};

export default AnnotationCard;
