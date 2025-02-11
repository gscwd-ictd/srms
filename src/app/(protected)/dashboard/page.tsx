import { Test } from "@srms/components/features/Test";
import { TestButton } from "@srms/components/features/TestButton";
import { WebMap } from "@srms/components/features/WebMap";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default function DashboardPage() {
  return (
    <WebMap>
      <TestButton />
      <Test />
    </WebMap>
  );
}
