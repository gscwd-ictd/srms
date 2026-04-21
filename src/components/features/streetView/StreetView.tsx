"use client";

import { useEffect, useRef, useState } from "react";
import { importLibrary } from "@googlemaps/js-api-loader";
import { initGoogleMaps } from "./InitializeMap";

interface StreetViewProps {
  lat: number;
  lng: number;
}

export default function StreetView({ lat, lng }: StreetViewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [streetViewFound, setStreetViewFound] = useState<boolean>(false);

  useEffect(() => {
    initGoogleMaps();
  }, []);

  useEffect(() => {
    let cancelled = false;
    let panorama: google.maps.StreetViewPanorama | null = null;

    console.log("Initializing Street View at", lat, lng);

    async function initStreetView() {
      setStreetViewFound(true);
      await importLibrary("maps");

      if (cancelled || !containerRef.current) return;

      const streetViewService = new google.maps.StreetViewService();

      streetViewService.getPanorama(
        {
          location: { lat, lng },
          radius: 50, // meters — adjust if needed
        },
        (data, status) => {
          if (cancelled) return;

          if (status !== google.maps.StreetViewStatus.OK || !data) {
            setStreetViewFound(false);
            console.log("❌ No Street View available at", lat, lng);
            return;
          }
          setStreetViewFound(true);
          console.log("✅ Street View found");

          panorama = new google.maps.StreetViewPanorama(containerRef.current!, {
            pano: data.location!.pano,
            pov: { heading: 165, pitch: 0 },
            zoom: 1,
            addressControl: true,
            showRoadLabels: false,
          });

          google.maps.event.addListenerOnce(panorama, "tilesloaded", () => {
            console.log("🧩 Street View tiles loaded");
          });
        },
      );
    }

    initStreetView();

    return () => {
      cancelled = true;
      if (panorama) {
        panorama.setVisible(false);
        panorama = null;
      }
    };
  }, [lat, lng]);

  return (
    <div className="h-full w-full">
      <div ref={containerRef} className="relative flex h-full w-full items-center justify-center">
        {!streetViewFound && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-md bg-white/80 p-4 shadow-md">
            <p className="text-center text-gray-800">No Street View available at this location.</p>
          </div>
        )}
      </div>
    </div>
  );
}
