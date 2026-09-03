"use client";

import "leaflet/dist/leaflet.css";
import { useEffect, useMemo, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import { MERCHANT_CATEGORY_LABEL, MERCHANT_CATEGORY_PHOTO_FALLBACK } from "@/lib/labels";
import { googleMapsUrl } from "@/lib/geo";
import type { MerchantCategory } from "@/generated/prisma/enums";
import type { MerchantMapData } from "./MerchantCard";

// 카테고리별 이모지 핀 (카드 UI의 MERCHANT_CATEGORY_PHOTO_FALLBACK과 동일한 이모지 사용)
const categoryPinIconCache = new Map<MerchantCategory, L.DivIcon>();
function categoryPinIcon(category: MerchantCategory): L.DivIcon {
  const cached = categoryPinIconCache.get(category);
  if (cached) return cached;
  const emoji = MERCHANT_CATEGORY_PHOTO_FALLBACK[category].emoji;
  const icon = L.divIcon({
    className: "gaji-pin",
    html: `<div style="width:30px;height:30px;border-radius:50% 50% 50% 0;background:#fff;border:2px solid #6b4fa0;box-shadow:0 2px 6px rgba(43,36,64,.3);transform:rotate(-45deg);display:flex;align-items:center;justify-content:center;">
      <span style="transform:rotate(45deg);font-size:15px;line-height:1;">${emoji}</span>
    </div>`,
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -30],
  });
  categoryPinIconCache.set(category, icon);
  return icon;
}

// 내 현재 위치 — '가지' 아이콘 + 펄스 링
const mePinIcon = L.divIcon({
  className: "gaji-pin-me",
  html: `<div style="position:relative;width:34px;height:34px;display:flex;align-items:center;justify-content:center;">
    <div style="position:absolute;width:34px;height:34px;border-radius:50%;background:rgba(107,79,160,.22);animation:gaji-pulse 2s ease-out infinite;"></div>
    <div style="position:relative;width:22px;height:22px;border-radius:50%;background:#4a2e7a;border:2.5px solid #fff;box-shadow:0 2px 6px rgba(43,36,64,.4);display:flex;align-items:center;justify-content:center;font-size:12px;line-height:1;">🍆</div>
  </div>
  <style>@keyframes gaji-pulse{0%{transform:scale(.6);opacity:.9;}100%{transform:scale(1.9);opacity:0;}}</style>`,
  iconSize: [34, 34],
  iconAnchor: [17, 17],
  popupAnchor: [0, -17],
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
            <Marker
              key={m.id}
              position={[m.latitude as number, m.longitude as number]}
              icon={categoryPinIcon(m.category)}
            >
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
