import { AccordionContent, AccordionTrigger } from "@radix-ui/react-accordion";
import { FunctionComponent, useState, useRef, useEffect } from "react";
import { Button } from "@srms/components/ui/Button";
import { Input } from "@srms/components/ui/Input";

interface WebSocketTestProps {}

interface PumpData {
  name: string;
  waterlevel: number;
  pressure: number;
  flowmeter: number;
  turbidity: number;
  humidity: number;
  chlorine: number;
}

const WebSocketTest: FunctionComponent<WebSocketTestProps> = () => {
  const [wsUrl, setWsUrl] = useState("ws://172.20.10.58:7575");
  const [isConnected, setIsConnected] = useState(false);
  const [data, setData] = useState<Record<string, PumpData>>({});
  const wsRef = useRef<WebSocket | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const handleConnect = () => {
    if (isConnected) return;
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
      }, 200);
    };

    ws.onmessage = (event) => {
      try {
        // Try parsing JSON — only update UI if it’s valid JSON
        const jsonData = JSON.parse(event.data);
        setData(jsonData);
      } catch {
        // Ignore non-JSON messages
      }
    };

    ws.onerror = (err) => {
      console.error("⚠️ WebSocket Error:", err);
    };

    ws.onclose = () => {
      setIsConnected(false);
      console.log("🔴 Disconnected");
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

      <AccordionContent className="flex flex-col gap-4 text-balance p-4">
        <div className="flex items-center gap-2">
          <Input
            type="text"
            value={wsUrl}
            onChange={(e) => setWsUrl(e.target.value)}
            placeholder="Enter WebSocket URL"
            className="flex-1 text-black placeholder:text-gray-400"
          />
          <Button onClick={handleConnect} disabled={isConnected}>
            {isConnected ? "Connected" : "Connect"}
          </Button>
        </div>

        {Object.keys(data).length === 0 ? (
          <p className="text-gray-500 italic mt-4">Waiting for JSON data...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
            {Object.values(data).map((ps) => (
              <div
                key={ps.name}
                className="rounded-lg border p-4 bg-white shadow-sm"
              >
                <h2 className="text-lg font-semibold text-blue-700">{ps.name.toUpperCase()}</h2>
                <div className="text-sm text-gray-700 mt-2 space-y-1">
                  <p>💧 Water Level: {ps.waterlevel.toFixed(2)}</p>
                  <p>⚙️ Pressure: {ps.pressure.toFixed(2)}</p>
                  <p>🌊 Flowmeter: {ps.flowmeter.toFixed(2)}</p>
                  <p>🔬 Turbidity: {ps.turbidity.toFixed(2)}</p>
                  <p>💨 Humidity: {ps.humidity.toFixed(2)}</p>
                  <p>☣️ Chlorine: {ps.chlorine.toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </AccordionContent>
    </>
  );
};

export default WebSocketTest;
