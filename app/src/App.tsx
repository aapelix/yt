import { useState } from "react";
import { ThemeProvider } from "./components/theme/theme-provider";
import { Input } from "./components/ui/input";
import { Button } from "./components/ui/button";
import { Card, CardContent } from "./components/ui/card";
import { Separator } from "./components/ui/separator";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "./components/ui/select";

type VideoQuality = "best" | "worst" | "1080" | "720" | "480" | "2160";
type VideoCodec = "h264" | "vp9" | "av1";
type AudioQuality = "best" | "worst";

const URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

export function App() {
  const [input, setInput] = useState("");

  const [quality, setQuality] = useState<VideoQuality | null>(null);
  const [audioQuality, setAudioQuality] = useState<AudioQuality | null>(null);
  const [videoCodec, setVideoCodec] = useState<VideoCodec | null>(null);
  const [subtitleLanguage, setSubtitleLanguage] = useState<string | null>(null);

  const downloadVideo = async (url: string) => {
    const params = new URLSearchParams();
    params.append("url", url);
    if (quality) params.append("quality", quality);
    if (videoCodec) params.append("video_codec", videoCodec);
    if (audioQuality) params.append("audio_quality", audioQuality);
    if (subtitleLanguage) {
      params.append("subtitles", "true");
      params.append("subtitle_lang", subtitleLanguage);
    }

    const res = await fetch(`${URL}/download?${params.toString()}`);
    const data = await res.json();
    const downloadUrl = `${URL}${data.url}`;

    const a = document.createElement("a");
    a.href = downloadUrl;
    a.download = "";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Card>
          <CardContent>
            <div className="flex flex-col gap-1 w-sm">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="https://www.youtube.com/watch?v="
              />
              <Button onClick={() => downloadVideo(input)}>Download</Button>
              <Separator className={"my-4"} />

              <div className="flex flex-row gap-1 justify-center">
                {/* VIDEO QUALITY */}
                <Select
                  onValueChange={(value) =>
                    setQuality((value as string).toLowerCase() as VideoQuality)
                  }
                >
                  <SelectTrigger className={"flex-1 min-w-0"}>
                    <SelectValue placeholder="Video Quality" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Video Quality</SelectLabel>
                      <SelectItem value={"Best"}>Best</SelectItem>
                      <SelectItem value={"2160"}>2160p (4K)</SelectItem>
                      <SelectItem value={"1080"}>1080p</SelectItem>
                      <SelectItem value={"720"}>720p</SelectItem>
                      <SelectItem value={"480"}>480p</SelectItem>
                      <SelectItem value={"Worst"}>Worst</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>

                {/* AUDIO QUALITY */}
                <Select
                  onValueChange={(value) =>
                    setAudioQuality(
                      (value as string).toLowerCase() as AudioQuality,
                    )
                  }
                >
                  <SelectTrigger className={"flex-1 min-w-0"}>
                    <SelectValue placeholder="Audio Quality" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Audio Quality</SelectLabel>
                      <SelectItem value={"Best"}>Best</SelectItem>
                      <SelectItem value={"Worst"}>Worst</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>

                {/* VIDEO CODEC */}
                <Select
                  onValueChange={(value) =>
                    setVideoCodec((value as string).toLowerCase() as VideoCodec)
                  }
                >
                  <SelectTrigger className={"flex-1 min-w-0"}>
                    <SelectValue placeholder="Video Codec" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Video Codec</SelectLabel>
                      <SelectItem value={"h264"}>H.264</SelectItem>
                      <SelectItem value={"vp9"}>VP9</SelectItem>
                      <SelectItem value={"av1"}>AV1</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-row gap-1 justify-center mt-1">
                <Input
                  disabled
                  className="w-full"
                  value={subtitleLanguage || ""}
                  onChange={(e) => setSubtitleLanguage(e.target.value)}
                  placeholder="Subtitle Language (e.g. en) NOT WORKING"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </ThemeProvider>
  );
}

export default App;
