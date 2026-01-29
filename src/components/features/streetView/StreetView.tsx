"use client";

import { useEffect, useRef } from "react";
import { importLibrary } from "@googlemaps/js-api-loader";
import { initGoogleMaps } from "./InitializeMap";

interface StreetViewProps {
  lat: number;
  lng: number;
}

export default function StreetView({ lat, lng }: StreetViewProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  initGoogleMaps();

  useEffect(() => {
    let cancelled = false;
    let panorama: google.maps.StreetViewPanorama | null = null;

    async function initStreetView() {
      // Ensure API key is set - separated to another file to avoid multiple initializations
      // setOptions({
      //   key: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
      // });

      // Load Maps library
      await importLibrary("maps");

      if (cancelled || !containerRef.current) {
        console.log("CANCELLED STREET VIEW");
        return;
      } else {
        // Create Street View panorama
        panorama = new google.maps.StreetViewPanorama(containerRef.current, {
          position: { lat, lng },
          pov: { heading: 165, pitch: 0 },
          zoom: 1,
          addressControl: true,
          showRoadLabels: false,
        });

        // Optional: log when tiles are loaded
        google.maps.event.addListenerOnce(panorama, "tilesloaded", () => {
          console.log("Street View loaded!");
        });
      }
    }

    initStreetView();

    return () => {
      cancelled = true;
      if (panorama) {
        // Clear panorama to prevent memory leaks
        panorama.setVisible(false);
        panorama = null;
      }
    };
  }, [lat, lng]);

  return (
    <div className="h-full w-full">
      <div ref={containerRef} className="h-full w-full" />
    </div>
  );
}
