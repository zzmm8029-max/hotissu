import Link from "next/link";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { BenefitCategory } from "@/generated/prisma/enums";
import { BENEFIT_CATEGORY_LABEL, BENEFIT_PROVIDER_LABEL } from "@/lib/labels";

export const metadata: Metadata = {
  title: "혜택/정책 정보 모음",
};

const CATEGORY_OPTIONS = [
  { value: "ALL", label: "전체" },
  ...Object.values(BenefitCategory).map((value) => ({
    value,
    label: BENEFIT_CATEGORY_LABEL[value],
  })),
];

export default async function BenefitsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  const selected =
    category && (Object.values(BenefitCategory) as string[]).includes(category)
      ? (category as BenefitCategory)
      : "ALL";

  const benefits = await prisma.benefit.findMany({
    where: selected === "ALL" ? {} : { category: selected },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="text-2xl font-bold text-neutral-900">혜택/정책 정보 모음</h1>
      <p className="mt-2 text-sm text-neutral-600">
        중앙정부·지자체·민간에서 제공하는 임산부 관련 혜택과 정책을 모아봤어요.
      </p>

      <div className="mt-6 flex flex-wrap gap-2">
        {CATEGORY_OPTIONS.map((option) => (
          <Link
            key={option.value}
            href={option.value === "ALL" ? "/benefits" : `/benefits?category=${option.value}`}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
              selected === option.value
                ? "bg-rose-500 text-white"
                : "border border-neutral-200 text-neutral-600 hover:bg-rose-50 hover:text-rose-600"
            }`}
          >
            {option.label}
          </Link>
        ))}
      </div>

      <ul className="mt-8 grid gap-4 sm:grid-cols-2">
        {benefits.map((benefit) => (
          <li key={benefit.id}>
            <Link
              href={`/benefits/${benefit.id}`}
              className="block h-full rounded-2xl border border-neutral-200 p-5 transition hover:border-rose-200 hover:bg-rose-50/50"
            >
              <div className="flex flex-wrap gap-1.5">
                <span className="rounded-full bg-rose-100 px-2.5 py-0.5 text-xs font-medium text-rose-600">
                  {BENEFIT_CATEGORY_LABEL[benefit.category]}
                </span>
                <span className="rounded-full bg-neutral-100 px-2.5 py-0.5 text-xs font-medium text-neutral-600">
                  {BENEFIT_PROVIDER_LABEL[benefit.provider]}
                </span>
                <span className="rounded-full bg-neutral-100 px-2.5 py-0.5 text-xs font-medium text-neutral-600">
                  {benefit.region}
                </span>
              </div>
              <h2 className="mt-3 font-semibold text-neutral-900">{benefit.title}</h2>
              <p className="mt-1.5 text-sm text-neutral-600 line-clamp-2">{benefit.summary}</p>
            </Link>
          </li>
        ))}

        {benefits.length === 0 && (
          <li className="col-span-full rounded-2xl border border-dashed border-neutral-200 p-8 text-center text-sm text-neutral-500">
            해당 카테고리의 혜택 정보가 아직 없어요.
          </li>
        )}
      </ul>
    </div>
  );
}
