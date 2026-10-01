# hotissu — 인스타그램 릴스 자동 업로드

`topics.txt` 주제 → 영상 생성 → 캡션(Claude) → Instagram Graph API 업로드, GitHub Actions 로 매일 실행.

## 1회 준비 (직접 해야 하는 부분)
1. 인스타그램 **프로페셔널(비즈니스/크리에이터) 계정**을 페이스북 페이지에 연결
2. [Meta for Developers](https://developers.facebook.com)에서 앱 생성 → 권한 `instagram_basic`, `instagram_content_publish`, `pages_show_list`
3. **장기 액세스 토큰**(60일, 갱신 필요)과 **IG User ID** 발급
4. GitHub → Settings → Secrets: `IG_USER_ID`, `IG_ACCESS_TOKEN`, (선택) `ANTHROPIC_API_KEY`

## 영상 생성 연결
- `VIDEO_PROVIDER=local` (기본): `videos/` 에 mp4 를 넣어두면 오래된 것부터 업로드
- `VIDEO_PROVIDER=command`: Actions *Variables* 에 `VIDEO_PROVIDER=command`, `VIDEO_COMMAND='python gen.py --topic "{topic}" --out "{output}"'`
  → 사용할 AI 영상 서비스 API 를 호출해 `{output}` 에 mp4 를 저장하는 스크립트를 연결

## 릴스 영상 조건
mp4/mov, 9:16 권장, 3초~15분, 최대 300MB.

## 실행
```
pip install -r requirements.txt
python -m pytest -q
python -m reels.main --dry-run   # 업로드 없이 확인
```
Actions 탭 → *Instagram 릴스 자동 업로드* → Run workflow (기본 dry-run).
