import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "../src/generated/prisma/client";

const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL ?? "file:./dev.db",
});
const prisma = new PrismaClient({ adapter });

const NOTE =
  "※ 샘플 데이터입니다. 정확한 지원 대상·금액·기간은 정부24, 복지로 또는 관할 지자체 공고를 통해 반드시 다시 확인하세요.";

const won = (n: number) => n.toLocaleString("ko-KR");

/**
 * 영수증 인증 후기에 붙는 샘플 영수증 이미지.
 * 실제 서비스에서는 이용자가 찍은 사진이 data URL로 들어오는 자리라, 시드도 같은 형태로 넣는다.
 */
function receiptImage(input: {
  storeName: string;
  date: string;
  items: { name: string; price: number }[];
  total: number;
}) {
  const rows = input.items
    .map(
      (item, i) =>
        `<text x="26" y="${188 + i * 30}" font-size="17" fill="#3a3a3a">${item.name}</text>` +
        `<text x="334" y="${188 + i * 30}" font-size="17" fill="#3a3a3a" text-anchor="end">${won(item.price)}</text>`,
    )
    .join("");
  const totalY = 200 + input.items.length * 30;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 ${totalY + 128}" font-family="sans-serif">
  <rect width="360" height="${totalY + 128}" fill="#fffdf7"/>
  <rect x="8" y="8" width="344" height="${totalY + 112}" fill="#fff" stroke="#e5ddd0"/>
  <text x="180" y="58" font-size="21" font-weight="700" fill="#2b2440" text-anchor="middle">${input.storeName}</text>
  <text x="180" y="86" font-size="15" fill="#8a8172" text-anchor="middle">${input.date}</text>
  <path d="M26 112 H334" stroke="#d9d0c0" stroke-dasharray="5 5"/>
  <text x="26" y="146" font-size="15" fill="#8a8172">영수증 (샘플)</text>
  ${rows}
  <path d="M26 ${totalY - 24} H334" stroke="#d9d0c0" stroke-dasharray="5 5"/>
  <text x="26" y="${totalY + 8}" font-size="19" font-weight="700" fill="#2b2440">합계</text>
  <text x="334" y="${totalY + 8}" font-size="19" font-weight="700" fill="#2b2440" text-anchor="end">${won(input.total)}원</text>
  <rect x="26" y="${totalY + 30}" width="180" height="34" rx="17" fill="#efe8fb"/>
  <text x="116" y="${totalY + 53}" font-size="15" font-weight="700" fill="#4a2e7a" text-anchor="middle">가지 회원증 제시</text>
</svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

async function main() {
  await prisma.comment.deleteMany();
  await prisma.post.deleteMany();
  await prisma.checklistItem.deleteMany();
  await prisma.benefit.deleteMany();
  await prisma.merchant.deleteMany();

  const benefits = await prisma.benefit.createManyAndReturn({
    data: [
      {
        title: "임신·출산 진료비 지원 (국민행복카드)",
        summary: "임신·출산과 관련한 진료비를 바우처로 지원",
        content: `임신이 확인된 건강보험 가입자(피부양자 포함)에게 임신·출산 관련 진료비를 국민행복카드 바우처로 지원합니다. ${NOTE}`,
        category: "MEDICAL",
        provider: "CENTRAL_GOV",
        region: "전국",
        target: "임신이 확인된 건강보험 가입자 및 피부양자",
        amount: "지자체·태아 수에 따라 상이 (복지로 참고)",
        applyMethod: "국민행복카드 발급 은행 또는 정부24 온라인 신청",
        applyUrl: "https://www.gov.kr",
        sourceName: "복지로",
        sourceUrl: "https://www.bokjiro.go.kr",
      },
      {
        title: "첫만남이용권",
        summary: "출생아 1인당 지급되는 바우처형 출산지원금",
        content: `출생신고 후 신청하면 바우처 포인트로 지급되는 출산 지원금입니다. 금액은 정책 개정에 따라 변동될 수 있어 최신 공고 확인이 필요합니다. ${NOTE}`,
        category: "FINANCE",
        provider: "CENTRAL_GOV",
        region: "전국",
        target: "2022년 이후 출생아",
        amount: "정부24·복지로 최신 공고 참고",
        applyMethod: "행복출산 원스톱서비스(정부24) 또는 읍면동 주민센터",
        applyUrl: "https://www.gov.kr",
        sourceName: "복지로",
        sourceUrl: "https://www.bokjiro.go.kr",
      },
      {
        title: "부모급여",
        summary: "만 0~1세 아동 양육 가정에 매월 지급되는 현금성 지원",
        content: `영아 양육 가정의 경제적 부담을 덜어주기 위해 매월 지급되는 현금성 지원입니다. 연령별 지급액은 매년 변경될 수 있습니다. ${NOTE}`,
        category: "FINANCE",
        provider: "CENTRAL_GOV",
        region: "전국",
        target: "만 0~1세 아동 양육 가정",
        amount: "연령별 상이 (복지로 최신 공고 참고)",
        applyMethod: "행복출산 원스톱서비스(정부24) 또는 읍면동 주민센터",
        applyUrl: "https://www.gov.kr",
        sourceName: "복지로",
        sourceUrl: "https://www.bokjiro.go.kr",
      },
      {
        title: "고위험 임산부 의료비 지원",
        summary: "조기진통 등 고위험 임신 질환 진료비 일부 지원",
        content: `19대 고위험 임신 질환으로 진단받고 입원 치료한 임산부에게 소득 기준에 따라 진료비 일부를 지원합니다. ${NOTE}`,
        category: "MEDICAL",
        provider: "LOCAL_GOV",
        region: "전국",
        target: "19대 고위험 임신질환 진단 및 입원치료 임산부",
        amount: "본인부담금의 90% 내외 (지자체별 상한액 상이)",
        applyMethod: "관할 보건소 방문 또는 온라인 신청",
        sourceName: "e보건소",
        sourceUrl: "https://www.e-health.go.kr",
      },
      {
        title: "산모·신생아 건강관리 지원사업",
        summary: "출산 가정에 건강관리사 방문 서비스 바우처 지원",
        content: `출산 가정에 산모·신생아 건강관리사가 방문하여 산모 회복과 신생아 돌봄을 지원하는 바우처 사업입니다. 소득 기준에 따라 본인부담금이 달라집니다. ${NOTE}`,
        category: "MEDICAL",
        provider: "LOCAL_GOV",
        region: "전국",
        target: "출산(예정) 가정, 기준중위소득 이하 우선 지원",
        amount: "서비스 기간·유형별 상이",
        applyMethod: "관할 보건소 또는 복지로 온라인 신청",
        sourceName: "e보건소",
        sourceUrl: "https://www.e-health.go.kr",
      },
      {
        title: "지하철 임산부 배려석 이용",
        summary: "임산부 전용 배려석 및 임산부 배지 제공",
        content: `수도권 지하철 등 대중교통에 임산부 배려석이 지정되어 있으며, 임산부 배지를 통해 임신 사실을 알릴 수 있습니다. ${NOTE}`,
        category: "TRANSPORT",
        provider: "LOCAL_GOV",
        region: "전국",
        target: "임산부",
        amount: "배지 무료 배부",
        applyMethod: "관할 보건소 또는 지하철 역사에서 임산부 배지 수령",
        sourceName: "지자체 공고",
      },
      {
        title: "임산부 친환경 농산물 꾸러미 지원",
        summary: "임산부에게 친환경 농산물 구입비 지원",
        content: `일부 지자체에서 임산부 건강 증진을 위해 친환경 농산물 꾸러미 구입비를 지원합니다. 시행 여부와 지원 내용은 지자체별로 다릅니다. ${NOTE}`,
        category: "ETC",
        provider: "LOCAL_GOV",
        region: "서울특별시",
        target: "관내 거주 임산부",
        amount: "지자체별 상이",
        applyMethod: "관할 구청 또는 보건소 문의",
        sourceName: "서울시 공고",
      },
      {
        title: "출산전후휴가 급여",
        summary: "출산전후휴가 기간 중 통상임금 상당액 지원",
        content: `근로기준법에 따른 출산전후휴가 기간 동안 고용보험에서 통상임금에 해당하는 급여를 지원합니다. ${NOTE}`,
        category: "EMPLOYMENT",
        provider: "CENTRAL_GOV",
        region: "전국",
        target: "고용보험 가입 근로자 중 출산전후휴가 사용자",
        amount: "통상임금 기준, 상한액 존재",
        applyMethod: "고용보험 홈페이지(고용24) 온라인 신청",
        applyUrl: "https://www.work24.go.kr",
        sourceName: "고용24",
        sourceUrl: "https://www.work24.go.kr",
      },
      {
        title: "자동차세 연납 및 임산부 친환경차 지원 안내",
        summary: "지자체별 임산부 대상 세제·차량 관련 혜택 안내",
        content: `일부 지자체는 임산부 가구를 대상으로 친환경차 구매 지원이나 자동차 관련 세제 혜택을 별도로 운영합니다. 시행 여부는 지자체 공고를 확인해야 합니다. ${NOTE}`,
        category: "TAX",
        provider: "LOCAL_GOV",
        region: "전국",
        target: "지자체 조례에 따른 임산부 가구",
        amount: "지자체별 상이",
        applyMethod: "관할 시/군/구청 세무과 문의",
        sourceName: "지자체 공고",
      },
    ],
  });

  const benefitByTitle = (title: string) =>
    benefits.find((b) => b.title === title)!;

  await prisma.checklistItem.createMany({
    data: [
      {
        stage: "EARLY",
        order: 1,
        title: "임신 확인 후 산부인과 등록",
        description: "가까운 산부인과에서 임신 확인 및 초기 검진 예약하기",
      },
      {
        stage: "EARLY",
        order: 2,
        title: "국민행복카드 발급 신청",
        description: "임신·출산 진료비 지원 바우처를 받기 위한 카드 발급",
        benefitId: benefitByTitle("임신·출산 진료비 지원 (국민행복카드)").id,
      },
      {
        stage: "EARLY",
        order: 3,
        title: "임산부 배지 수령",
        description: "보건소 또는 지하철역에서 임산부 배지 받기",
        benefitId: benefitByTitle("지하철 임산부 배려석 이용").id,
      },
      {
        stage: "MID",
        order: 1,
        title: "고위험 임신 여부 확인",
        description: "정기 검진에서 고위험 임신 질환 해당 여부 확인",
        benefitId: benefitByTitle("고위험 임산부 의료비 지원").id,
      },
      {
        stage: "MID",
        order: 2,
        title: "육아휴직/출산휴가 계획 회사에 공유",
        description: "출산전후휴가 및 육아휴직 일정 인사팀과 상의",
        benefitId: benefitByTitle("출산전후휴가 급여").id,
      },
      {
        stage: "LATE",
        order: 1,
        title: "출산전후휴가 신청",
        description: "출산 예정일 기준 휴가 개시일 확정 및 신청",
        benefitId: benefitByTitle("출산전후휴가 급여").id,
      },
      {
        stage: "LATE",
        order: 2,
        title: "산모·신생아 건강관리 서비스 신청",
        description: "출산 전 미리 보건소에 서비스 신청해두기",
        benefitId: benefitByTitle("산모·신생아 건강관리 지원사업").id,
      },
      {
        stage: "POSTPARTUM",
        order: 1,
        title: "출생신고",
        description: "출산 후 1개월 이내 주민센터에 출생신고",
      },
      {
        stage: "POSTPARTUM",
        order: 2,
        title: "첫만남이용권 신청",
        description: "출생신고 후 행복출산 원스톱서비스로 함께 신청",
        benefitId: benefitByTitle("첫만남이용권").id,
      },
      {
        stage: "POSTPARTUM",
        order: 3,
        title: "부모급여 신청",
        description: "출생신고와 함께 원스톱으로 신청 가능",
        benefitId: benefitByTitle("부모급여").id,
      },
    ],
  });

  const merchants = await prisma.merchant.createManyAndReturn({
    data: [
      {
        name: "가지 내과",
        category: "HOSPITAL",
        description: "임산부 수액 치료 가능한 내과",
        benefitInfo: "가지 회원증 제시 시 수액 치료비 5% 할인",
        address: "서울특별시 용산구 한강대로 100",
        region: "서울특별시",
        district: "용산구",
        latitude: 37.5326,
        longitude: 126.9905,
        photoUrl: "/images/merchants/gaji-internal-medicine.svg",
      },
      {
        name: "가지 피부과",
        category: "HOSPITAL",
        description: "쥐젖·편평사마귀 레이저 치료 가능한 피부과",
        benefitInfo: "가지 회원증 제시 시 쥐젖·편평사마귀 레이저 치료비 5% 할인",
        address: "서울특별시 성동구 왕십리로 100",
        region: "서울특별시",
        district: "성동구",
        latitude: 37.5633,
        longitude: 127.0371,
        photoUrl: "/images/merchants/gaji-dermatology.svg",
      },
      {
        name: "가지 정형외과",
        category: "HOSPITAL",
        description: "깁스 치료 가능한 정형외과",
        benefitInfo: "가지 회원증 제시 시 깁스 치료비 5% 할인",
        address: "서울특별시 영등포구 여의대로 100",
        region: "서울특별시",
        district: "영등포구",
        latitude: 37.5219,
        longitude: 126.9245,
        photoUrl: "/images/merchants/gaji-orthopedics.svg",
      },
      {
        name: "가지 안과",
        category: "HOSPITAL",
        description: "결막염 등 안질환 진료 가능한 안과",
        benefitInfo: "가지 회원증 제시 시 결막염 치료비 5% 할인",
        address: "서울특별시 관악구 관악로 100",
        region: "서울특별시",
        district: "관악구",
        latitude: 37.4784,
        longitude: 126.9516,
        photoUrl: "/images/merchants/gaji-ophthalmology.svg",
      },
      {
        name: "우리동네 마트 (임산부 배려 주차장 운영)",
        category: "MART",
        description: "임산부 전용 주차구역 및 우선 계산대 운영",
        benefitInfo:
          "매주 화요일 가지 회원증 제시 시 생필품·기저귀 전 품목 5% 할인\n주말(토·일) 오전 10시~12시 이유식·유아용품 10% 할인",
        address: "서울특별시 마포구 월드컵로 21",
        region: "서울특별시",
        district: "마포구",
        isFoundingPartner: false, // 정산 대시보드 테스트용: 21번째 이후 합류한 일반 매장 예시
        latitude: 37.5563,
        longitude: 126.9227,
        photoUrl: "/images/merchants/neighborhood-mart.svg",
      },
      {
        name: "포근한 카페 (유아 휴게실 운영)",
        category: "CAFE_RESTAURANT",
        description: "매장 내 유아 휴게실(기저귀 교환대) 운영",
        benefitInfo: "평일 오전 10시~12시 임산부 음료 전 메뉴 10% 할인\n유아 휴게실(기저귀 교환대) 무료 이용",
        address: "서울특별시 서초구 서초대로 45",
        region: "서울특별시",
        district: "서초구",
        latitude: 37.4945,
        longitude: 127.0142,
        photoUrl: "/images/merchants/cozy-cafe.svg",
      },
      {
        name: "새싹 태교 문화센터",
        category: "EDUCATION",
        description: "임산부 대상 태교 프로그램 운영",
        benefitInfo: "국민행복카드 문화바우처 사용 가능\n매주 수요일 가지 회원증 제시 시 프로그램 등록비 10% 할인",
        address: "서울특별시 송파구 올림픽로 300",
        region: "서울특별시",
        district: "송파구",
        latitude: 37.5219,
        longitude: 127.1236,
        photoUrl: "/images/merchants/saessak-edu.svg",
      },
      {
        name: "모락모락 장난감·책 대여방",
        category: "TOY_RENTAL",
        description: "개월수에 맞는 유아 장난감·전집 대여 서비스 운영",
        benefitInfo:
          "가지 회원증 제시 시 첫 달 대여료 20% 할인\n개월수별 장난감·책 추천 상담 무료 제공",
        address: "서울특별시 송파구 올림픽로 250",
        region: "서울특별시",
        district: "송파구",
        latitude: 37.5145,
        longitude: 127.1058,
        photoUrl: "/images/merchants/toy-book-rental.svg",
      },
      {
        name: "청주 무럭무럭 장난감 대여점",
        category: "TOY_RENTAL",
        description: "0~5세 개월수별 장난감·전집 정기 대여 서비스",
        benefitInfo: "가지 회원증 제시 시 정기 대여 신청비 면제\n형제자매 2명 이상 등록 시 두 번째 아동 대여료 15% 할인",
        address: "충청북도 청주시 상당구 상당로 150",
        region: "충청북도",
        district: "청주시 상당구",
        latitude: 36.6389,
        longitude: 127.4934,
        photoUrl: "/images/merchants/toy-book-rental-cheongju.svg",
      },
      {
        name: "청주 가지 고기집",
        category: "CAFE_RESTAURANT",
        description: "유아 휴게실 보유",
        benefitInfo: "매주 화·목요일 저녁 6~9시 가지 회원증 제시 시 고기 300g 무료 서비스",
        address: "충청북도 청주시 상당구 상당로 100",
        region: "충청북도",
        district: "청주시 상당구",
        latitude: 36.6357,
        longitude: 127.4913,
        photoUrl: "/images/merchants/cheongju-galbi.svg",
      },
      {
        name: "가지 동네 카페 청주점",
        category: "CAFE_RESTAURANT",
        description: "동네 카페, 유아 휴게 공간 보유",
        benefitInfo: "평일 오전 10시~12시 음료 사이즈업 무료\n무카페인 음료 상시 안내",
        address: "충청북도 청주시 상당구 중앙로 85",
        region: "충청북도",
        district: "청주시 상당구",
        latitude: 36.6372,
        longitude: 127.4896,
        photoUrl: "/images/merchants/gaji-cafe-cheongju.svg",
      },
      {
        name: "가지 약국",
        category: "PHARMACY",
        description: "임산부 영양제·상비약 상담 가능한 약국",
        benefitInfo: "가지 회원증 제시 시 철분제·엽산제 등 임산부 영양제 5% 할인\n처방약 조제 시 대기 없이 우선 조제 안내",
        address: "서울특별시 종로구 종로 100",
        region: "서울특별시",
        district: "종로구",
        latitude: 37.5735,
        longitude: 126.9788,
        photoUrl: "/images/merchants/gaji-pharmacy.svg",
      },
      {
        name: "청주 가지 약국",
        category: "PHARMACY",
        description: "임산부 영양제·상비약 상담 가능한 약국",
        benefitInfo: "가지 회원증 제시 시 임산부 영양제 구매 시 5% 할인\n상비약 구매 시 손소독제 증정",
        address: "충청북도 청주시 흥덕구 봉명로 50",
        region: "충청북도",
        district: "청주시 흥덕구",
        latitude: 36.6266,
        longitude: 127.447,
        photoUrl: "/images/merchants/cheongju-pharmacy.svg",
      },
      {
        name: "가지 스킨케어",
        category: "BEAUTY",
        description: "임산부 전용 튼살 케어 프로그램 운영",
        benefitInfo: "가지 회원증 제시 시 튼살 케어 프로그램 10% 할인\n임산부 전용 저자극 제품 상담 무료",
        address: "서울특별시 노원구 노원로 50",
        region: "서울특별시",
        district: "노원구",
        latitude: 37.6542,
        longitude: 127.0568,
        photoUrl: "/images/merchants/gaji-skincare.svg",
      },
      {
        name: "포근한 산모 마사지",
        category: "BEAUTY",
        description: "임산부 전용 마사지 관리 프로그램 운영",
        benefitInfo: "가지 회원증 제시 시 산모 마사지 10% 할인\n첫 방문 시 발마사지 15분 무료 체험",
        address: "서울특별시 은평구 은평로 50",
        region: "서울특별시",
        district: "은평구",
        latitude: 37.6027,
        longitude: 126.9291,
        photoUrl: "/images/merchants/gaji-mom-massage.svg",
      },
      {
        name: "가지 사진관",
        category: "ETC",
        description: "만삭·신생아 기념사진 촬영",
        benefitInfo: "가지 회원증 제시 시 만삭 사진 촬영 패키지 10% 할인\n촬영 예약 시 대기 공간 무료 이용",
        address: "서울특별시 강북구 도봉로 50",
        region: "서울특별시",
        district: "강북구",
        latitude: 37.6396,
        longitude: 127.0257,
        photoUrl: "/images/merchants/gaji-photo-studio.svg",
      },
      {
        name: "청주 늘봄 소아과의원",
        category: "HOSPITAL",
        description: "평일 야간·주말 오전 진료를 운영하는 소아과",
        benefitInfo:
          "평일 야간(18~21시), 토·일 오전 진료\n가지 회원증 제시 시 예방접종 상담 우선 안내\n다자녀 가정 형제 동반 진료 시 대기 없이 연속 진료",
        address: "충청북도 청주시 흥덕구 강서로 120",
        region: "충청북도",
        district: "청주시 흥덕구",
        latitude: 36.6318,
        longitude: 127.4285,
        photoUrl: "/images/merchants/cheongju-pediatrics.svg",
      },
      {
        name: "청주 한아름 마트",
        category: "MART",
        description: "기저귀·분유·아동복을 함께 취급하는 동네 마트",
        benefitInfo:
          "가지 회원증 제시 시 기저귀·분유 5% 할인\n매월 첫째 주 아동복 코너 10% 할인\n임산부 전용 주차구역 운영",
        address: "충청북도 청주시 서원구 사직대로 200",
        region: "충청북도",
        district: "청주시 서원구",
        latitude: 36.6318,
        longitude: 127.467,
        photoUrl: "/images/merchants/cheongju-mart.svg",
      },
      {
        name: "청주 반달 사진관",
        category: "ETC",
        description: "만삭·50일·돌 기념사진 촬영",
        benefitInfo:
          "가지 회원증 제시 시 돌 사진 패키지 10% 할인\n만삭 촬영 예약 시 액자 1개 무료 제공",
        address: "충청북도 청주시 상당구 무심동로 380",
        region: "충청북도",
        district: "청주시 상당구",
        latitude: 36.6415,
        longitude: 127.4855,
        photoUrl: "/images/merchants/cheongju-photo-studio.svg",
      },
      {
        name: "청주 소울 헤어",
        category: "BEAUTY",
        description: "임산부 저자극 시술이 가능한 미용실",
        benefitInfo:
          "가지 회원증 제시 시 커트·클리닉 10% 할인\n임산부 저자극 약제 상담 무료\n아이 동반 시 놀이 매트·대기 공간 제공",
        address: "충청북도 청주시 흥덕구 대농로 45",
        region: "충청북도",
        district: "청주시 흥덕구",
        latitude: 36.6435,
        longitude: 127.434,
        photoUrl: "/images/merchants/cheongju-hair.svg",
      },
      {
        name: "청주 아이놀이 문화센터",
        category: "EDUCATION",
        description: "영유아 공연·놀이 프로그램 운영",
        benefitInfo:
          "가지 회원증 제시 시 어린이 공연 관람권 20% 할인\n다자녀 가정 두 번째 아동부터 프로그램 등록비 면제",
        address: "충청북도 청주시 청원구 율량로 88",
        region: "충청북도",
        district: "청주시 청원구",
        latitude: 36.6712,
        longitude: 127.4885,
        photoUrl: "/images/merchants/cheongju-culture-center.svg",
      },
      {
        name: "청주 든든 분식",
        category: "CAFE_RESTAURANT",
        description: "아이 의자·유아 식기를 갖춘 동네 분식집",
        benefitInfo:
          "가지 회원증 제시 시 2인 이상 주문하면 어린이 메뉴 1개 무료\n유아 식기·아이 의자 상시 비치",
        address: "충청북도 청주시 청원구 내수로 25",
        region: "충청북도",
        district: "청주시 청원구",
        latitude: 36.6598,
        longitude: 127.4762,
        photoUrl: "/images/merchants/cheongju-bunsik.svg",
      },
    ],
  });

  const merchantByName = (name: string) => merchants.find((m) => m.name === name)!;

  await prisma.post.createMany({
    data: [
      {
        category: "INFO_SHARE",
        title: "첫만남이용권, 행복출산 원스톱으로 한 번에 신청했어요",
        content:
          "출생신고 하러 주민센터 갔다가 직원분이 원스톱 서비스로 첫만남이용권이랑 부모급여 같이 신청해주셔서 편했습니다. 다들 참고하세요!",
        authorName: "새콤달콤맘",
      },
      {
        category: "REVIEW",
        title: "고위험 임산부 의료비 지원 신청 후기",
        content:
          "조기진통으로 입원했었는데 보건소에서 안내받고 지원 신청했어요. 서류 준비는 입퇴원확인서랑 진단서만 있으면 돼서 생각보다 간단했습니다.",
        authorName: "튼튼이엄마",
      },
      {
        category: "QUESTION",
        title: "임산부 배지는 어디서 받나요?",
        content: "다음 주에 첫 검진 가는데 임산부 배지는 보건소 가면 바로 주나요, 아니면 미리 신청해야 하나요?",
        authorName: "예비맘23",
      },
      {
        category: "REVIEW",
        title: "말 안 꺼내도 회원증 보고 먼저 사이즈업 해주셨어요",
        content:
          "그동안 스티커 붙은 가게를 가도 제가 먼저 물어보기가 눈치 보여서 그냥 나온 적이 많았는데요.\n여기는 회원증 화면 보여드리니까 사장님이 바로 확인 눌러주시고 사이즈업 해주셨어요. 말을 꺼낼 필요가 없어서 그게 제일 좋았습니다.\n영수증 올려둘게요. 만삭이라 멀리 못 가시는 분들 참고하세요.",
        authorName: "청주새댁",
        merchantId: merchantByName("가지 동네 카페 청주점").id,
        amount: 5500,
        receiptImage: receiptImage({
          storeName: "가지 동네 카페 청주점",
          date: "2026-09-12 10:24",
          items: [
            { name: "디카페인 라떼 (L)", price: 5500 },
            { name: "사이즈업 할인", price: 0 },
          ],
          total: 5500,
        }),
      },
      {
        category: "REVIEW",
        title: "둘째 낳고 처음 외식했는데 300g 서비스 진짜 나왔습니다",
        content:
          "혜택 있다고 적혀 있어도 막상 가면 안 되는 경우가 있어서 반신반의했는데요.\n회원증 보여드리니 사장님이 앱에서 확인 눌러주시고 고기 300g 그대로 챙겨주셨습니다. 아이 의자도 먼저 가져다주셨어요.\n다음에 또 가면 재방문 할인이 올라간다고 해서 그것도 기대 중입니다.",
        authorName: "두아이아빠",
        merchantId: merchantByName("청주 가지 고기집").id,
        amount: 48000,
        receiptImage: receiptImage({
          storeName: "청주 가지 고기집",
          date: "2026-09-13 19:05",
          items: [
            { name: "삼겹살 2인분", price: 36000 },
            { name: "된장찌개", price: 8000 },
            { name: "음료 2", price: 4000 },
            { name: "가지 회원 300g 서비스", price: 0 },
          ],
          total: 48000,
        }),
      },
      {
        category: "REVIEW",
        title: "장난감 대여 신청비 면제받았어요 (개월수 상담까지)",
        content:
          "18개월 아이라 뭘 빌려야 할지 몰라서 갔는데, 개월수 맞춰서 추천해 주시고 신청비는 회원증 보여드리니 면제해 주셨습니다.\n큰아이 것까지 같이 등록하면 둘째 대여료가 할인된다고 해서 다음 달에 같이 하려고요.\n영수증 첨부합니다.",
        authorName: "무럭무럭맘",
        merchantId: merchantByName("청주 무럭무럭 장난감 대여점").id,
        amount: 30000,
        receiptImage: receiptImage({
          storeName: "청주 무럭무럭 장난감 대여점",
          date: "2026-09-10 15:40",
          items: [
            { name: "정기 대여 1개월", price: 30000 },
            { name: "신청비 (회원증 면제)", price: 0 },
          ],
          total: 30000,
        }),
      },
    ],
  });

  console.log("Seed complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
