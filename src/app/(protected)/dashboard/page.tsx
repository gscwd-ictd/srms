import { Scheduler } from "@srms/components/ui/Scheduler";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default function DashboardPage() {
  return (
    <div className="h-full w-full p-5">
      <Scheduler />
    </div>
  );
}
