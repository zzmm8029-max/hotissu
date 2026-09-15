"use client";

import "leaflet/dist/leaflet.css";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import { MERCHANT_CATEGORY_LABEL, MERCHANT_CATEGORY_PHOTO_FALLBACK } from "@/lib/labels";
import { googleMapsUrl } from "@/lib/geo";
import type { MerchantCategory } from "@/generated/prisma/enums";
import type { MerchantMapData } from "./MerchantCard";

/**
 * 지도 배경(타일) 공급처.
 *
 * OSM 공식 타일 서버(tile.openstreetmap.org)는 이용 정책상 Referer 또는 User-Agent로 호출
 * 주체를 식별할 수 있어야 하고, 식별되지 않으면 오류 타일을 돌려준다. 브라우저 설정·확장
 * 프로그램·Referrer-Policy 때문에 Referer가 빠지는 경우가 있어 서비스 배경으로 쓰기에는
 * 불안정하다. 그래서 키 없이 쓸 수 있고 임베드를 전제로 운영되는 CARTO를 기본으로 두고,
 * 실패하면 OSM으로 넘어가고, 둘 다 실패하면 배경 없이 핀만 남긴다(FALLBACK_BACKGROUND).
 */
const TILE_SOURCES = [
  {
    name: "carto",
    url: "https://basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    maxZoom: 20,
  },
  {
    name: "osm",
    url: "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 19,
  },
] as const;

// 타일이 하나도 안 뜰 때도 회색 덩어리로 보이지 않도록 깔아두는 배경
const FALLBACK_BACKGROUND = {
  backgroundColor: "#eef1f6",
  backgroundImage:
    "linear-gradient(rgba(107,79,160,.08) 1px, transparent 1px), linear-gradient(90deg, rgba(107,79,160,.08) 1px, transparent 1px)",
  backgroundSize: "40px 40px",
};

// 한두 장 실패는 일시적인 것일 수 있어, 이 횟수를 넘겨야 공급처를 바꾼다
const TILE_ERROR_THRESHOLD = 4;

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
  const [sourceIndex, setSourceIndex] = useState(0);
  const [tilesOk, setTilesOk] = useState(false);
  const errorCount = useRef(0);

  const handleTileLoad = useCallback(() => {
    errorCount.current = 0;
    setTilesOk(true);
  }, []);

  // 현재 공급처가 계속 실패하면 다음 공급처로 넘어간다. 마지막까지 실패하면 배경 없이 둔다.
  const handleTileError = useCallback(() => {
    errorCount.current += 1;
    if (errorCount.current < TILE_ERROR_THRESHOLD) return;
    errorCount.current = 0;
    setSourceIndex((i) => i + 1);
  }, []);

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

  // sourceIndex가 마지막을 넘어가면 undefined = 쓸 수 있는 공급처가 없다는 뜻
  const source: (typeof TILE_SOURCES)[number] | undefined = TILE_SOURCES[sourceIndex];

  return (
    <div className="overflow-hidden rounded-3xl border border-neutral-200">
      <MapContainer
        center={initialCenter}
        zoom={11}
        scrollWheelZoom={false}
        style={{ height: "360px", width: "100%", ...FALLBACK_BACKGROUND }}
      >
        {source && (
          <TileLayer
            key={source.name}
            attribution={source.attribution}
            url={source.url}
            maxZoom={source.maxZoom}
            eventHandlers={{ tileerror: handleTileError, tileload: handleTileLoad }}
          />
        )}
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
      {!source && !tilesOk && (
        <p className="bg-neutral-50 px-4 py-2 text-xs text-neutral-500">
          지도 배경을 불러오지 못했습니다. 가맹점 위치는 그대로 표시됩니다.
        </p>
      )}
    </div>
  );
}
