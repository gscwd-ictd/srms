import { useCardStore } from "@srms/components/stores/useCardStore";
import { usePumpingStationStore } from "@srms/components/stores/usePumpingStationStore";
import { ChartConfig, ChartContainer } from "@srms/components/ui/Chart";
// import { ChartContainer, ChartTooltip } from "@srms/components/ui/Chart";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@srms/components/ui/Sheet";
import { PumpData } from "@srms/lib/pumpstation/pumpStationType";
import { FunctionComponent, useEffect, useState } from "react";
import { Legend, Line, LineChart, Tooltip, XAxis, YAxis } from "recharts";
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
    color: "#13e062ff",
  },
  waterLevel: {
    color: "#1613c2ff",
  },
  flowMeter: {
    color: "#1dc2b4ff",
  },
  turbidity: {
    color: "#5f5e5dff",
  },
  humidity: {
    color: "#dfe21fff",
  },
  chlorine: {
    color: "#e93d09ff",
  },
} satisfies ChartConfig;

interface PumpingStationCardProps {
  open: boolean;
  ps: PumpData;
}

const PumpingStationCard: FunctionComponent<PumpingStationCardProps> = ({ ps, open }) => {
  const [openChange, setOpenChange] = useState(open);
  const { layerToggleCardOpen, setLayerToggleCardOpen, setPumpingStationCardOpen } = useCardStore();
  const { pumpData, setPumpData } = usePumpingStationStore();
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
            <ChartContainer config={chartConfig} className="h-1/3 min-h-[200px] w-1/2 px-4">
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
                <YAxis display="Pressure" tickLine={false} tickMargin={20} axisLine={false} />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      // sort descending by value
                      const sorted = [...payload].sort((a, b) => Number(b.value ?? 0) - Number(a.value ?? 0));
                      var formattedTime = "NAN";
                      try {
                        // format time for Philippine timezone
                        formattedTime = new Intl.DateTimeFormat("en-PH", {
                          hour: "2-digit",
                          minute: "2-digit",
                          second: "2-digit",
                          timeZone: "Asia/Manila",
                        }).format(new Date(label));
                      } catch (e) {}

                      return (
                        <div
                          className="rounded-md border bg-white p-2 text-sm shadow-md"
                          style={{ lineHeight: "1.2em" }}
                        >
                          <p className="mb-1 font-semibold">{formattedTime}</p>
                          {sorted.map((entry, index) => (
                            <p key={index} style={{ color: entry.color }}>
                              {entry.name} : {Number(entry.value).toFixed(2)}
                            </p>
                          ))}
                        </div>
                      );
                    }
                    return null;
                  }}
                />

                {/* 🟩 Add legend here */}
                <Legend verticalAlign="top" align="center" />
                <Line dataKey="waterlevel" stroke={chartConfig.waterLevel.color} radius={8} />
                <Line dataKey="pressure" stroke={chartConfig.pressure.color} radius={8} />
                <Line dataKey="flowmeter" stroke={chartConfig.flowMeter.color} radius={8} />
                <Line dataKey="turbidity" stroke={chartConfig.turbidity.color} radius={8} />
                <Line dataKey="humidity" stroke={chartConfig.humidity.color} radius={8} />
                <Line dataKey="chlorine" stroke={chartConfig.chlorine.color} radius={8} width={40} />
              </LineChart>
              {/* <BarChart accessibilityLayer data={chartData}>
                  <Bar dataKey="desktop" fill="var(--color-desktop)" radius={4} />
                  <Bar dataKey="mobile" fill="var(--color-mobile)" radius={4} />
                </BarChart> */}
            </ChartContainer>
            <div className="px-4 px-4 h-1/2 w-1/2 ">
              <div key={ps.name} className="rounded-lg border bg-white shadow-sm p-2">
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
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
};

export default PumpingStationCard;
