"use client";

import "leaflet/dist/leaflet.css";
import { useEffect, useMemo, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import { MERCHANT_CATEGORY_LABEL } from "@/lib/labels";
import { googleMapsUrl } from "@/lib/geo";
import type { MerchantMapData } from "./MerchantCard";

const brandPinIcon = L.divIcon({
  className: "gaji-pin",
  html:
    '<div style="width:26px;height:26px;border-radius:50% 50% 50% 0;background:#6b4fa0;border:2px solid #fff;box-shadow:0 2px 6px rgba(0,0,0,.35);transform:rotate(-45deg);"></div>',
  iconSize: [26, 26],
  iconAnchor: [13, 26],
  popupAnchor: [0, -26],
});

const mePinIcon = L.divIcon({
  className: "gaji-pin-me",
  html:
    '<div style="width:16px;height:16px;border-radius:50%;background:#382060;border:3px solid #fff;box-shadow:0 0 0 4px rgba(107,79,160,.25);"></div>',
  iconSize: [16, 16],
  iconAnchor: [8, 8],
});

function FitToMarkers({
  merchants,
  userPos,
}: {
  merchants: MerchantMapData[];
  userPos: [number, number] | null;
}) {
  const map = useMap();
  useEffect(() => {
    const points: [number, number][] = merchants
      .filter((m) => m.latitude !== null && m.longitude !== null)
      .map((m) => [m.latitude as number, m.longitude as number]);
    if (userPos) points.push(userPos);
    if (points.length === 0) return;
    if (points.length === 1) {
      map.setView(points[0], 14);
      return;
    }
    map.fitBounds(L.latLngBounds(points), { padding: [32, 32] });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [merchants, userPos]);
  return null;
}

export default function MerchantMap({ merchants }: { merchants: MerchantMapData[] }) {
  const [userPos, setUserPos] = useState<[number, number] | null>(null);

  useEffect(() => {
    if (typeof navigator === "undefined" || !navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => setUserPos([pos.coords.latitude, pos.coords.longitude]),
      () => {},
      { enableHighAccuracy: false, timeout: 8000, maximumAge: 5 * 60 * 1000 },
    );
  }, []);

  const initialCenter = useMemo<[number, number]>(() => {
    const withCoords = merchants.filter((m) => m.latitude !== null && m.longitude !== null);
    if (withCoords.length === 0) return [36.35, 127.8];
    const lat = withCoords.reduce((sum, m) => sum + (m.latitude as number), 0) / withCoords.length;
    const lng = withCoords.reduce((sum, m) => sum + (m.longitude as number), 0) / withCoords.length;
    return [lat, lng];
  }, [merchants]);

  return (
    <div className="overflow-hidden rounded-3xl border border-neutral-200">
      <MapContainer
        center={initialCenter}
        zoom={11}
        scrollWheelZoom={false}
        style={{ height: "360px", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <FitToMarkers merchants={merchants} userPos={userPos} />
        {userPos && (
          <Marker position={userPos} icon={mePinIcon}>
            <Popup>내 위치</Popup>
          </Marker>
        )}
        {merchants
          .filter((m) => m.latitude !== null && m.longitude !== null)
          .map((m) => (
            <Marker key={m.id} position={[m.latitude as number, m.longitude as number]} icon={brandPinIcon}>
              <Popup>
                <div style={{ minWidth: 180 }}>
                  <p style={{ margin: 0, fontSize: 11, fontWeight: 600, color: "#4a2e7a" }}>
                    {MERCHANT_CATEGORY_LABEL[m.category]}
                  </p>
                  <p style={{ margin: "2px 0 0", fontWeight: 700 }}>{m.name}</p>
                  <p style={{ margin: "4px 0 0", fontSize: 13, color: "#525252" }}>
                    {m.benefitInfo.split("\n")[0]}
                  </p>
                  <a
                    href={googleMapsUrl(m.address)}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ display: "inline-block", marginTop: 6, fontSize: 12, color: "#6b4fa0" }}
                  >
                    지도에서 열기 →
                  </a>
                </div>
              </Popup>
            </Marker>
          ))}
      </MapContainer>
    </div>
  );
}
