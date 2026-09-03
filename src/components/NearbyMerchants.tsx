"use client";

import { useEffect, useState } from "react";
import { getDistanceKm } from "@/lib/geo";
import MerchantCard, { type MerchantCardData } from "@/components/MerchantCard";

type MerchantWithCoords = MerchantCardData & {
  latitude: number | null;
  longitude: number | null;
};

type Status = "idle" | "requesting" | "granted" | "denied" | "unsupported";

const NEARBY_RADIUS_KM = 5;
const MAX_RESULTS = 5;

export default function NearbyMerchants({ merchants }: { merchants: MerchantWithCoords[] }) {
  const [status, setStatus] = useState<Status>("idle");
  const [nearby, setNearby] = useState<{ merchant: MerchantWithCoords; distanceKm: number }[]>([]);

  const requestLocation = () => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      setStatus("unsupported");
      return;
    }
    setStatus("requesting");
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const results = merchants
          .filter((m): m is MerchantWithCoords & { latitude: number; longitude: number } =>
            m.latitude !== null && m.longitude !== null,
          )
          .map((merchant) => ({
            merchant,
            distanceKm: getDistanceKm(latitude, longitude, merchant.latitude, merchant.longitude),
          }))
          .filter((r) => r.distanceKm <= NEARBY_RADIUS_KM)
          .sort((a, b) => a.distanceKm - b.distanceKm)
          .slice(0, MAX_RESULTS);
        setNearby(results);
        setStatus("granted");
      },
      () => setStatus("denied"),
      { enableHighAccuracy: false, timeout: 8000, maximumAge: 5 * 60 * 1000 },
    );
  };

  useEffect(() => {
    // 마운트 시점에 곧바로 setState하지 않도록 다음 태스크로 위치 요청을 미룬다.
    const id = setTimeout(requestLocation, 0);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section className="rounded-3xl border border-brand-100 bg-brand-50/40 p-6 sm:p-8">
      <p className="text-sm font-semibold text-brand-600">내 주변 배려 매장</p>

      {status === "idle" || status === "requesting" ? (
        <p className="mt-3 text-sm text-neutral-600">위치를 확인하고 있어요...</p>
      ) : status === "unsupported" ? (
        <p className="mt-3 text-sm text-neutral-600">
          이 브라우저에서는 위치 확인 기능을 사용할 수 없어요. 아래에서 전체 가맹점을 둘러보세요.
        </p>
      ) : status === "denied" ? (
        <div className="mt-3">
          <p className="text-sm text-neutral-600">
            위치 권한이 없어 주변 매장을 찾을 수 없어요. 권한을 허용하면 가까운 배려 매장을 바로 보여드려요.
          </p>
          <button
            type="button"
            onClick={requestLocation}
            className="mt-3 rounded-full bg-brand-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-600"
          >
            위치 권한 다시 요청하기
          </button>
        </div>
      ) : nearby.length === 0 ? (
        <p className="mt-3 text-sm text-neutral-600">
          내 위치 반경 {NEARBY_RADIUS_KM}km 안에는 아직 등록된 배려 매장이 없어요. 아래에서 전체 가맹점을 둘러보세요.
        </p>
      ) : (
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {nearby.map(({ merchant, distanceKm }) => (
            <MerchantCard key={merchant.id} merchant={merchant} distanceKm={distanceKm} />
          ))}
        </div>
      )}
    </section>
  );
}
