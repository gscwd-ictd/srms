import { NextResponse } from "next/server";

const GOOGLE_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!;
const CACHE = new Map<string, unknown>();

type LngLat = [number, number];

interface Road {
  id: string | number;
  geometry: { lat: number; lon: number }[]; // or whatever sampleRoad expects
}

// Helper to generate a cache key per bounding box
function bboxKey(a: number, b: number, c: number, d: number) {
  return `${a.toFixed(3)}:${b.toFixed(3)}:${c.toFixed(3)}:${d.toFixed(3)}`;
}

// Fetch OSM roads in the bounding box
async function fetchRoads(minLat: number, minLng: number, maxLat: number, maxLng: number) {
  const query = `
    [out:json];
    way["highway"]
      (${minLat},${minLng},${maxLat},${maxLng});
    out geom;
  `;
  const res = await fetch("https://overpass-api.de/api/interpreter", {
    method: "POST",
    body: query,
  });
  return (await res.json()).elements;
}

// Sample points along a road every ~50m (adjustable)
function sampleRoad(geom: { lat: number; lon: number }[], step = 0.0005) {
  const pts: number[][] = [];
  for (let i = 1; i < geom.length; i++) {
    const a = geom[i - 1];
    const b = geom[i];
    const d = Math.hypot(b!.lon - a!.lon, b!.lat - a!.lat);
    const steps = Math.ceil(d / step);
    for (let j = 0; j <= steps; j++) {
      pts.push([a!.lon + ((b!.lon - a!.lon) * j) / steps, a!.lat + ((b!.lat - a!.lat) * j) / steps]);
    }
  }
  return pts;
}

// Parallel fetch with throttling
async function parallelLimitWithSleep<T>(
  tasks: (() => Promise<T>)[],
  limit = 6,
  delayMs = 25, // ms delay between starting each task
) {
  const results: T[] = [];
  const executing = new Set<Promise<void>>();

  for (const task of tasks) {
    const p = (async () => {
      const res = await task();
      results.push(res);
    })();

    executing.add(p);

    // Wait if we reached concurrency limit
    if (executing.size >= limit) {
      await Promise.race(executing);
    }

    // Small delay between starting each request
    await new Promise((r) => setTimeout(r, delayMs));

    p.finally(() => executing.delete(p));
  }

  await Promise.all(executing);
  return results;
}

// Convert points into lines
// function pointsToLines(points: number[][], maxGap = 0.0006) {
//   points.sort((a, b) => a[1] - b[1] || a[0] - b[0]);
//   const lines: number[][][] = [];
//   let cur: number[][] = [];

//   for (const p of points) {
//     const prev = cur[cur.length - 1];
//     if (!prev || Math.hypot(p[0] - prev[0], p[1] - prev[1]) < maxGap) {
//       cur.push(p);
//     } else {
//       if (cur.length > 1) lines.push(cur);
//       cur = [p];
//     }
//   }
//   if (cur.length > 1) lines.push(cur);
//   return lines;
// }

// API Handler
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const minLat = Number(searchParams.get("minLat"));
  const minLng = Number(searchParams.get("minLng"));
  const maxLat = Number(searchParams.get("maxLat"));
  const maxLng = Number(searchParams.get("maxLng"));

  // Return cached result if available
  const key = bboxKey(minLat, minLng, maxLat, maxLng);
  if (CACHE.has(key)) return NextResponse.json(CACHE.get(key));

  // Fetch roads from OSM
  const roads = await fetchRoads(minLat, minLng, maxLat, maxLng);

  const roadSamples = roads.map((r: Road) => ({
    roadId: r.id,
    points: sampleRoad(r.geometry),
  }));
  // console.log(roadSamples);
  const lines: number[][][] = [];

  for (const road of roadSamples) {
    const tasks = road.points.map(([lng, lat]: LngLat) => async () => {
      console.log(`Checking Street View at ${lat},${lng}`);

      const res = await fetch(
        `https://maps.googleapis.com/maps/api/streetview/metadata?location=${lat},${lng}&key=${GOOGLE_KEY}`,
      );
      const json = await res.json();
      return json.status === "OK" ? [lng, lat] : null;
    });

    const results = await parallelLimitWithSleep(tasks, 6, 25); // 6 parallel, 25ms delay
    const valid = results.filter((p): p is number[] => Array.isArray(p));

    if (valid.length >= 2) {
      lines.push(valid);
    }
  }

  const geojson = {
    type: "FeatureCollection",
    features: lines.map((l) => ({
      type: "Feature",
      geometry: { type: "LineString", coordinates: l },
    })),
  };

  // Cache for future requests
  CACHE.set(key, geojson);

  return NextResponse.json(geojson);
}
