import { Spinner } from "@srms/components/ui-custom/Spinner";
import { FunctionComponent } from "react";

import {
  DraggableModal,
  DraggableModalBody,
  DraggableModalContent,
  DraggableModalDescription,
  DraggableModalHeader,
  DraggableModalTitle,
} from "@srms/components/ui/DraggableModal";

import StreetView from "../streetView/StreetView";
import { usePositionStore } from "@srms/components/stores/usePositionStore";

interface StreetViewMapCardProps {
  open: boolean;
  onOpenChange?(open: boolean): void;
}

const StreetViewMapCard: FunctionComponent<StreetViewMapCardProps> = ({ open, onOpenChange }) => {
  // zustand initialization
  const { lat, lng } = usePositionStore();

  return (
    <DraggableModal open={open} onOpenChange={onOpenChange}>
      <DraggableModalContent className="top-2 !right-2 h-auto w-[1000px]" data-streetview-modal>
        {!lat || !lng ? (
          <Spinner size={"lg"} className="my-8" />
        ) : (
          <>
            <DraggableModalHeader>
              <DraggableModalTitle>{"Street View"}</DraggableModalTitle>
              <DraggableModalDescription>
                {lat}, {lng}
              </DraggableModalDescription>
            </DraggableModalHeader>

            <DraggableModalBody>
              <div className="flex h-[490px] w-full items-center justify-center text-black">
                <StreetView lat={lat} lng={lng} />
              </div>
            </DraggableModalBody>
          </>
        )}
      </DraggableModalContent>
    </DraggableModal>
  );
};

export default StreetViewMapCard;
