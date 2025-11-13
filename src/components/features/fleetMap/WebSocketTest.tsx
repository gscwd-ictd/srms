import { FunctionComponent, useState, useRef, useEffect } from "react";
import { Button } from "@srms/components/ui/Button";
import { Input } from "@srms/components/ui/Input";
import React from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@srms/components/ui/Accordion";
import PumpingStationCard from "./PumpingStationCard";
import { useCardStore } from "@srms/components/stores/useCardStore";
import { PumpData } from "@srms/lib/pumpstation/pumpStationType";
import { useLoggerStore } from "@srms/components/stores/useLoggerStore";

interface WebSocketTestProps {}

const WebSocketTest: FunctionComponent<WebSocketTestProps> = () => {
  const [wsUrl, setWsUrl] = useState("ws://172.20.10.58:7575");
  const [isConnected, setIsConnected] = useState(false);
  const [data, setData] = useState<Record<string, PumpData>>({});
  const wsRef = useRef<WebSocket | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const { pumpingStationCardOpen, setPumpingStationCardOpen } = useCardStore();
  const { pumpData, setPumpData } = useLoggerStore();

  const handleConnect = () => {
    if (isConnected) {
      setIsConnected(false);
      console.log("🔴 Disconnected");
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }
    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;

    ws.onopen = () => {
      setIsConnected(true);
      console.log("🟢 Connected to", wsUrl);

      // Send "hello" every 200ms
      intervalRef.current = setInterval(() => {
        if (ws.readyState === WebSocket.OPEN) {
          ws.send("hello");
        }
      }, 1500);
    };

    ws.onmessage = (event) => {
      try {
        const jsonData = JSON.parse(event.data);
        const timestamp = new Date().toLocaleString("en-PH", {
          timeZone: "Asia/Manila",
        });
        // Update local data (for UI)
        setData(jsonData);

        // ✅ Append new pump readings to store
        setPumpData((prev) => {
          const newEntries = Object.values(jsonData) as PumpData[];
          const entriesWithTimestamp = newEntries.map((entry) => ({
            ...entry,
            timestamp,
          }));

          const updated = [...prev, ...entriesWithTimestamp];
          return updated.slice(-500);
        });
      } catch (err) {
        console.warn("Non-JSON message ignored:", event.data);
      }
    };

    ws.onerror = (err) => {
      console.error("⚠️ WebSocket Error:", err);
    };

    ws.onclose = () => {
      setIsConnected(false);
      console.log("🔴 Disconnected");
      setData({});
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  };

  // Cleanup
  useEffect(() => {
    return () => {
      wsRef.current?.close();
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return (
    <>
      <div className="flex cursor-pointer items-center space-x-2 p-2">
        <AccordionTrigger className="items-center">
          <p className="text-md font-bold text-black">Real-time Water Station Data</p>
        </AccordionTrigger>
      </div>
      <Accordion className="accordion" type="multiple">
        <AccordionContent className="flex flex-col gap-4 p-4 text-balance">
          <div className="flex items-center gap-2">
            <Input
              type="text"
              value={wsUrl}
              onChange={(e) => setWsUrl(e.target.value)}
              placeholder="Enter WebSocket URL"
              className="flex-1 text-black placeholder:text-gray-400"
            />
            <Button
              onClick={handleConnect}
              className={isConnected ? "bg-green-500 hover:bg-green-600" : "bg-red-500 hover:bg-red-600"}
            >
              {isConnected ? "Connected" : "Connect"}
            </Button>
          </div>

          {Object.keys(data).length === 0 ? (
            <p className="mt-4 text-gray-500 italic">Waiting for JSON data...</p>
          ) : (
            <div className="overflow-y-auto rounded-xl border bg-white p-4 shadow-md">
              <h2 className="mb-4 flex items-center text-lg font-bold text-black">PUMPING STATIONS</h2>

              <div className="space-y-4">
                {Object.values(data).map((ps: PumpData, index: number) => (
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

export default WebSocketTest;
