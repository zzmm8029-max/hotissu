"use client";

import { useEffect, useState, useTransition } from "react";
import { submitVerification, getMemberStatus, type MemberPublic } from "./actions";
import MembershipCard from "@/components/MembershipCard";

const STORAGE_KEY = "gaji_member_id";

export default function MembershipClient() {
  const [checking, setChecking] = useState(true);
  const [member, setMember] = useState<MemberPublic | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    // 마운트 시점에 곧바로 setState하지 않도록 다음 태스크로 조회를 미룬다.
    const id = setTimeout(async () => {
      const memberId = localStorage.getItem(STORAGE_KEY);
      if (memberId) {
        const result = await getMemberStatus(memberId);
        if (result) setMember(result);
        else localStorage.removeItem(STORAGE_KEY);
      }
      setChecking(false);
    }, 0);
    return () => clearTimeout(id);
  }, []);

  const handleSubmit = (formData: FormData) => {
    setError(null);
    startTransition(async () => {
      const result = await submitVerification({}, formData);
      if (result.error) {
        setError(result.error);
      } else if (result.member) {
        localStorage.setItem(STORAGE_KEY, result.member.id);
        setMember(result.member);
      }
    });
  };

  const handleRetry = () => {
    localStorage.removeItem(STORAGE_KEY);
    setMember(null);
    setError(null);
  };

  if (checking) {
    return <p className="text-sm text-neutral-500">확인하고 있어요...</p>;
  }

  if (member) {
    if (member.status === "APPROVED") {
      return <MembershipCard member={member} />;
    }

    if (member.status === "PENDING") {
      return (
        <div className="rounded-3xl border border-brand-100 bg-brand-50/40 p-8 text-center">
          <p className="text-lg font-bold text-neutral-900">심사 중이에요</p>
          <p className="mt-2 text-sm text-neutral-600">
            {member.nickname}님, 보통 1~2일 안에 확인 후 회원증을 보여드려요.
          </p>
        </div>
      );
    }

    return (
      <div className="rounded-3xl border border-neutral-200 p-8 text-center">
        <p className="text-lg font-bold text-neutral-900">인증이 반려됐어요</p>
        {member.rejectionReason && (
          <p className="mt-2 text-sm text-neutral-600">사유: {member.rejectionReason}</p>
        )}
        <button
          type="button"
          onClick={handleRetry}
          className="mt-4 rounded-full bg-brand-500 px-5 py-2 text-sm font-semibold text-white transition hover:bg-brand-600"
        >
          다시 신청하기
        </button>
      </div>
    );
  }

  return (
    <form action={handleSubmit} className="space-y-4 rounded-3xl border border-neutral-200 p-6">
      <div>
        <label htmlFor="nickname" className="text-sm font-medium text-neutral-700">
          닉네임
        </label>
        <input
          id="nickname"
          name="nickname"
          type="text"
          maxLength={20}
          required
          placeholder="회원증에 표시될 이름이에요"
          className="mt-1.5 w-full rounded-xl border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-brand-500"
        />
      </div>

      <div>
        <label htmlFor="dueDate" className="text-sm font-medium text-neutral-700">
          출산예정일 <span className="text-neutral-400">(선택)</span>
        </label>
        <input
          id="dueDate"
          name="dueDate"
          type="date"
          className="mt-1.5 w-full rounded-xl border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-brand-500"
        />
      </div>

      <div>
        <label htmlFor="proofImage" className="text-sm font-medium text-neutral-700">
          인증 서류 사진
        </label>
        <input
          id="proofImage"
          name="proofImage"
          type="file"
          accept="image/*"
          required
          className="mt-1.5 w-full text-sm text-neutral-600 file:mr-3 file:rounded-full file:border-0 file:bg-brand-100 file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-brand-600"
        />
        <p className="mt-1.5 text-xs text-neutral-500">
          산모수첩, 임신확인서 등 임신 사실을 확인할 수 있는 사진을 올려주세요. (최대 3MB)
        </p>
        <p className="mt-1 text-xs text-neutral-500">
          제출하신 서류는 자격 확인 목적으로만 사용되며, 심사(승인 또는 반려) 완료 즉시 자동
          파기됩니다. 서류 원본은 저장되지 않고, 인증 완료 여부만 보관됩니다.
        </p>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-full bg-brand-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-600 disabled:opacity-60"
      >
        {pending ? "제출하고 있어요..." : "인증 신청하기"}
      </button>
    </form>
  );
}
