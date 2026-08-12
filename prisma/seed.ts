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
        name: "서울시 보건소 맘편한 임신 상담센터",
        category: "HOSPITAL",
        description: "임신·출산 관련 상담 및 각종 지원 신청 안내",
        benefitInfo: "임신·출산 진료비, 산모·신생아 건강관리 서비스 신청 안내",
        address: "서울특별시 중구 세종대로 110",
        region: "서울특별시",
        district: "중구",
        latitude: 37.5665,
        longitude: 126.978,
        phone: "120",
        sourceName: "서울시",
      },
      {
        name: "행복맘 산부인과",
        category: "HOSPITAL",
        description: "임산부 정기검진 및 고위험 임신 관리",
        benefitInfo: "국민행복카드 사용 가능, 고위험 임산부 의료비 지원 연계",
        address: "서울특별시 강남구 테헤란로 123",
        region: "서울특별시",
        district: "강남구",
        latitude: 37.5006,
        longitude: 127.0364,
        phone: "02-000-0000",
      },
      {
        name: "우리동네 마트 (임산부 배려 주차장 운영)",
        category: "TRANSPORT_FACILITY",
        description: "임산부 전용 주차구역 및 우선 계산대 운영",
        benefitInfo: "임산부 배지 제시 시 전용 주차구역 이용, 우선 계산 서비스",
        address: "서울특별시 마포구 월드컵로 21",
        region: "서울특별시",
        district: "마포구",
        isFoundingPartner: false, // 정산 대시보드 테스트용: 21번째 이후 합류한 일반 매장 예시
        latitude: 37.5563,
        longitude: 126.9227,
      },
      {
        name: "지하철 2호선 시청역 임산부 배려석",
        category: "TRANSPORT_FACILITY",
        description: "임산부 배려석 지정 구역",
        benefitInfo: "임산부 배지 소지 시 우선 이용 가능한 배려석",
        address: "서울특별시 중구 세종대로 지하 101",
        region: "서울특별시",
        district: "중구",
        latitude: 37.5658,
        longitude: 126.9769,
      },
      {
        name: "포근한 카페 (유아 휴게실 운영)",
        category: "CAFE_RESTAURANT",
        description: "매장 내 유아 휴게실(기저귀 교환대) 운영",
        benefitInfo: "유아 휴게실 무료 이용, 임산부 음료 10% 할인",
        address: "서울특별시 서초구 서초대로 45",
        region: "서울특별시",
        district: "서초구",
        latitude: 37.4945,
        longitude: 127.0142,
      },
      {
        name: "새싹 태교 문화센터",
        category: "EDUCATION",
        description: "임산부 대상 태교 프로그램 운영",
        benefitInfo: "국민행복카드 문화바우처 사용 가능",
        address: "서울특별시 송파구 올림픽로 300",
        region: "서울특별시",
        district: "송파구",
        latitude: 37.5219,
        longitude: 127.1236,
      },
      {
        name: "청주 상당 산부인과",
        category: "HOSPITAL",
        description: "임산부 정기검진 및 초음파 검사",
        benefitInfo: "임산부 배려 주차, 대기 없이 우선 진료 안내",
        address: "충청북도 청주시 상당구 상당로 100",
        region: "충청북도",
        district: "청주시 상당구",
        latitude: 36.6357,
        longitude: 127.4913,
      },
      {
        name: "가지 동네 카페 청주점",
        category: "CAFE_RESTAURANT",
        description: "산부인과 인근 카페, 유아 휴게 공간 보유",
        benefitInfo: "회원증 제시 시 음료 사이즈업 무료, 무카페인 음료 안내",
        address: "충청북도 청주시 상당구 중앙로 85",
        region: "충청북도",
        district: "청주시 상당구",
        latitude: 36.6372,
        longitude: 127.4896,
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
