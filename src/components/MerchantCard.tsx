import type { MerchantCategory } from "@/generated/prisma/enums";
import { MERCHANT_CATEGORY_LABEL, MERCHANT_CATEGORY_PHOTO_FALLBACK } from "@/lib/labels";
import { formatDistanceKm, googleMapsUrl } from "@/lib/geo";

export type MerchantCardData = {
  id: string;
  name: string;
  category: MerchantCategory;
  description: string | null;
  benefitInfo: string;
  address: string;
  region: string;
  district: string | null;
  phone: string | null;
  photoUrl?: string | null;
};

export type MerchantMapData = MerchantCardData & {
  latitude: number | null;
  longitude: number | null;
};

export default function MerchantCard({
  merchant,
  distanceKm,
  compact = false,
}: {
  merchant: MerchantCardData;
  distanceKm?: number;
  compact?: boolean;
}) {
  const benefitLines = merchant.benefitInfo.split("\n").filter(Boolean);
  const photoFallback = MERCHANT_CATEGORY_PHOTO_FALLBACK[merchant.category];
  const photoSizeClass = compact ? "h-14 w-14" : "h-20 w-20";

  return (
    <div
      className={
        compact
          ? "w-64 flex-none rounded-2xl border border-neutral-200 p-4"
          : "rounded-2xl border border-neutral-200 p-5"
      }
    >
      <div className="flex flex-wrap items-center gap-1.5">
        <span className="rounded-full bg-brand-100 px-2.5 py-0.5 text-xs font-medium text-brand-600">
          {MERCHANT_CATEGORY_LABEL[merchant.category]}
        </span>
        <span className="rounded-full bg-neutral-100 px-2.5 py-0.5 text-xs font-medium text-neutral-600">
          {merchant.region}
          {merchant.district ? ` · ${merchant.district}` : ""}
        </span>
        {distanceKm !== undefined && (
          <span className="ml-auto rounded-full bg-neutral-900 px-2.5 py-0.5 text-xs font-medium text-white">
            {formatDistanceKm(distanceKm)}
          </span>
        )}
      </div>
      <div className="mt-3 flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <h3 className="font-semibold text-neutral-900">{merchant.name}</h3>
          {merchant.description && (
            <p className="mt-1 text-sm text-neutral-600">{merchant.description}</p>
          )}
        </div>
        {merchant.photoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={merchant.photoUrl}
            alt={`${merchant.name} 매장 사진`}
            className={`${photoSizeClass} shrink-0 rounded-xl border border-neutral-200 object-cover`}
          />
        ) : (
          <div
            aria-hidden
            className={`${photoSizeClass} flex shrink-0 items-center justify-center rounded-xl text-2xl ${photoFallback.className}`}
          >
            {photoFallback.emoji}
          </div>
        )}
      </div>
      <ul className="mt-2 space-y-1 rounded-lg bg-brand-50 px-3 py-2.5 text-sm text-brand-700">
        {benefitLines.map((line, i) => (
          <li key={i} className="flex gap-1.5">
            <span aria-hidden className="text-brand-400">
              ●
            </span>
            <span>{line}</span>
          </li>
        ))}
      </ul>
      <div className="mt-2 flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
        <p className="text-sm text-neutral-500">{merchant.address}</p>
        <a
          href={googleMapsUrl(merchant.address)}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 text-sm font-medium text-brand-600 hover:text-brand-700"
        >
          지도에서 열기 →
        </a>
      </div>
      {merchant.phone && <p className="mt-1 text-sm text-neutral-500">☎ {merchant.phone}</p>}
    </div>
  );
}
