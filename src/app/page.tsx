import Link from "next/link";
import { SITE_DESCRIPTION, SITE_NAME } from "@/lib/constants";

const FEATURES = [
  {
    href: "/benefits",
    emoji: "📋",
    title: "혜택/정책 정보 모음",
    description: "중앙정부·지자체·민간의 임산부 혜택과 정책을 한눈에 모아봐요.",
  },
  {
    href: "/merchants",
    emoji: "🏬",
    title: "배려 가맹점",
    description: "임산부 배려석, 전용 주차장, 유아 휴게실(기저귀 교환대) 등 배려 시설과 가맹점을 찾아봐요.",
  },
  {
    href: "/checklist",
    emoji: "✅",
    title: "혜택 신청 체크리스트",
    description: "임신 주수와 상황에 맞는 신청 체크리스트로 놓치는 혜택 없이 챙겨요.",
  },
  {
    href: "/community",
    emoji: "💬",
    title: "커뮤니티/후기",
    description: "다른 예비맘·선배맘들의 혜택 신청 후기와 정보를 나눠요.",
  },
] as const;

export default function Home() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <section className="rounded-3xl bg-gradient-to-br from-rose-50 to-orange-50 px-6 py-14 text-center sm:py-20">
        <p className="text-sm font-semibold text-rose-500">{SITE_NAME}</p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl">
          임산부를 위한 혜택,
          <br className="sm:hidden" /> 놓치지 말고 다 챙기세요
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-neutral-600">{SITE_DESCRIPTION}</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            href="/benefits"
            className="rounded-full bg-rose-500 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-rose-600"
          >
            혜택 둘러보기
          </Link>
          <Link
            href="/checklist"
            className="rounded-full border border-rose-200 bg-white px-6 py-3 text-sm font-semibold text-rose-600 transition hover:bg-rose-50"
          >
            체크리스트 시작하기
          </Link>
        </div>
      </section>

      <section className="mt-14 grid gap-4 sm:grid-cols-2">
        {FEATURES.map((feature) => (
          <Link
            key={feature.href}
            href={feature.href}
            className="group rounded-2xl border border-neutral-200 p-6 transition hover:border-rose-200 hover:bg-rose-50/50"
          >
            <div className="text-3xl">{feature.emoji}</div>
            <h2 className="mt-3 text-lg font-semibold text-neutral-900 group-hover:text-rose-600">
              {feature.title}
            </h2>
            <p className="mt-1.5 text-sm text-neutral-600">{feature.description}</p>
          </Link>
        ))}
      </section>
    </div>
  );
}
