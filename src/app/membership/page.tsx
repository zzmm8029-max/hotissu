import type { Metadata } from "next";
import MembershipClient from "./membership-client";

export const metadata: Metadata = {
  title: "내 회원증",
};

export default function MembershipPage() {
  return (
    <div className="mx-auto max-w-md px-4 py-10">
      <h1 className="text-2xl font-bold text-neutral-900">내 회원증</h1>
      <p className="mt-2 text-sm text-neutral-600">
        임산부 인증을 받으면 가지가맹점에서 바로 제시할 수 있는 회원증이 발급돼요.
      </p>

      <div className="mt-6">
        <MembershipClient />
      </div>
    </div>
  );
}
