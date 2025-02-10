import { WebMap } from "@srms/components/features/WebMap";
import { Button } from "@srms/components/ui/Button";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default function DashboardPage() {
  return (
    <>
      <WebMap>
        <Button className="absolute z-50">Test</Button>
      </WebMap>
    </>
  );
}
