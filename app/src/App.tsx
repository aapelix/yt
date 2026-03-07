import { useEffect, useState } from "react";
import { ThemeProvider } from "./components/theme/theme-provider";
import { Input } from "./components/ui/input";
import { Button } from "./components/ui/button";
import { Card, CardContent, CardFooter } from "./components/ui/card";
import { Separator } from "./components/ui/separator";
import { downloadFile } from "./lib/download";
import { Field, FieldLabel } from "./components/ui/field";
import { Progress } from "./components/ui/progress";
import { capitalize } from "./lib/utils";
import { ModeToggle } from "./components/theme/mode-toggle";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "./components/ui/select";
import { audioQualities, videoQualities } from "./lib/qualities";

const URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

export function App() {
  const [input, setInput] = useState("");

  const [jobId, setJobId] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");

  // settings
  const [video, setVideo] = useState(videoQualities[0].value);
  const [audio, setAudio] = useState(audioQualities[0].value);

  const formatString = `${video}+${audio}`;
  useEffect(() => {
    console.log("Selected format:", formatString);
  }, [video, audio, formatString]);

  const downloadVideo = async (url: string) => {
    if (!url || url.length === 0) return;

    try {
      const res = await fetch(`${URL}/download`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          url,
          quality: formatString,
          fallback: true,
        }),
      });
      const data = await res.json();
      console.log("Download started:", data);

      setJobId(data.id);
      setStatus("queued");
      setProgress(0);
    } catch (error) {
      console.error("Error downloading video:", error);
    }
  };

  useEffect(() => {
    if (!jobId) return;

    const interval = setInterval(async () => {
      try {
        const res = await fetch(`${URL}/status?id=${jobId}`);
        const data = await res.json();

        setStatus(data.Status);
        setProgress(data.Progress);

        if (data.Status === "finished") {
          clearInterval(interval);
          downloadFile(`${URL}/file?id=${jobId}`);
          setJobId(null);
          setInput("");
        } else if (data.Status === "error") {
          clearInterval(interval);
          setError(data.Error);
          setJobId(null);
        }
      } catch (error) {
        console.error("Error checking job status:", error);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [jobId]);

  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <div className="absolute top-4 left-4">
        <ModeToggle />
      </div>

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
              <div className="flex flex-row gap-1">
                <Select
                  onValueChange={(e) => setVideo(e as string)}
                  items={videoQualities}
                >
                  <SelectTrigger className={"flex-1 min-w-0"}>
                    <SelectValue placeholder="Video Quality" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Video quality</SelectLabel>
                      {videoQualities.map((q) => (
                        <SelectItem key={q.value} value={q.value}>
                          {q.label}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>

                <Select
                  onValueChange={(e) => setAudio(e as string)}
                  items={audioQualities}
                >
                  <SelectTrigger className={"flex-1 min-w-0"}>
                    <SelectValue placeholder="Audio Quality" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Audio quality</SelectLabel>
                      {audioQualities.map((q) => (
                        <SelectItem key={q.value} value={q.value}>
                          {q.label}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>

                <Dialog>
                  <DialogTrigger
                    render={
                      <Button variant={"outline"} className={"flex-1 min-w-0"}>
                        More Settings
                      </Button>
                    }
                  />
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Settings</DialogTitle>
                      <DialogDescription>
                        Please know what you are doing when changing these
                      </DialogDescription>
                    </DialogHeader>
                    <Field>
                      <FieldLabel>Coming soon...</FieldLabel>
                    </Field>
                    <DialogFooter>
                      <DialogClose
                        render={<Button variant={"outline"}>Close</Button>}
                      />
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
              <Separator className={"my-4"} />
            </div>
          </CardContent>
          {status !== "" && (
            <CardFooter>
              <Field>
                <FieldLabel>
                  <span>{capitalize(status)}</span>
                  <span className="ml-auto">
                    {status === "downloading" && `(${progress}%)`}
                    {status === "error" && error}
                  </span>
                </FieldLabel>
                <Progress value={progress} />
              </Field>
            </CardFooter>
          )}
        </Card>
      </div>
    </ThemeProvider>
  );
}

export default App;
