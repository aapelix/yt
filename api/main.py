import os
import uuid

import yt_dlp
from fastapi import BackgroundTasks, FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

DOWNLOAD_DIR = "downloads"
os.makedirs(DOWNLOAD_DIR, exist_ok=True)

app.mount("/videos", StaticFiles(directory=DOWNLOAD_DIR), name="videos")


def remove_file(path: str):
    if os.path.exists(path):
        os.remove(path)


@app.get("/file/{name}")
def get_file(name: str, background_tasks: BackgroundTasks):
    path = os.path.join(DOWNLOAD_DIR, name)
    background_tasks.add_task(remove_file, path)
    return FileResponse(path, filename=name, media_type="application/octet-stream")


@app.get("/download")
def download(
    url: str,
    quality: str | None = Query(None, description="best, 1080, 720, etc"),
    audio_quality: str | None = Query(None, description="best, 128k, etc"),
    video_codec: str | None = Query(None, description="h264, vp9, av1"),
    audio_codec: str | None = Query(None, description="mp3, m4a, opus"),
    subtitles: bool = False,
    subtitle_lang: str = "en",
):
    video_id = str(uuid.uuid4())
    filename = f"{DOWNLOAD_DIR}/{video_id}.%(ext)s"

    format_selector = "best"

    if quality:
        if quality in ["best", "worst"]:
            format_selector = quality
        else:
            format_selector = f"bestvideo[height<={quality}]+bestaudio/best"

    if audio_quality:
        if audio_quality in ["best", "worst"]:
            format_selector = f"{format_selector}+{audio_quality}"
        else:
            format_selector = f"{format_selector}+bestaudio[abr<={audio_quality}]"

    ydl_opts = {
        "outtmpl": filename,
        "merge_output_format": "mp4",
        "format": format_selector,
    }

    if video_codec:
        ydl_opts.setdefault("postprocessors", []).append(
            {
                "key": "FFmpegVideoConvertor",
                "preferedformat": "mp4",
            }
        )

    if audio_codec:
        ydl_opts.setdefault("postprocessors", []).append(
            {
                "key": "FFmpegExtractAudio",
                "preferredcodec": audio_codec,
            }
        )

    if subtitles:
        ydl_opts.update(
            {
                "writesubtitles": True,
                "subtitleslangs": [subtitle_lang],
                "embedsubtitles": True,
            }
        )

    with yt_dlp.YoutubeDL(ydl_opts) as ydl:
        info = ydl.extract_info(url)
        ext = info.get("ext", "mp4")

    return {"url": f"/file/{video_id}.{ext}"}
