import type { MerchantCategory } from "@/generated/prisma/enums";
import { MERCHANT_CATEGORY_LABEL } from "@/lib/labels";
import { formatDistanceKm } from "@/lib/geo";

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
      <h3 className="mt-3 font-semibold text-neutral-900">{merchant.name}</h3>
      {merchant.description && (
        <p className="mt-1 text-sm text-neutral-600">{merchant.description}</p>
      )}
      <p className="mt-2 rounded-lg bg-brand-50 px-3 py-2 text-sm text-brand-700">
        {merchant.benefitInfo}
      </p>
      <p className="mt-2 text-sm text-neutral-500">{merchant.address}</p>
      {merchant.phone && <p className="mt-1 text-sm text-neutral-500">☎ {merchant.phone}</p>}
    </div>
  );
}
