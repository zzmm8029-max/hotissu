"use client";

import { useActionState } from "react";
import { adminLogin } from "../actions";

export default function AdminLoginPage() {
  const [state, formAction, pending] = useActionState(adminLogin, {});

  return (
    <div className="mx-auto max-w-sm px-4 py-16">
      <h1 className="text-xl font-bold text-neutral-900">관리자 로그인</h1>
      <p className="mt-2 text-sm text-neutral-500">인증 대기 목록을 확인하려면 로그인하세요.</p>
      <form action={formAction} className="mt-6 space-y-3">
        <input
          type="password"
          name="password"
          required
          autoFocus
          placeholder="비밀번호"
          className="w-full rounded-xl border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-brand-500"
        />
        {state.error && <p className="text-sm text-red-600">{state.error}</p>}
        <button
          type="submit"
          disabled={pending}
          className="w-full rounded-full bg-brand-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-600 disabled:opacity-60"
        >
          {pending ? "확인 중..." : "로그인"}
        </button>
      </form>
    </div>
  );
}
