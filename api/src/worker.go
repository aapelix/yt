package src

import (
	"bufio"
	"fmt"
	"os/exec"
	"strings"
)

func StartWorker() {
	go func() {
		for job := range queue {
			job.Status = "downloading"

			args := []string{
				job.Request.URL,
				"--newline",
				"-v",
				"-o", "downloads/%(title)s.%(ext)s",
			}

			if job.Request.Quality != "" {
				args = append(args, "-f", job.Request.Quality)
			}

			if job.Request.VideoCodec != "" {
				args = append(args, "--recode-video", job.Request.VideoCodec)
			}

			if job.Request.Fallback {
				args = append(args, "-f", fmt.Sprintf("%s/bv*+ba/b", job.Request.Quality))
			}

			if job.Request.Format != "" {
				args = append(args, "--recode-video", job.Request.Format)
			}

			cmd := exec.Command("yt-dlp", args...)

			cmd.Stderr = cmd.Stdout
			stdout, _ := cmd.StdoutPipe()

			cmd.Start()

			scanner := bufio.NewScanner(stdout)

			for scanner.Scan() {
				line := scanner.Text()

				fmt.Println("OUT:", line)

				if strings.Contains(line, "%") {
					var p float64
					_, err := fmt.Sscanf(line, "[download] %f%%", &p)
					if err == nil {
						job.Progress = p
					}
				}

				if strings.HasPrefix(line, "/") {
					job.File = line
				}
			}

			err := cmd.Wait()
			if job.Status != "failed" {
				if err != nil {
					job.Status = "failed"
					job.Error = err.Error()
				} else {
					filenameCmd := exec.Command("yt-dlp", "--get-filename", "-o", "downloads/%(title)s.%(ext)s", job.Request.URL)
					out, err := filenameCmd.Output()
					if err != nil {
						job.Status = "failed"
						job.Error = err.Error()
						continue
					}

					job.File = strings.TrimSpace(string(out))
					job.Progress = 100
					job.Status = "finished"
				}
			}

		}
	}()
}
