"use client";

import { FunctionComponent } from "react";
import { useSidebar } from "../ui/Sidebar";

export const Collapse: FunctionComponent = () => {
  const { toggleSidebar } = useSidebar();

  return (
    <button className="fixed top-24 left-24 z-50 bg-black text-white" onClick={toggleSidebar}>
      Collapse
    </button>
  );
};
