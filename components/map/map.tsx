"use client";

import { Loader } from "@googlemaps/js-api-loader";
import React, { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Point } from "@/actions/activities";

const loader = new Loader({
  apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAP_KEY!,
  version: "weekly",
  libraries: ["places"],
});

interface MapProps {
  address?: string;
  coords?: Point[];
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
      if (address) {
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
    }
    loadMap();
  }, [address]);

  useEffect(() => {
    async function loadMap() {
      console.log(coords);
      const maps = await loader.importLibrary("maps");
      if (mapEl.current) {
        const map = new maps.Map(mapEl.current, {
          center: { lat: Number(coords[0].lat), lng: Number(coords[0].lng) },
          zoom: 13,
        });
        drawPath(map, coords);
      }
    }
    loadMap();
  }, [coords]);

  return (
    <div>
      <Button>Load</Button>
      <div ref={mapEl} className="w-full h-screen"></div>
    </div>
  );
}
