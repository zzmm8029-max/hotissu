# 로카인드 — 임산부 배려 혜택 플랫폼

임산부를 위한 혜택·정책, 배려 가맹점, 혜택 신청 체크리스트, 커뮤니티를 한곳에서
모아 볼 수 있는 반응형 웹앱입니다.

## 핵심 기능

- **혜택/정책 정보 모음** (`/benefits`): 중앙정부·지자체·민간의 임산부 관련 혜택을
  카테고리별로 모아보고 상세 정보를 확인합니다.
- **배려 가맹점** (`/merchants`): 임산부 배려석, 전용 주차장, 유아 휴게실(기저귀 교환대) 등을 갖춘
  가맹점·시설을 카테고리/지역별로 찾아봅니다.
- **혜택 신청 체크리스트** (`/checklist`): 임신 초기~출산 후 시기별로 챙겨야 할
  혜택 신청 항목을 체크합니다. (체크 상태는 브라우저 localStorage에 저장)
- **커뮤니티** (`/community`): 혜택 신청 후기, 질문, 정보 공유 게시판.

## 기술 스택

- Next.js (App Router) + TypeScript + Tailwind CSS
- Prisma + SQLite (개발용, `better-sqlite3` 드라이버 어댑터 사용)

## 시작하기

```bash
npm install
npx prisma migrate dev   # DB 스키마 적용 (최초 1회 또는 스키마 변경 시)
npm run db:seed          # 샘플 데이터 채우기
npm run dev
```

<http://localhost:3000> 에서 확인할 수 있습니다.

> ⚠️ 현재 시드 데이터(`prisma/seed.ts`)는 실제 정책 정보를 참고해 작성한
> **샘플 데이터**입니다. 서비스에 실제로 반영하기 전 반드시 정부24, 복지로,
> 관할 지자체 공고를 통해 최신 정보를 다시 확인하세요.

## 공공데이터포털 API 연동 방법

1. [공공데이터포털](https://www.data.go.kr)에서 원하는 데이터셋
   (예: 보건복지부 임신·출산 지원 서비스, 지자체 임산부 배려 시설 현황 등)을
   검색해 활용신청하고 서비스키(Decoding 키)를 발급받습니다.
2. `.env` 파일의 `PUBLIC_DATA_API_KEY`에 발급받은 키를 입력합니다.
3. `src/lib/public-data.ts`의 `fetchPublicData()`를 사용해 데이터셋별 fetch
   함수를 작성합니다.
4. 가져온 원본 데이터를 `Benefit` / `Merchant` 모델 형태로 변환해
   `prisma.benefit.upsert(...)` / `prisma.merchant.upsert(...)` 등으로
   DB에 반영하는 동기화 스크립트(예: `scripts/sync-benefits.ts`)를 추가하고,
   주기적으로 실행되도록 스케줄링합니다(예: cron, GitHub Actions 등).

## 프로젝트 구조

```
prisma/schema.prisma       데이터 모델 (Benefit, Merchant, ChecklistItem, Post, Comment)
prisma/seed.ts             샘플 데이터
src/lib/prisma.ts          Prisma Client 싱글턴
src/lib/labels.ts          enum -> 한글 라벨 매핑
src/lib/public-data.ts     공공데이터포털 API 연동 래퍼
src/app/                   페이지 (benefits, merchants, checklist, community)
```
