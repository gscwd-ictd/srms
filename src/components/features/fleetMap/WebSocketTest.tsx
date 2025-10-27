import { AccordionContent, AccordionTrigger } from "@radix-ui/react-accordion";
import { Eye, EyeOff } from "lucide-react";
import { FunctionComponent, useState, useRef, useEffect } from "react";
import { Button } from "@srms/components/ui/Button";
import { Input } from "@srms/components/ui/Input";

interface WebSocketTestProps {}

const WebSocketTest: FunctionComponent<WebSocketTestProps> = () => {
  const [wsUrl, setWsUrl] = useState("wss://echo.websocket.org"); // default example
  const [logs, setLogs] = useState<string[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);

  // Connect to WebSocket
  const handleConnect = () => {
    if (isConnected) {
      wsRef.current?.close();
      setIsConnected(false);
      setLogs((prev) => [...prev, "🔴 Disconnected"]);
      return;
    }

    try {
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        setIsConnected(true);
        setLogs((prev) => [...prev, `🟢 Connected to ${wsUrl}`]);
      };

      ws.onmessage = (event) => {
        setLogs((prev) => [...prev, `📩 Message: ${event.data}`]);
      };

      ws.onerror = (error) => {
        setLogs((prev) => [...prev, `⚠️ Error: ${JSON.stringify(error)}`]);
      };

      ws.onclose = () => {
        setIsConnected(false);
        setLogs((prev) => [...prev, "🔴 Connection closed"]);
      };
    } catch (err) {
      setLogs((prev) => [...prev, `❌ Failed to connect: ${err}`]);
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      wsRef.current?.close();
    };
  }, []);

  return (
    <>
      <div className="flex cursor-pointer items-center space-x-2 p-2">
        <AccordionTrigger className="items-center">
          <p className="text-md font-bold text-black">WebSocket Test</p>
        </AccordionTrigger>
      </div>

      <AccordionContent className="flex flex-col gap-4 text-balance p-4">
        <ul className="text-stone-900">
          <li className="flex h-6 items-center">
            <div className="mt-0.5 mr-2 h-4 w-4 rounded-3xl bg-[#1458FC]" />
            WebSocket Test
          </li>
        </ul>

        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <Input
              type="text"
              value={wsUrl}
              onChange={(e) => setWsUrl(e.target.value)}
              placeholder="Enter WebSocket URL"
              className="flex-1 text-black placeholder:text-gray-400"
            />
            <Button onClick={handleConnect} variant={isConnected ? "destructive" : "default"}>
              {isConnected ? "Disconnect" : "Connect"}
            </Button>
          </div>

          <div className="h-40 overflow-y-auto rounded-md border bg-stone-50 p-2 text-sm text-stone-700">
            {logs.length === 0 ? (
              <p className="text-stone-400 italic">No logs yet...</p>
            ) : (
              logs.map((log, i) => (
                <div key={i} className="whitespace-pre-wrap">
                  {log}
                </div>
              ))
            )}
          </div>
        </div>
      </AccordionContent>
    </>
  );
};

export default WebSocketTest;
