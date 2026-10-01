"""주제 큐에서 하나를 꺼내 영상 생성 → 캡션 → 릴스 업로드."""
import json
import os
import sys
from pathlib import Path

from reels.caption import make_caption
from reels.generator import generate_video
from reels.instagram import InstagramClient

TOPICS = Path("topics.txt")
POSTED = Path("posted.json")


def next_topic():
    posted = set(json.loads(POSTED.read_text() or "[]")) if POSTED.exists() else set()
    for line in TOPICS.read_text(encoding="utf-8").splitlines():
        line = line.strip()
        if line and not line.startswith("#") and line not in posted:
            return line
    return None


def mark_posted(topic):
    posted = json.loads(POSTED.read_text() or "[]") if POSTED.exists() else []
    posted.append(topic)
    POSTED.write_text(json.dumps(posted, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


def main():
    dry = "--dry-run" in sys.argv
    topic = next_topic()
    if not topic:
        print("올릴 주제가 없습니다 (topics.txt 확인)")
        return 0
    print(f"주제: {topic}")
    video = generate_video(topic)
    caption = make_caption(topic)
    print(f"영상: {video}\n캡션:\n{caption}")
    if dry:
        print("[dry-run] 업로드하지 않음")
        return 0
    client = InstagramClient(
        os.environ["IG_USER_ID"],
        os.environ["IG_ACCESS_TOKEN"],
        os.environ.get("GRAPH_API_VERSION", "v21.0"),
    )
    media_id = client.post_reel(video, caption)
    print(f"업로드 완료 media_id={media_id}")
    mark_posted(topic)
    if os.environ.get("VIDEO_PROVIDER", "local") == "local":
        Path(video).unlink()  # 같은 영상 중복 업로드 방지
    return 0


if __name__ == "__main__":
    sys.exit(main())
