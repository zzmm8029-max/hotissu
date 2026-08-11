import type { MemberPublic } from "@/app/membership/actions";

function formatDate(iso: string): string {
  const d = new Date(iso);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(
    d.getDate(),
  ).padStart(2, "0")}`;
}

export default function MembershipCard({ member }: { member: MemberPublic }) {
  const code = member.id.slice(-8).toUpperCase();

  return (
    <div>
      <div className="rounded-3xl bg-gradient-to-br from-brand-600 to-brand-700 p-6 text-white shadow-lg">
        <div className="flex items-center justify-between">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.webp" alt="" className="h-10 w-10 rounded-full bg-white/90 p-1" />
          <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-semibold">
            인증 완료
          </span>
        </div>

        <p className="mt-6 text-xs font-medium text-brand-100">가지 인증회원</p>
        <p className="mt-1 text-2xl font-bold">{member.nickname}님</p>
        {member.dueDate && (
          <p className="mt-1 text-sm text-brand-100">출산예정일 {formatDate(member.dueDate)}</p>
        )}

        <div className="mt-6 flex items-center justify-between border-t border-white/20 pt-4 text-xs text-brand-100">
          <span>인증일 {formatDate(member.updatedAt)}</span>
          <span className="font-mono tracking-wide">{code}</span>
        </div>
      </div>
      <p className="mt-3 text-center text-xs text-neutral-500">
        배려 가맹점에서 이 화면을 보여주세요.
      </p>
    </div>
  );
}
