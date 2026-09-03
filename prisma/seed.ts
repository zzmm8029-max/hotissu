import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "../src/generated/prisma/client";

const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL ?? "file:./dev.db",
});
const prisma = new PrismaClient({ adapter });

const NOTE =
  "※ 샘플 데이터입니다. 정확한 지원 대상·금액·기간은 정부24, 복지로 또는 관할 지자체 공고를 통해 반드시 다시 확인하세요.";

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

  await prisma.merchant.createMany({
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
    ],
  });

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
