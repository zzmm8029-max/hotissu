import type {
  BenefitCategory,
  BenefitProvider,
  ChecklistStage,
  MerchantCategory,
  PostCategory,
} from "@/generated/prisma/enums";

export const BENEFIT_CATEGORY_LABEL: Record<BenefitCategory, string> = {
  MEDICAL: "의료/건강",
  FINANCE: "현금성 지원",
  TRANSPORT: "교통",
  TAX: "세금/공과금",
  EMPLOYMENT: "고용/육아휴직",
  HOUSING: "주거",
  ETC: "기타",
};

export const BENEFIT_PROVIDER_LABEL: Record<BenefitProvider, string> = {
  CENTRAL_GOV: "중앙정부",
  LOCAL_GOV: "지자체",
  PUBLIC_ORG: "공공기관",
  PRIVATE: "민간",
};

export const MERCHANT_CATEGORY_LABEL: Record<MerchantCategory, string> = {
  HOSPITAL: "병원",
  PHARMACY: "약국",
  MART: "마트/편의점",
  CAFE_RESTAURANT: "카페/음식점",
  TRANSPORT_FACILITY: "배려 시설",
  TOY_RENTAL: "장난감 대여시설",
  BEAUTY: "피부/미용",
  EDUCATION: "태교/교육",
  ETC: "기타",
};

// 가맹점 목록 페이지에 노출할 카테고리 필터 칩(순서 고정)
export const MERCHANT_CATEGORY_FILTER_ORDER: MerchantCategory[] = [
  "CAFE_RESTAURANT",
  "PHARMACY",
  "MART",
  "TOY_RENTAL",
  "BEAUTY",
  "EDUCATION",
  "ETC",
];

// 매장 사진이 없을 때 카드에 보여줄 대체 아이콘/배경색
export const MERCHANT_CATEGORY_PHOTO_FALLBACK: Record<
  MerchantCategory,
  { emoji: string; className: string }
> = {
  HOSPITAL: { emoji: "🏥", className: "bg-teal-50 text-teal-600" },
  PHARMACY: { emoji: "💊", className: "bg-sky-50 text-sky-600" },
  MART: { emoji: "🛒", className: "bg-amber-50 text-amber-600" },
  CAFE_RESTAURANT: { emoji: "☕", className: "bg-brand-50 text-brand-600" },
  TRANSPORT_FACILITY: { emoji: "🅿️", className: "bg-orange-50 text-orange-600" },
  TOY_RENTAL: { emoji: "🧸", className: "bg-indigo-50 text-indigo-600" },
  BEAUTY: { emoji: "💆", className: "bg-pink-50 text-pink-600" },
  EDUCATION: { emoji: "🌱", className: "bg-lime-50 text-lime-600" },
  ETC: { emoji: "🏬", className: "bg-neutral-100 text-neutral-500" },
};

export const CHECKLIST_STAGE_LABEL: Record<ChecklistStage, string> = {
  EARLY: "임신 초기 (1~12주)",
  MID: "임신 중기 (13~27주)",
  LATE: "임신 후기 (28주~출산)",
  POSTPARTUM: "출산 후",
};

export const POST_CATEGORY_LABEL: Record<PostCategory, string> = {
  REVIEW: "후기",
  QUESTION: "질문",
  INFO_SHARE: "정보 공유",
  FREE: "자유",
};
