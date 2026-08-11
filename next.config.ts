import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      // 임산부 인증 서류 사진 업로드를 위해 기본 1mb 제한을 완화
      bodySizeLimit: "6mb",
    },
  },
};

export default nextConfig;
