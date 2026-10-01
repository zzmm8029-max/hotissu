"""Instagram Graph API 릴스 업로드 클라이언트 (resumable 업로드 방식)."""
import os
import time

import requests


class InstagramError(RuntimeError):
    pass


class InstagramClient:
    def __init__(self, user_id, token, version="v21.0", session=None):
        self.user_id = user_id
        self.token = token
        self.base = f"https://graph.facebook.com/{version}"
        self.s = session or requests.Session()

    def _check(self, r):
        if not r.ok:
            raise InstagramError(f"{r.status_code} {r.text}")
        return r.json()

    def create_container(self, caption):
        """릴스 컨테이너 생성. 영상 업로드용 uri 를 함께 받는다."""
        r = self.s.post(
            f"{self.base}/{self.user_id}/media",
            data={
                "media_type": "REELS",
                "upload_type": "resumable",
                "caption": caption,
                "access_token": self.token,
            },
            timeout=60,
        )
        data = self._check(r)
        return data["id"], data["uri"]

    def upload_video(self, uri, path):
        size = os.path.getsize(path)
        with open(path, "rb") as f:
            r = self.s.post(
                uri,
                headers={
                    "Authorization": f"OAuth {self.token}",
                    "offset": "0",
                    "file_size": str(size),
                },
                data=f,
                timeout=600,
            )
        self._check(r)

    def wait_until_ready(self, container_id, timeout=600, interval=10, sleep=time.sleep):
        deadline = time.monotonic() + timeout
        while True:
            r = self.s.get(
                f"{self.base}/{container_id}",
                params={"fields": "status_code,status", "access_token": self.token},
                timeout=60,
            )
            data = self._check(r)
            code = data.get("status_code")
            if code == "FINISHED":
                return
            if code in ("ERROR", "EXPIRED"):
                raise InstagramError(f"컨테이너 처리 실패: {data}")
            if time.monotonic() > deadline:
                raise InstagramError(f"컨테이너 처리 시간 초과: {data}")
            sleep(interval)

    def publish(self, container_id):
        r = self.s.post(
            f"{self.base}/{self.user_id}/media_publish",
            data={"creation_id": container_id, "access_token": self.token},
            timeout=60,
        )
        return self._check(r)["id"]

    def post_reel(self, video_path, caption, **wait_kwargs):
        container_id, uri = self.create_container(caption)
        self.upload_video(uri, video_path)
        self.wait_until_ready(container_id, **wait_kwargs)
        return self.publish(container_id)
