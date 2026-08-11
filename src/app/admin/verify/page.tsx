import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { approveMember, rejectMember, adminLogout } from "../actions";

export default async function AdminVerifyPage() {
  if (!(await isAdminAuthenticated())) {
    redirect("/admin/login");
  }

  const pending = await prisma.member.findMany({
    where: { status: "PENDING" },
    orderBy: { createdAt: "asc" },
  });

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-neutral-900">인증 대기 ({pending.length}건)</h1>
        <form action={adminLogout}>
          <button type="submit" className="text-sm text-neutral-500 hover:text-neutral-700">
            로그아웃
          </button>
        </form>
      </div>

      {pending.length === 0 ? (
        <p className="mt-8 text-sm text-neutral-500">대기 중인 신청이 없어요.</p>
      ) : (
        <ul className="mt-6 space-y-6">
          {pending.map((member) => {
            const approveWithId = approveMember.bind(null, member.id);
            const rejectWithId = rejectMember.bind(null, member.id);
            return (
              <li key={member.id} className="rounded-2xl border border-neutral-200 p-5">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <p className="font-semibold text-neutral-900">{member.nickname}</p>
                  <p className="text-xs text-neutral-500">
                    신청일 {member.createdAt.toLocaleDateString("ko-KR")}
                    {member.dueDate &&
                      ` · 출산예정일 ${member.dueDate.toLocaleDateString("ko-KR")}`}
                  </p>
                </div>

                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={member.proofImage}
                  alt="인증 서류"
                  className="mt-3 max-h-80 w-full rounded-xl border border-neutral-200 object-contain"
                />

                <form className="mt-4 flex flex-wrap items-center gap-2">
                  <input
                    type="text"
                    name="reason"
                    placeholder="반려 사유 (반려 시에만 입력)"
                    className="min-w-0 flex-1 rounded-full border border-neutral-200 px-3 py-1.5 text-sm outline-none focus:border-brand-500"
                  />
                  <button
                    formAction={approveWithId}
                    className="rounded-full bg-brand-500 px-4 py-1.5 text-sm font-semibold text-white transition hover:bg-brand-600"
                  >
                    승인
                  </button>
                  <button
                    formAction={rejectWithId}
                    className="rounded-full border border-neutral-300 px-4 py-1.5 text-sm font-semibold text-neutral-600 transition hover:bg-neutral-50"
                  >
                    반려
                  </button>
                </form>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
