export const SITE_NAME = "가지";
export const SITE_SLOGAN = "가치와 지역을 잇다";
export const SITE_DESCRIPTION =
  "임산부를 위한 가지가맹점, 혜택·정책, 커뮤니티, 신청 체크리스트를 한곳에서.";

/**
 * 지자체 우대업소 제도를 앱에서 언급할 때 반드시 함께 노출해야 하는 고지 문구.
 * 청주시가 2026-09 서면 회신에서 요구한 조건 — 공개 자료 인용은 가능하나,
 * 시가 가지를 인증·추천했거나 협력관계인 것으로 오인되지 않아야 한다.
 */
export const LOCAL_GOV_DISCLAIMER =
  "'청주시 임산부 행복업소 모아모아' 등 지자체 우대업소 관련 표기는 각 지자체가 공개한 자료를 인용한 것입니다. 가지는 해당 지자체로부터 인증·추천을 받았거나 협력관계를 맺은 서비스가 아니며, 참여 업소 정보의 최신 여부는 각 지자체 공고를 통해 확인하시기 바랍니다.";

export const NAV_LINKS = [
  { href: "/merchants", label: "가지가맹점" },
  { href: "/benefits", label: "혜택/정책" },
  { href: "/community", label: "커뮤니티" },
  { href: "/checklist", label: "주수체크리스트" },
  { href: "/membership", label: "회원증" },
] as const;
