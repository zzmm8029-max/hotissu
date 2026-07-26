/**
 * 공공데이터포털(data.go.kr) API 연동을 위한 공통 래퍼.
 *
 * 아직 실제 데이터셋은 연동되어 있지 않습니다. data.go.kr에서 원하는 API를
 * 활용신청하고 발급받은 서비스키를 PUBLIC_DATA_API_KEY 환경변수에 설정한 뒤,
 * 아래 fetchPublicData를 사용해 각 데이터셋별 fetch 함수를 추가하세요.
 *
 * 예시(보건복지부 임신·출산 지원 서비스 등 실제 데이터셋 연동 시):
 *   const items = await fetchPublicData<RawBenefitItem>(
 *     "https://api.odcloud.kr/api/xxx/v1/uddi:xxxx",
 *     { page: "1", perPage: "100" }
 *   );
 */

const PUBLIC_DATA_API_KEY = process.env.PUBLIC_DATA_API_KEY;

export class PublicDataApiError extends Error {}

/**
 * data.go.kr 공공데이터 API를 JSON 응답 기준으로 호출하는 공통 함수.
 * serviceKey는 자동으로 붙여줍니다.
 */
export async function fetchPublicData<T>(
  endpoint: string,
  params: Record<string, string> = {}
): Promise<T> {
  if (!PUBLIC_DATA_API_KEY) {
    throw new PublicDataApiError(
      "PUBLIC_DATA_API_KEY 환경변수가 설정되어 있지 않습니다. .env 파일을 확인하세요."
    );
  }

  const url = new URL(endpoint);
  url.searchParams.set("serviceKey", PUBLIC_DATA_API_KEY);
  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, value);
  }

  const res = await fetch(url, { next: { revalidate: 60 * 60 } });

  if (!res.ok) {
    throw new PublicDataApiError(
      `공공데이터포털 API 호출 실패: ${res.status} ${res.statusText}`
    );
  }

  return res.json() as Promise<T>;
}
