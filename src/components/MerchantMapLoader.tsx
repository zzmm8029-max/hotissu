"use client";

import dynamic from "next/dynamic";

const MerchantMap = dynamic(() => import("./MerchantMap"), {
  ssr: false,
  loading: () => (
    <div className="flex h-[360px] items-center justify-center rounded-3xl border border-neutral-200 bg-neutral-50 text-sm text-neutral-500">
      지도를 불러오고 있어요...
    </div>
  ),
});

export default MerchantMap;
