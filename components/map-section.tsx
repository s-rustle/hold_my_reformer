"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const DEFAULT_CENTER: [number, number] = [37.7749, -122.4194];

function MapInner() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || typeof window === "undefined") {
    return (
      <div className="flex h-full min-h-[160px] items-center justify-center bg-[var(--hmr-forest-mid)] text-sm font-medium text-[var(--hmr-bg-text)]">
        Loading map…
      </div>
    );
  }

  const L = require("leaflet");
  const { MapContainer, TileLayer, Marker, Popup } = require("react-leaflet");
  /* Leaflet CSS is imported in globals.css to avoid HMR module factory errors */

  delete (L.Icon.Default.prototype as unknown as { _getIconUrl?: unknown })._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
    iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
    shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
  });

  return (
    <MapContainer
      center={DEFAULT_CENTER}
      zoom={14}
      scrollWheelZoom={false}
      className="h-full w-full rounded-[var(--hmr-radius-sm)]"
      style={{ minHeight: 160 }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={DEFAULT_CENTER}>
        <Popup>Hold My Reformer — Pilates Studio</Popup>
      </Marker>
    </MapContainer>
  );
}

export const MapSection = dynamic(() => Promise.resolve(MapInner), { ssr: false });
