import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { isAdminAuthenticated } from "@/lib/admin-auth";

const REGULAR_FEE_RATE = 0.03; // 21번째 매장부터 적용되는 운영 수수료
const DONATION_RATE = 0.01; // 모든 매장 공통 기부금 비율 (청주 새생명지원센터)

function currentMonthStr(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
}

function parseMonth(monthStr: string): { start: Date; end: Date; label: string } {
  const match = /^(\d{4})-(\d{2})$/.exec(monthStr);
  const [year, month] = match
    ? [Number(match[1]), Number(match[2])]
    : [new Date().getFullYear(), new Date().getMonth() + 1];
  const start = new Date(year, month - 1, 1);
  const end = new Date(year, month, 1);
  return { start, end, label: `${year}년 ${month}월` };
}

function shiftMonth(monthStr: string, delta: number): string {
  const { start } = parseMonth(monthStr);
  const shifted = new Date(start.getFullYear(), start.getMonth() + delta, 1);
  return `${shifted.getFullYear()}-${String(shifted.getMonth() + 1).padStart(2, "0")}`;
}

const won = (n: number) => n.toLocaleString("ko-KR") + "원";

export default async function AdminSettlementPage({
  searchParams,
}: {
  searchParams: Promise<{ month?: string }>;
}) {
  if (!(await isAdminAuthenticated())) {
    redirect("/admin/login");
  }

  const { month: monthParam } = await searchParams;
  const monthStr = monthParam || currentMonthStr();
  const { start, end, label } = parseMonth(monthStr);

  const reviews = await prisma.post.findMany({
    where: {
      category: "REVIEW",
      merchantId: { not: null },
      amount: { not: null },
      createdAt: { gte: start, lt: end },
    },
    include: { merchant: { select: { id: true, name: true, isFoundingPartner: true } } },
  });

  const byMerchant = new Map<
    string,
    { name: string; isFoundingPartner: boolean; total: number; count: number }
  >();
  for (const r of reviews) {
    if (!r.merchant || r.amount == null) continue;
    const existing = byMerchant.get(r.merchant.id);
    if (existing) {
      existing.total += r.amount;
      existing.count += 1;
    } else {
      byMerchant.set(r.merchant.id, {
        name: r.merchant.name,
        isFoundingPartner: r.merchant.isFoundingPartner,
        total: r.amount,
        count: 1,
      });
    }
  }

  const rows = Array.from(byMerchant.values())
    .map((m) => {
      const feeRate = m.isFoundingPartner ? 0 : REGULAR_FEE_RATE;
      const feeAmount = Math.round(m.total * feeRate);
      const donationAmount = Math.round(m.total * DONATION_RATE);
      return { ...m, feeRate, feeAmount, donationAmount };
    })
    .sort((a, b) => b.total - a.total);

  const totalFee = rows.reduce((sum, r) => sum + r.feeAmount, 0);
  const totalDonation = rows.reduce((sum, r) => sum + r.donationAmount, 0);
  const totalAmount = rows.reduce((sum, r) => sum + r.total, 0);

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-neutral-900">정산 대시보드</h1>
        <Link href="/admin/verify" className="text-sm text-neutral-500 hover:text-neutral-700">
          인증 대기 →
        </Link>
      </div>
      <p className="mt-2 text-sm text-neutral-600">
        영수증 인증 후기에 등록된 결제 금액 기준으로 자동 계산돼요. 실제 청구·송금은 이 화면을
        보고 직접 진행하시면 돼요.
      </p>

      <div className="mt-6 flex items-center justify-center gap-4">
        <Link
          href={`/admin/settlement?month=${shiftMonth(monthStr, -1)}`}
          className="rounded-full border border-neutral-200 px-3 py-1 text-sm text-neutral-600 hover:bg-neutral-50"
        >
          ← 이전달
        </Link>
        <span className="text-sm font-semibold text-neutral-900">{label}</span>
        <Link
          href={`/admin/settlement?month=${shiftMonth(monthStr, 1)}`}
          className="rounded-full border border-neutral-200 px-3 py-1 text-sm text-neutral-600 hover:bg-neutral-50"
        >
          다음달 →
        </Link>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        <div className="rounded-2xl border border-neutral-200 p-4">
          <p className="text-xs text-neutral-500">확인된 결제 합계</p>
          <p className="mt-1 text-lg font-bold text-neutral-900">{won(totalAmount)}</p>
        </div>
        <div className="rounded-2xl border border-neutral-200 p-4">
          <p className="text-xs text-neutral-500">이번 달 청구할 운영 수수료</p>
          <p className="mt-1 text-lg font-bold text-neutral-900">{won(totalFee)}</p>
        </div>
        <div className="rounded-2xl border border-brand-100 bg-brand-50/40 p-4">
          <p className="text-xs text-brand-600">청주 새생명지원센터 기부금</p>
          <p className="mt-1 text-lg font-bold text-brand-600">{won(totalDonation)}</p>
        </div>
      </div>

      {rows.length === 0 ? (
        <p className="mt-8 text-sm text-neutral-500">
          이 달에는 영수증 인증 후기(결제 금액 포함)가 없어요.
        </p>
      ) : (
        <ul className="mt-8 space-y-3">
          {rows.map((r) => (
            <li key={r.name} className="rounded-2xl border border-neutral-200 p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="font-semibold text-neutral-900">{r.name}</p>
                <span
                  className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    r.isFoundingPartner
                      ? "bg-neutral-100 text-neutral-600"
                      : "bg-brand-100 text-brand-600"
                  }`}
                >
                  {r.isFoundingPartner ? "창립 파트너 · 수수료 0%" : "일반 매장 · 수수료 3%"}
                </span>
              </div>
              <p className="mt-1 text-xs text-neutral-500">
                인증 후기 {r.count}건 · 결제 합계 {won(r.total)}
              </p>
              <div className="mt-2 flex gap-4 text-sm">
                <span className="text-neutral-700">
                  운영 수수료 <b className="font-semibold">{won(r.feeAmount)}</b>
                </span>
                <span className="text-brand-600">
                  기부금 <b className="font-semibold">{won(r.donationAmount)}</b>
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
