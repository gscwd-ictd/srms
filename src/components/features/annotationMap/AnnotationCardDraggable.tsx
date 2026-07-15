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
import { createAnnotationStyle } from "@srms/components/functions/annotationStyle";

interface AddAnnotationCardProps {
  open: boolean;
  onOpenChange?(open: boolean): void;
}

const AnnotationCard: FunctionComponent<AddAnnotationCardProps> = ({ open, onOpenChange }) => {
  const {
    // selectedFeature,
    // selectedBorderColor,
    setSelectedBorderColor,
    // selectedFillColor,
    setSelectedFillColor,

    selectedAnnotationId,
    annotations,
    updateAnnotation,
  } = useAnnotationStore();

  // const [title, setTitle] = useState("");
  // const [description, setDescription] = useState("");
  // const [borderColor, setBorderColor] = useState("#000000");
  // const [fillColor, setFillColor] = useState("#000000");

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
                        const color = e.target.value;

                        updateAnnotation(selectedAnnotation.id, {
                          fillColor: color,
                        });

                        selectedAnnotation.feature.set("fillColor", color);

                        const geometryType = selectedAnnotation.feature.getGeometry()?.getType();

                        selectedAnnotation.feature.setStyle(
                          createAnnotationStyle(geometryType, selectedAnnotation.borderColor, color),
                        );

                        setSelectedFillColor(color);
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
                      <Label>Border Color</Label>

                      <div className="flex items-center justify-start gap-2">
                        <input
                          type="color"
                          value={selectedAnnotation?.borderColor ?? "#000000"}
                          onChange={(e) => {
                            const color = e.target.value;

                            updateAnnotation(selectedAnnotation.id, {
                              borderColor: color,
                            });

                            selectedAnnotation.feature.set("borderColor", color);

                            const geometryType = selectedAnnotation.feature.getGeometry()?.getType();

                            selectedAnnotation.feature.setStyle(
                              createAnnotationStyle(geometryType, color, selectedAnnotation.fillColor),
                            );

                            setSelectedBorderColor(color);
                          }}
                        />

                        <p className="w-18">{selectedAnnotation?.borderColor}</p>
                      </div>
                    </div>

                    <div className="flex flex-col text-sm">
                      <Label>Fill Color</Label>

                      <div className="flex items-center justify-start gap-2">
                        <input
                          type="color"
                          value={selectedAnnotation?.fillColor ?? "#000000"}
                          onChange={(e) => {
                            updateAnnotation(selectedAnnotation.id, {
                              fillColor: e.target.value,
                            });
                            setSelectedFillColor(e.target.value);
                          }}
                        />

                        <p className="w-18">{selectedAnnotation?.fillColor}</p>
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
