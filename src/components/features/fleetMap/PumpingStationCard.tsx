import { useCardStore } from "@srms/components/stores/useCardStore";
import { useLoggerStore } from "@srms/components/stores/useLoggerStore";
import { ChartConfig, ChartContainer } from "@srms/components/ui/Chart";
// import { ChartContainer, ChartTooltip } from "@srms/components/ui/Chart";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@srms/components/ui/Sheet";
import { PumpData } from "@srms/lib/pumpstation/pumpStationType";
import { FunctionComponent, useEffect, useState } from "react";
import { Bar, BarChart, Line, LineChart, XAxis, YAxis } from "recharts";
// import { Bar, BarChart } from "recharts";

const chartData = [
  { month: "January", desktop: 186, mobile: 80 },
  { month: "February", desktop: 305, mobile: 200 },
  { month: "March", desktop: 237, mobile: 120 },
  { month: "April", desktop: 73, mobile: 190 },
  { month: "May", desktop: 209, mobile: 130 },
  { month: "June", desktop: 214, mobile: 140 },
];
const chartConfig = {
  pressure: {
    label: "Desktop",
    color: "#2563eb",
  },
  waterLevel: {
    label: "Mobile",
    color: "#962a0fff",
  },
} satisfies ChartConfig;

interface PumpingStationCardProps {
  open: boolean;
  ps: PumpData;
}

const PumpingStationCard: FunctionComponent<PumpingStationCardProps> = ({ ps, open }) => {
  const [openChange, setOpenChange] = useState(open);
  const { layerToggleCardOpen, setLayerToggleCardOpen, setPumpingStationCardOpen } = useCardStore();
  const { pumpData, setPumpData } = useLoggerStore();
  const [history, setHistory] = useState<PumpData[]>([]);

  useEffect(() => {
    setLayerToggleCardOpen(!layerToggleCardOpen);
    const existingIndex = pumpData.findIndex((p) => p.name === ps.name);
    if (existingIndex >= 0) {
      const updatedPumpData = [...pumpData];
      updatedPumpData[existingIndex] = ps;
      setPumpData(updatedPumpData);
    } else {
      setPumpData([...pumpData, ps]);
    }
  }, []);

  return (
    <>
      <Sheet
        open={openChange}
        onOpenChange={(o: boolean) => {
          setLayerToggleCardOpen(!layerToggleCardOpen);
          setPumpingStationCardOpen(0);
          setOpenChange(o);
        }}
        modal={false}
      >
        <SheetContent
          className="h-[380px] w-full gap-0 border border-stone-300 bg-white text-black"
          side="bottom"
          onInteractOutside={(e) => e.preventDefault()}
        >
          <SheetHeader className="m-5 p-0">
            <SheetTitle className="text-black">
              {ps.name.replace(/ps/i, "Pumping Station ").toUpperCase()}
            </SheetTitle>
            <SheetDescription className="text-stone-600">
              {ps.name.replace(/ps/i, "Pumping Station ").toUpperCase()}
            </SheetDescription>
          </SheetHeader>
          <div className="space-around flex flex-row">
            <ChartContainer config={chartConfig} className="min-h-[200px] w-1/2 h-1/3">
              <LineChart accessibilityLayer data={pumpData.filter((lps) => lps.name === ps.name)}>
                <XAxis
                  dataKey="timestamp"
                  tickFormatter={(value) => {
                    // Format ISO to HH:MM:SS or whatever format you like
                    const date = new Date(value);
                    return `${date.getHours()}:${String(date.getMinutes()).padStart(2, "0")}:${String(
                      date.getSeconds(),
                    ).padStart(2, "0")}`;
                  }}
                  tick={{ fill: "#555", fontSize: 12 }}
                />
                <YAxis
                  display="Pressure"
                  dataKey="pressure"
                  tickLine={false}
                  tickMargin={20}
                  axisLine={false}
                />
                <Line dataKey="waterlevel" stroke={chartConfig.waterLevel.color} radius={4} />
                <Line dataKey="pressure" stroke={chartConfig.pressure.color} radius={4} />
              </LineChart>
              {/* <BarChart accessibilityLayer data={chartData}>
                  <Bar dataKey="desktop" fill="var(--color-desktop)" radius={4} />
                  <Bar dataKey="mobile" fill="var(--color-mobile)" radius={4} />
                </BarChart> */}
            </ChartContainer>
            <div key={ps.name} className="w-1/2 h-1/2 rounded-lg border bg-white p-4 shadow-sm">
              {" "}
              <h2 className="text-lg font-semibold text-blue-700">
                {ps.name.replace(/ps/i, "Pumping Station ").toUpperCase()}
              </h2>{" "}
              <div className="mt-2 space-y-1 text-sm text-gray-700">
                {" "}
                <p>💧 Water Level: {ps.waterlevel.toFixed(2)}</p> <p>⚙️ Pressure: {ps.pressure.toFixed(2)}</p>{" "}
                <p>🌊 Flowmeter: {ps.flowmeter.toFixed(2)}</p> <p>🔬 Turbidity: {ps.turbidity.toFixed(2)}</p>{" "}
                <p>💨 Humidity: {ps.humidity.toFixed(2)}</p> <p>☣️ Chlorine: {ps.chlorine.toFixed(2)}</p>{" "}
              </div>{" "}
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
};

export default PumpingStationCard;
