import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { BENEFIT_CATEGORY_LABEL, BENEFIT_PROVIDER_LABEL } from "@/lib/labels";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const benefit = await prisma.benefit.findUnique({ where: { id } });
  return { title: benefit?.title ?? "혜택 정보" };
}

export default async function BenefitDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const benefit = await prisma.benefit.findUnique({ where: { id } });

  if (!benefit) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <Link href="/benefits" className="text-sm font-medium text-rose-500 hover:underline">
        ← 혜택 목록으로
      </Link>

      <div className="mt-4 flex flex-wrap gap-1.5">
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

      <h1 className="mt-4 text-2xl font-bold text-neutral-900">{benefit.title}</h1>
      <p className="mt-2 text-neutral-600">{benefit.summary}</p>

      <div className="mt-6 space-y-4 rounded-2xl border border-neutral-200 p-6">
        <p className="whitespace-pre-line text-sm leading-relaxed text-neutral-700">
          {benefit.content}
        </p>

        <dl className="grid gap-3 border-t border-neutral-100 pt-4 text-sm sm:grid-cols-2">
          <div>
            <dt className="font-medium text-neutral-500">지원 대상</dt>
            <dd className="mt-0.5 text-neutral-800">{benefit.target}</dd>
          </div>
          {benefit.amount && (
            <div>
              <dt className="font-medium text-neutral-500">지원 내용</dt>
              <dd className="mt-0.5 text-neutral-800">{benefit.amount}</dd>
            </div>
          )}
          {benefit.applyMethod && (
            <div>
              <dt className="font-medium text-neutral-500">신청 방법</dt>
              <dd className="mt-0.5 text-neutral-800">{benefit.applyMethod}</dd>
            </div>
          )}
          {benefit.sourceName && (
            <div>
              <dt className="font-medium text-neutral-500">출처</dt>
              <dd className="mt-0.5 text-neutral-800">{benefit.sourceName}</dd>
            </div>
          )}
        </dl>

        {benefit.applyUrl && (
          <a
            href={benefit.applyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block rounded-full bg-rose-500 px-6 py-2.5 text-sm font-semibold text-white hover:bg-rose-600"
          >
            신청 바로가기
          </a>
        )}
      </div>
    </div>
  );
}
