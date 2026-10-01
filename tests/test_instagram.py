from unittest.mock import MagicMock

import pytest

from reels.instagram import InstagramClient, InstagramError


def resp(data, ok=True):
    r = MagicMock()
    r.ok = ok
    r.json.return_value = data
    r.text = str(data)
    r.status_code = 200 if ok else 400
    return r


def test_post_reel_flow(tmp_path):
    video = tmp_path / "a.mp4"
    video.write_bytes(b"x" * 10)
    s = MagicMock()
    s.post.side_effect = [
        resp({"id": "C1", "uri": "https://rupload/C1"}),  # create
        resp({"success": True}),                          # upload
        resp({"id": "M1"}),                               # publish
    ]
    s.get.side_effect = [resp({"status_code": "IN_PROGRESS"}), resp({"status_code": "FINISHED"})]
    c = InstagramClient("U", "T", session=s)
    assert c.post_reel(str(video), "cap", sleep=lambda _: None) == "M1"
    assert s.post.call_args_list[1].kwargs["headers"]["file_size"] == "10"


def test_container_error():
    s = MagicMock()
    s.get.return_value = resp({"status_code": "ERROR"})
    with pytest.raises(InstagramError):
        InstagramClient("U", "T", session=s).wait_until_ready("C", sleep=lambda _: None)
