"use client";

import { Loader } from "@googlemaps/js-api-loader";
import React, { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";

const loader = new Loader({
  apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAP_KEY!,
  version: "weekly",
  libraries: ["places"],
});

interface Point {
  lat: number;
  lng: number;
  elevation: number;
  time: number;
}

interface MapProps {
  address: string;
  coords: Point[];
}

export default function Map({ address, coords = [] }: MapProps) {
  const mapEl = useRef(null);

  function drawPath(map: google.maps.Map, coords: Point[]) {
    const c = coords.map((point: any) => ({
      lat: Number(point.lat),
      lng: Number(point.lng),
    }));
    new google.maps.Polyline({
      path: c,
      geodesic: true,
      strokeColor: "#FF0000",
      strokeOpacity: 1,
      strokeWeight: 2,
      map: map,
    });
  }

  useEffect(() => {
    async function loadMap() {
      const maps = await loader.importLibrary("maps");
      const geocoder = new google.maps.Geocoder();
      geocoder.geocode({ address: address }, (results, status) => {
        if (status === "OK" && results) {
          if (mapEl.current) {
            const map = new maps.Map(mapEl.current, {
              center: results[0].geometry.location,
              zoom: 12,
            });
            const marker = new google.maps.Marker({
              map: map,
              position: results[0].geometry.location,
            });
            drawPath(map, coords);
          }
        } else {
          console.error(
            `Geocode was not successful for the following reason: ${status}`
          );
        }
      });
    }
    loadMap();
  }, [address]);

  return (
    <div>
      <Button>Load</Button>
      <div ref={mapEl} className="w-full h-screen"></div>
    </div>
  );
}
