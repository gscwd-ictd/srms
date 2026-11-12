"use client";

import * as React from "react";
import Draggable from "react-draggable";
import { Maximize, Minus, XIcon } from "lucide-react";
import { cn } from "@srms/utils/shadcn";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

/* ---------------- ROOT ---------------- */

type DraggableModalContextType = {
  open: boolean;
  setOpen: (open: boolean) => void;
  isMinimized: boolean;
  setIsMinimized: (val: boolean) => void;
};

const DraggableModalContext = React.createContext<DraggableModalContextType | null>(null);

function useDraggableModal() {
  const ctx = React.useContext(DraggableModalContext);
  if (!ctx) throw new Error("DraggableModal components must be used within <DraggableModal>");
  return ctx;
}

function DraggableModal({
  open,
  onOpenChange,
  children,
}: {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
}) {
  const [internalOpen, setInternalOpen] = useState<boolean>(false);
  const [isMinimized, setIsMinimized] = useState<boolean>(false);
  const isControlled = open !== undefined;
  const currentOpen = isControlled ? open : internalOpen;

  const setOpen = (val: boolean) => {
    if (!isControlled) setInternalOpen(val);
    onOpenChange?.(val);
  };

  return (
    <DraggableModalContext.Provider value={{ open: currentOpen, setOpen, isMinimized, setIsMinimized }}>
      {children}
    </DraggableModalContext.Provider>
  );
}

/* ---------------- TRIGGER ---------------- */

function DraggableModalTrigger({ children }: { children: React.ReactNode }) {
  const { setOpen } = useDraggableModal();

  return <div onClick={() => setOpen(true)}>{children}</div>;
}

/* ---------------- OVERLAY ---------------- */

// function DraggableModalOverlay() {
//   const { open, setOpen } = useDraggableModal();

//   if (!open) return null;

//   return <div className="fixed inset-0 z-[9998] bg-black/50" onClick={() => setOpen(false)} />;
// }

/* ---------------- CONTENT (DRAGGABLE) ---------------- */

function DraggableModalContent({
  className,
  children,
  enableCloseButton = true,

  ...props
}: React.HTMLAttributes<HTMLDivElement> & {
  enableCloseButton?: boolean;
}) {
  const { open, setOpen, isMinimized, setIsMinimized } = useDraggableModal();
  const nodeRef = React.useRef<HTMLDivElement>(null);

  if (!open) return null;

  return (
    <>
      {/* <DraggableModalOverlay /> */}
      <AnimatePresence>
        {open && (
          <>
            {/* black overlay */}
            {/* <motion.div
              className="fixed inset-0 z-[9998]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
            /> */}

            <Draggable nodeRef={nodeRef} handle=".drag-handle" bounds="body">
              <div
                ref={nodeRef}
                className={cn(
                  "fixed z-80 flex-col rounded-lg bg-white shadow-lg",

                  className,
                )}
                {...props}
              >
                <motion.div
                  ref={nodeRef}
                  initial={{ opacity: 0, scale: 1 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1 }}
                  transition={{ duration: 0.2 }}
                >
                  {children}
                </motion.div>

                {enableCloseButton && (
                  <>
                    <button
                      onClick={() => setIsMinimized(!isMinimized)}
                      className="absolute top-3 right-12 z-[9999] text-gray-500 hover:text-black"
                    >
                      {isMinimized ? <Maximize className="size-5" /> : <Minus className="size-5" />}
                    </button>
                    <button
                      onClick={() => setOpen(false)}
                      className="absolute top-3 right-3 z-[9999] text-gray-500 hover:text-black"
                    >
                      <XIcon className="size-5" />
                    </button>
                  </>
                )}
              </div>
            </Draggable>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

/* ---------------- STRUCTURE ---------------- */

function DraggableModalHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "drag-handle ui-color-base primary-text-color flex cursor-move flex-col gap-1.5 rounded-lg p-4",
        className,
      )}
      {...props}
    />
  );
}

function DraggableModalFooter({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("mt-auto flex flex-col gap-2 p-4", className)} {...props} />;
}

function DraggableModalTitle({ className, ...props }: React.ComponentProps<"h2">) {
  return <h2 className={cn("text-lg font-semibold", className)} {...props} />;
}

function DraggableModalDescription({ className, ...props }: React.ComponentProps<"p">) {
  return <p className={cn("text-sm text-gray-500", className)} {...props} />;
}

function DraggableModalBody({
  className,
  children,
  ...props
}: React.ComponentProps<"div"> & { isMinimized?: boolean }) {
  const { isMinimized } = useDraggableModal(); // access state

  return (
    <AnimatePresence>
      {!isMinimized && (
        <motion.div
          key="body"
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="overflow-hidden"
        >
          <div className={cn("max-h-[80vh] overflow-y-auto px-4 pb-4", className)} {...props}>
            {children}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ---------------- EXPORTS ---------------- */

export {
  DraggableModal,
  DraggableModalTrigger,
  DraggableModalContent,
  DraggableModalHeader,
  DraggableModalFooter,
  DraggableModalTitle,
  DraggableModalDescription,
  DraggableModalBody,
};
