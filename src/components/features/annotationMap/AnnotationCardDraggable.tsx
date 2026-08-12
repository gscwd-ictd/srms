import { Label } from "@radix-ui/react-label";
import { ScrollArea } from "@srms/components/ui/ScrollArea";
import { FunctionComponent, useEffect } from "react";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@srms/components/ui/Select";
import { annotationIcons } from "@srms/utils/annotationIcons";

interface AddAnnotationCardProps {
  open: boolean;
  onOpenChange?(open: boolean): void;
}
const AnnotationCard: FunctionComponent<AddAnnotationCardProps> = ({ open, onOpenChange }) => {
  const {
    setSelectedBorderColor,
    setSelectedFillColor,
    selectedAnnotationId,
    annotations,
    updateAnnotation,
  } = useAnnotationStore();

  const selectedAnnotation = annotations.find((a) => a.id === selectedAnnotationId);

  useEffect(() => {
    console.log(annotations);
  }, [annotations]);

  if (!selectedAnnotationId || !selectedAnnotation) return null;

  return (
    <DraggableModal open={open} onOpenChange={onOpenChange}>
      <DraggableModalContent
        className="top-2 right-2 h-auto w-[400px]"
        onPointerDown={(e) => e.stopPropagation()}
        onMouseDown={(e) => e.stopPropagation()}
        onClick={(e) => e.stopPropagation()}
      >
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
                      className="w-full border-gray-300 text-left font-bold"
                      value={selectedAnnotation?.title ?? ""}
                      onChange={(e) => {
                        updateAnnotation(selectedAnnotation.id, {
                          title: e.target.value,
                        });
                      }}
                    />

                    <Label htmlFor="gnss" className="w-full">
                      Description
                    </Label>
                    <Textarea
                      className="w-full border-gray-300 text-left"
                      value={selectedAnnotation?.description ?? ""}
                      onChange={(e) => {
                        updateAnnotation(selectedAnnotation.id, {
                          description: e.target.value,
                        });
                      }}
                    />
                  </div>
                </div>
              </div>

              <div className="m-4 rounded-md border-1 border-indigo-400 p-3 shadow">
                <h3 className="pb-2 font-bold">Style</h3>

                <div className="grid gap-2">
                  <div className="flex gap-10">
                    <div className="flex flex-col text-sm">
                      <Label>
                        {selectedAnnotation?.feature?.getGeometry()?.getType() === "LineString"
                          ? "Color"
                          : "Border Color"}
                      </Label>

                      <div className="flex items-center justify-start gap-2">
                        <input
                          type="color"
                          value={selectedAnnotation?.borderColor ?? "#000000"}
                          onChange={(e) => {
                            const color = e.target.value;

                            updateAnnotation(selectedAnnotation.id, {
                              borderColor: color,
                            });

                            setSelectedBorderColor(color);
                          }}
                        />

                        <p className="w-18">{selectedAnnotation?.borderColor}</p>
                      </div>
                    </div>

                    <div className="flex flex-col text-sm">
                      {selectedAnnotation?.feature?.getGeometry()?.getType() === "LineString" ? (
                        <></>
                      ) : (
                        <>
                          <Label>Fill Color</Label>

                          <div className="flex items-center justify-start gap-2">
                            <input
                              type="color"
                              value={selectedAnnotation.fillColor}
                              onChange={(e) => {
                                const color = e.target.value;

                                updateAnnotation(selectedAnnotation.id, {
                                  fillColor: color,
                                });

                                setSelectedFillColor(color);
                              }}
                            />

                            <p className="w-18">{selectedAnnotation?.fillColor}</p>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                  <div>
                    {selectedAnnotation?.feature?.getGeometry()?.getType() === "Point" && (
                      <div className="mt-4 flex flex-col gap-2">
                        <Label>Marker Icon</Label>

                        <Select
                          value={selectedAnnotation.iconName ?? "default"}
                          onValueChange={(value) => {
                            updateAnnotation(selectedAnnotation.id, {
                              iconName: value,
                            });
                          }}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select an icon" />
                          </SelectTrigger>

                          <SelectContent>
                            {annotationIcons.map((icon) => (
                              <SelectItem key={icon.value} value={icon.value}>
                                {icon.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}
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
