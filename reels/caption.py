"""캡션 생성. ANTHROPIC_API_KEY 가 없으면 주제 문구를 그대로 사용."""
import os


def make_caption(topic):
    if not os.environ.get("ANTHROPIC_API_KEY"):
        return topic
    import anthropic

    msg = anthropic.Anthropic().messages.create(
        model=os.environ.get("CAPTION_MODEL", "claude-sonnet-5-5"),
        max_tokens=400,
        messages=[{
            "role": "user",
            "content": (
                "인스타그램 릴스 캡션을 한국어로 작성해줘. 첫 줄은 시선을 끄는 한 문장, "
                "이어서 2~3줄 설명, 마지막 줄에 해시태그 5개. 캡션 본문만 출력.\n"
                f"주제: {topic}"
            ),
        }],
    )
    return msg.content[0].text.strip()
