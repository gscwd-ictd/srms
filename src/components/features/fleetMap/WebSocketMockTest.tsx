import { AccordionTrigger } from "@radix-ui/react-accordion";
import { Accordion, AccordionContent, AccordionItem } from "@srms/components/ui/Accordion";
import { Button } from "@srms/components/ui/Button";
import React, { useEffect, useState } from "react";
import { FunctionComponent } from "react";
import PumpingStationCard from "./PumpingStationCard";
import { mockPumpData, PumpData } from "@srms/lib/pumpstation/pumpStationType";
import { useCardStore } from "@srms/components/stores/useCardStore";
import { usePumpingStationStore } from "@srms/components/stores/usePumpingStationStore";

interface WebSocketMockTestProps {}

const WebSocketMockTest: FunctionComponent<WebSocketMockTestProps> = () => {
  const [latestData, setLatestData] = useState<PumpData[]>([]);
  const { pumpingStationCardOpen, setPumpingStationCardOpen } = useCardStore();
  const { pumpData, setPumpData } = usePumpingStationStore();

  useEffect(() => {
    const loadData = async () => {
      setPumpingStationCardOpen(0);
      await setPumpData(mockPumpData);
      // Get all unique station names
      const stationNames = Array.from(new Set(mockPumpData.map((d) => d.name)));

      // For each station, find the latest timestamp record
      const latestPerStation = stationNames
        .map((station) => {
          const stationData = mockPumpData
            .filter((d) => d.name === station)
            .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
          return stationData[0] ?? mockPumpData[0]; // The latest one
        })
        .filter((d): d is PumpData => d !== undefined); // ✅ removes undefined safely

      setLatestData(latestPerStation);
      console.log(
        `✅ Loaded mock pump data for WebSocketMockTest component. ${latestPerStation.length} stations loaded.`,
      );
    };
    loadData();
  }, []);
  return (
    <>
      <div className="flex cursor-pointer items-center space-x-2 p-2">
        <AccordionTrigger className="items-center">
          <p className="text-md font-bold text-white">Mock Water Station Data</p>
        </AccordionTrigger>
      </div>
      <Accordion className="accordion" type="multiple">
        <AccordionContent className="flex flex-col gap-4 p-4 text-balance">
          {Object.keys(latestData).length === 0 ? (
            <p className="mt-4 text-white italic">Waiting for JSON data...</p>
          ) : (
            <div className="overflow-y-auto rounded-xl border bg-white p-4 shadow-md">
              <h2 className="mb-4 flex items-center text-lg font-bold text-black">PUMPING STATIONS</h2>

              <div className="space-y-4">
                {Object.values(latestData).map((ps: PumpData, index: number) => (
                  <React.Fragment key={ps.name}>
                    <AccordionItem value={ps.name} key={ps.name}>
                      <Button
                        onClick={() => setPumpingStationCardOpen(index + 1)}
                        className="transition-colors hover:bg-green-500 hover:text-white"
                      >
                        <p className="text-md font-bold text-black">
                          {ps.name.replace(/ps/i, "Pumping Station ").toUpperCase()}
                        </p>
                      </Button>

                      {pumpingStationCardOpen == index + 1 ? (
                        <PumpingStationCard open={pumpingStationCardOpen == index + 1} ps={ps} />
                      ) : (
                        ""
                      )}
                    </AccordionItem>
                  </React.Fragment>
                ))}
              </div>
            </div>
          )}
        </AccordionContent>
      </Accordion>
    </>
  );
};

export default WebSocketMockTest;
