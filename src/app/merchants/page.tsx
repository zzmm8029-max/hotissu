import Link from "next/link";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { MerchantCategory } from "@/generated/prisma/enums";
import { MERCHANT_CATEGORY_LABEL } from "@/lib/labels";

export const metadata: Metadata = {
  title: "배려 가맹점",
};

const CATEGORY_OPTIONS = [
  { value: "ALL", label: "전체" },
  ...Object.values(MerchantCategory).map((value) => ({
    value,
    label: MERCHANT_CATEGORY_LABEL[value],
  })),
];

export default async function MerchantsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; region?: string }>;
}) {
  const { category, region } = await searchParams;
  const selectedCategory =
    category && (Object.values(MerchantCategory) as string[]).includes(category)
      ? (category as MerchantCategory)
      : "ALL";

  const allMerchants = await prisma.merchant.findMany({ orderBy: { createdAt: "desc" } });
  const regions = Array.from(new Set(allMerchants.map((m) => m.region)));
  const selectedRegion = region && regions.includes(region) ? region : "ALL";

  const merchants = allMerchants.filter((m) => {
    if (selectedCategory !== "ALL" && m.category !== selectedCategory) return false;
    if (selectedRegion !== "ALL" && m.region !== selectedRegion) return false;
    return true;
  });

  const buildHref = (next: { category?: string; region?: string }) => {
    const params = new URLSearchParams();
    const c = next.category ?? selectedCategory;
    const r = next.region ?? selectedRegion;
    if (c !== "ALL") params.set("category", c);
    if (r !== "ALL") params.set("region", r);
    const qs = params.toString();
    return qs ? `/merchants?${qs}` : "/merchants";
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="text-2xl font-bold text-neutral-900">배려 가맹점</h1>
      <p className="mt-2 text-sm text-neutral-600">
        임산부 배려석, 전용 주차장, 유아 휴게실(기저귀 교환대) 등을 갖춘 가맹점·시설을 찾아보세요.
      </p>

      <div className="mt-6 flex flex-wrap gap-2">
        {CATEGORY_OPTIONS.map((option) => (
          <Link
            key={option.value}
            href={buildHref({ category: option.value })}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
              selectedCategory === option.value
                ? "bg-rose-500 text-white"
                : "border border-neutral-200 text-neutral-600 hover:bg-rose-50 hover:text-rose-600"
            }`}
          >
            {option.label}
          </Link>
        ))}
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        <Link
          href={buildHref({ region: "ALL" })}
          className={`rounded-full px-3 py-1 text-xs font-medium transition ${
            selectedRegion === "ALL"
              ? "bg-neutral-800 text-white"
              : "border border-neutral-200 text-neutral-500 hover:bg-neutral-50"
          }`}
        >
          전체 지역
        </Link>
        {regions.map((r) => (
          <Link
            key={r}
            href={buildHref({ region: r })}
            className={`rounded-full px-3 py-1 text-xs font-medium transition ${
              selectedRegion === r
                ? "bg-neutral-800 text-white"
                : "border border-neutral-200 text-neutral-500 hover:bg-neutral-50"
            }`}
          >
            {r}
          </Link>
        ))}
      </div>

      <ul className="mt-8 grid gap-4 sm:grid-cols-2">
        {merchants.map((merchant) => (
          <li key={merchant.id} className="rounded-2xl border border-neutral-200 p-5">
            <div className="flex flex-wrap gap-1.5">
              <span className="rounded-full bg-rose-100 px-2.5 py-0.5 text-xs font-medium text-rose-600">
                {MERCHANT_CATEGORY_LABEL[merchant.category]}
              </span>
              <span className="rounded-full bg-neutral-100 px-2.5 py-0.5 text-xs font-medium text-neutral-600">
                {merchant.region}
                {merchant.district ? ` · ${merchant.district}` : ""}
              </span>
            </div>
            <h2 className="mt-3 font-semibold text-neutral-900">{merchant.name}</h2>
            {merchant.description && (
              <p className="mt-1 text-sm text-neutral-600">{merchant.description}</p>
            )}
            <p className="mt-2 rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700">
              {merchant.benefitInfo}
            </p>
            <p className="mt-2 text-sm text-neutral-500">{merchant.address}</p>
            {merchant.phone && (
              <p className="mt-1 text-sm text-neutral-500">☎ {merchant.phone}</p>
            )}
          </li>
        ))}

        {merchants.length === 0 && (
          <li className="col-span-full rounded-2xl border border-dashed border-neutral-200 p-8 text-center text-sm text-neutral-500">
            조건에 맞는 가맹점이 아직 없어요.
          </li>
        )}
      </ul>
    </div>
  );
}
