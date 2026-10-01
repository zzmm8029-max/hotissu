"""영상 생성 provider.

- local  : videos/ 폴더에서 수정시각이 가장 오래된 mp4 를 하나 사용
- command: 외부 명령(VIDEO_COMMAND)으로 영상 생성. {topic}, {output} 을 치환한다.
           영상 생성 API(예: 사용 중인 AI 영상 서비스)를 호출하는 스크립트를 연결하면 된다.
"""
import os
import shlex
import subprocess
from pathlib import Path


def generate_video(topic, workdir="videos"):
    provider = os.environ.get("VIDEO_PROVIDER", "local")
    if provider == "local":
        return _local(workdir)
    if provider == "command":
        return _command(topic, workdir)
    raise ValueError(f"알 수 없는 VIDEO_PROVIDER: {provider}")


def _local(workdir):
    files = sorted(Path(workdir).glob("*.mp4"), key=lambda p: p.stat().st_mtime)
    if not files:
        raise FileNotFoundError(f"{workdir}/ 에 업로드할 mp4 가 없습니다")
    return str(files[0])


def _command(topic, workdir):
    tpl = os.environ.get("VIDEO_COMMAND")
    if not tpl:
        raise ValueError("VIDEO_COMMAND 가 설정되지 않았습니다")
    out = str(Path(workdir) / "generated.mp4")
    cmd = [a.format(topic=topic, output=out) for a in shlex.split(tpl)]
    subprocess.run(cmd, check=True)
    if not Path(out).exists():
        raise FileNotFoundError(f"명령 실행 후 {out} 이 생성되지 않았습니다")
    return out
