"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const DEFAULT_CENTER: [number, number] = [37.7749, -122.4194];

function MapInner() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    queueMicrotask(() => setMounted(true));
  }, []);

  const [mapModules, setMapModules] = useState<{
    L: typeof import("leaflet");
    RL: typeof import("react-leaflet");
  } | null>(null);

  useEffect(() => {
    if (!mounted || typeof window === "undefined") return;
    Promise.all([import("leaflet"), import("react-leaflet")]).then(
      ([L, RL]) => setMapModules({ L: L.default, RL })
    );
  }, [mounted]);

  if (!mounted || !mapModules) {
    return (
      <div className="flex h-full min-h-[160px] items-center justify-center bg-[var(--hmr-forest-mid)] text-sm font-medium text-[var(--hmr-bg-text)]">
        Loading map…
      </div>
    );
  }

  const { L, RL } = mapModules;
  const { MapContainer, TileLayer, Marker, Popup } = RL;
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
