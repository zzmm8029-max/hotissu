import { SITE_NAME } from "@/lib/constants";

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-rose-100 bg-rose-50/50">
      <div className="mx-auto max-w-5xl px-4 py-8 text-sm text-neutral-500">
        <p className="font-medium text-neutral-700">{SITE_NAME}</p>
        <p className="mt-2">
          본 서비스에 게재된 혜택·정책 정보는 참고용이며, 정확한 지원 대상·금액·기간은
          정부24, 복지로 또는 관할 지자체 공고를 통해 반드시 다시 확인하시기 바랍니다.
        </p>
        <p className="mt-1">© {new Date().getFullYear()} {SITE_NAME}</p>
      </div>
    </footer>
  );
}
