import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { SITE_DESCRIPTION, SITE_NAME } from "@/lib/constants";
import NearbyMerchants from "@/components/NearbyMerchants";
import MerchantCard from "@/components/MerchantCard";

export const revalidate = 60;

const FEATURES = [
  {
    href: "/merchants",
    emoji: "🏬",
    title: "배려 가맹점",
    description: "임산부 배려석, 전용 주차장, 유아 휴게실(기저귀 교환대) 등 배려 시설과 가맹점을 찾아봐요.",
  },
  {
    href: "/benefits",
    emoji: "📋",
    title: "혜택/정책 정보 모음",
    description: "중앙정부·지자체·민간의 임산부 혜택과 정책을 한눈에 모아봐요.",
  },
  {
    href: "/community",
    emoji: "💬",
    title: "커뮤니티/후기",
    description: "다른 예비맘·선배맘들의 혜택 신청 후기와 정보를 나눠요.",
  },
  {
    href: "/checklist",
    emoji: "✅",
    title: "혜택 신청 체크리스트",
    description: "임신 주수와 상황에 맞는 신청 체크리스트로 놓치는 혜택 없이 챙겨요.",
  },
] as const;

const HOME_LIST_LIMIT = 12;

export default async function Home() {
  const merchants = await prisma.merchant.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      category: true,
      description: true,
      benefitInfo: true,
      address: true,
      region: true,
      district: true,
      phone: true,
      latitude: true,
      longitude: true,
    },
  });
  const merchantCount = merchants.length;

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <header className="mb-6">
        <p className="text-sm font-semibold text-brand-600">{SITE_NAME}</p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-neutral-900 sm:text-3xl">
          {SITE_DESCRIPTION}
        </h1>
      </header>

      <NearbyMerchants merchants={merchants} />

      <section className="mt-10">
        <div className="flex flex-wrap items-baseline justify-between gap-3">
          <h2 className="text-lg font-bold text-neutral-900">
            현재 <span className="text-brand-600">{merchantCount}곳</span>의 배려 매장이 함께하고 있어요
          </h2>
          <Link href="/merchants" className="text-sm font-medium text-brand-600 hover:text-brand-700">
            전체 보기 →
          </Link>
        </div>

        {merchantCount === 0 ? (
          <p className="mt-4 text-sm text-neutral-500">아직 등록된 가맹점이 없어요.</p>
        ) : (
          <div className="mt-4 flex gap-4 overflow-x-auto pb-2">
            {merchants.slice(0, HOME_LIST_LIMIT).map((merchant) => (
              <MerchantCard key={merchant.id} merchant={merchant} compact />
            ))}
          </div>
        )}
      </section>

      <section className="mt-14 grid gap-4 sm:grid-cols-2">
        {FEATURES.map((feature) => (
          <Link
            key={feature.href}
            href={feature.href}
            className="group rounded-2xl border border-neutral-200 p-6 transition hover:border-brand-200 hover:bg-brand-50/50"
          >
            <div className="text-3xl">{feature.emoji}</div>
            <h2 className="mt-3 text-lg font-semibold text-neutral-900 group-hover:text-brand-600">
              {feature.title}
            </h2>
            <p className="mt-1.5 text-sm text-neutral-600">{feature.description}</p>
          </Link>
        ))}
      </section>
    </div>
  );
}
