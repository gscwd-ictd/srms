import React, { useState, useEffect, useRef } from "react";
import { Settings, Move, Undo, ChevronDown } from "lucide-react";
import { Button } from "@srms/components/ui/Button";
import { Card, CardContent } from "@srms/components/ui/Card";
import { Slider } from "@srms/components/ui/Slider";
import { Switch } from "@srms/components/ui/Switch";
import { Popover, PopoverContent, PopoverTrigger } from "@srms/components/ui/Popover";
import { Label } from "@srms/components/ui/Label";
import { Separator } from "@srms/components/ui/Separator";
import { cn } from "@srms/utils/shadcn";

const PolygonDrawingTool = () => {
  const [drawingMode, setDrawingMode] = useState(false);
  const [snapEnabled, setSnapEnabled] = useState(true);
  const [settings, setSettings] = useState({
    fillColor: "#3B82F6",
    strokeColor: "#1E40AF",
    strokeWidth: 2,
    snapTolerance: 10,
    snapToEdge: true,
    snapToVertex: true,
  });

  const [points, setPoints] = useState([]);
  const [previewPoint, setPreviewPoint] = useState(null);
  const [polygons, setPolygons] = useState([]);
  const canvasRef = useRef(null);
  const containerRef = useRef(null);

  // Handle canvas resize
  useEffect(() => {
    const resizeCanvas = () => {
      const canvas = canvasRef.current;
      const container = containerRef.current;
      if (canvas && container) {
        canvas.width = container.clientWidth;
        canvas.height = container.clientHeight;
        redrawCanvas();
      }
    };

    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();
    return () => window.removeEventListener("resize", resizeCanvas);
  }, []);

  // Draw function
  const redrawCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw existing polygons
    polygons.forEach((polygon) => {
      ctx.beginPath();
      ctx.moveTo(polygon[0].x, polygon[0].y);
      polygon.forEach((point, index) => {
        if (index > 0) ctx.lineTo(point.x, point.y);
      });
      ctx.closePath();
      ctx.fillStyle = settings.fillColor + "40"; // Add transparency to fill
      ctx.fill();
      ctx.strokeStyle = settings.strokeColor;
      ctx.lineWidth = settings.strokeWidth;
      ctx.stroke();
    });

    // Draw current polygon
    if (points.length > 0) {
      ctx.beginPath();
      ctx.moveTo(points[0].x, points[0].y);
      points.forEach((point, index) => {
        if (index > 0) ctx.lineTo(point.x, point.y);
      });
      if (previewPoint) {
        ctx.lineTo(previewPoint.x, previewPoint.y);
      }
      ctx.strokeStyle = settings.strokeColor;
      ctx.lineWidth = settings.strokeWidth;
      ctx.stroke();
    }

    // Draw points
    points.forEach((point) => {
      ctx.beginPath();
      ctx.arc(point.x, point.y, 4, 0, Math.PI * 2);
      ctx.fillStyle = settings.strokeColor;
      ctx.fill();
    });

    // Draw preview point
    if (previewPoint) {
      ctx.beginPath();
      ctx.arc(previewPoint.x, previewPoint.y, 4, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(59, 130, 246, 0.5)";
      ctx.fill();
    }
  };

  // Snap function
  const findSnapPoint = (x, y) => {
    if (!snapEnabled) return { x, y };

    const snapPoint = { x, y };
    let minDistance = settings.snapTolerance;

    // Snap to vertices
    if (settings.snapToVertex) {
      [...points, ...polygons.flat()].forEach((point) => {
        const distance = Math.sqrt(Math.pow(x - point.x, 2) + Math.pow(y - point.y, 2));
        if (distance < minDistance) {
          snapPoint.x = point.x;
          snapPoint.y = point.y;
          minDistance = distance;
        }
      });
    }

    // Snap to edges
    if (settings.snapToEdge) {
      const checkEdge = (p1, p2) => {
        const A = x - p1.x;
        const B = y - p1.y;
        const C = p2.x - p1.x;
        const D = p2.y - p1.y;

        const dot = A * C + B * D;
        const lenSq = C * C + D * D;
        let param = -1;

        if (lenSq !== 0) param = dot / lenSq;

        let xx, yy;

        if (param < 0) {
          xx = p1.x;
          yy = p1.y;
        } else if (param > 1) {
          xx = p2.x;
          yy = p2.y;
        } else {
          xx = p1.x + param * C;
          yy = p1.y + param * D;
        }

        const distance = Math.sqrt(Math.pow(x - xx, 2) + Math.pow(y - yy, 2));
        if (distance < minDistance) {
          snapPoint.x = xx;
          snapPoint.y = yy;
          minDistance = distance;
        }
      };

      // Check current polygon edges
      if (points.length > 1) {
        for (let i = 1; i < points.length; i++) {
          checkEdge(points[i - 1], points[i]);
        }
      }

      // Check existing polygons edges
      polygons.forEach((polygon) => {
        for (let i = 0; i < polygon.length; i++) {
          const nextIndex = (i + 1) % polygon.length;
          checkEdge(polygon[i], polygon[nextIndex]);
        }
      });
    }

    return snapPoint;
  };

  // Mouse event handlers
  const handleMouseMove = (e) => {
    if (!drawingMode) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const snappedPoint = findSnapPoint(x, y);
    setPreviewPoint(snappedPoint);
    redrawCanvas();
  };

  const handleClick = (e) => {
    if (!drawingMode) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const snappedPoint = findSnapPoint(x, y);

    // Check if clicking near the start point to close the polygon
    if (points.length > 2) {
      const startPoint = points[0];
      const distance = Math.sqrt(
        Math.pow(snappedPoint.x - startPoint.x, 2) + Math.pow(snappedPoint.y - startPoint.y, 2),
      );

      if (distance < settings.snapTolerance) {
        setPolygons([...polygons, [...points]]);
        setPoints([]);
        setPreviewPoint(null);
        redrawCanvas();
        return;
      }
    }

    setPoints([...points, snappedPoint]);
    redrawCanvas();
  };

  const handleUndo = () => {
    if (points.length > 0) {
      setPoints(points.slice(0, -1));
      redrawCanvas();
    }
  };

  // Color Picker Component
  const ColorPicker = ({ label, value, onChange }) => (
    <div className="flex items-center justify-between">
      <Label className="text-sm">{label}</Label>
      <div className="flex items-center gap-2">
        <div
          className="h-8 w-8 cursor-pointer rounded border"
          style={{ backgroundColor: value }}
          onClick={() => document.getElementById(label).click()}
        />
        <input id={label} type="color" value={value} onChange={onChange} className="hidden" />
      </div>
    </div>
  );

  // Settings panel
  const SettingsPanel = () => (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Settings className="h-4 w-4" />
          Settings
          <ChevronDown className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="space-y-4">
          <ColorPicker
            label="Fill Color"
            value={settings.fillColor}
            onChange={(e) => setSettings({ ...settings, fillColor: e.target.value })}
          />
          <ColorPicker
            label="Stroke Color"
            value={settings.strokeColor}
            onChange={(e) => setSettings({ ...settings, strokeColor: e.target.value })}
          />

          <Separator />

          <div className="space-y-2">
            <Label className="text-sm">Stroke Width</Label>
            <Slider
              value={[settings.strokeWidth]}
              min={1}
              max={10}
              step={1}
              onValueChange={([value]) => setSettings({ ...settings, strokeWidth: value })}
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm">Snap Tolerance</Label>
            <Slider
              value={[settings.snapTolerance]}
              min={5}
              max={50}
              step={1}
              onValueChange={([value]) => setSettings({ ...settings, snapTolerance: value })}
            />
          </div>

          <Separator />

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-sm">Enable Snap</Label>
              <Switch checked={snapEnabled} onCheckedChange={setSnapEnabled} />
            </div>

            <div className="flex items-center justify-between">
              <Label className="text-sm">Snap to Edge</Label>
              <Switch
                checked={settings.snapToEdge}
                onCheckedChange={(checked) => setSettings({ ...settings, snapToEdge: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label className="text-sm">Snap to Vertex</Label>
              <Switch
                checked={settings.snapToVertex}
                onCheckedChange={(checked) => setSettings({ ...settings, snapToVertex: checked })}
              />
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );

  return (
    <Card className="w-full">
      <CardContent className="p-6">
        <div className="mb-4 flex items-center gap-2">
          <Button
            variant={drawingMode ? "default" : "outline"}
            className="gap-2"
            onClick={() => setDrawingMode(!drawingMode)}
          >
            {drawingMode ? (
              <>
                <Move className="h-4 w-4" />
                Move
              </>
            ) : (
              <>
                <Settings className="h-4 w-4" />
                Draw
              </>
            )}
          </Button>

          <Button variant="outline" className="gap-2" onClick={handleUndo} disabled={points.length === 0}>
            <Undo className="h-4 w-4" />
            Undo
          </Button>

          <SettingsPanel />
        </div>

        <div className="relative h-96 w-full" ref={containerRef}>
          <canvas
            ref={canvasRef}
            className="border-border bg-background h-full w-full rounded-lg border"
            onMouseMove={handleMouseMove}
            onClick={handleClick}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default PolygonDrawingTool;
