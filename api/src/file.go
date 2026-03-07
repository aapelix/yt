package src

import (
	"fmt"
	"io"
	"mime"
	"net/http"
	"os"
	"path/filepath"
)

func FileHandler(w http.ResponseWriter, r *http.Request) {
	id := r.URL.Query().Get("id")
	fmt.Println("File request for ID:", id)

	mu.Lock()
	job, ok := jobs[id]
	mu.Unlock()

	if !ok || job.Status != "finished" {
		http.Error(w, "File not ready", http.StatusNotFound)
		return
	}

	f, err := os.Open(job.File)
	if err != nil {
		http.Error(w, "Unable to open file", http.StatusInternalServerError)
		return
	}
	defer f.Close()

	filename := filepath.Base(job.File)
	ext := filepath.Ext(filename)

	mimeType := mime.TypeByExtension(ext)
	if mimeType == "" {
		mimeType = "application/octet-stream"
	}

	w.Header().Set("Content-Disposition", fmt.Sprintf("attachment; filename=\"%s\"", filename))
	w.Header().Set("Content-Type", mimeType)

	_, err = io.Copy(w, f)
	if err != nil {
		fmt.Println("Error sending file:", err)
		return
	}

	err = os.Remove(job.File)
	if err != nil {
		fmt.Println("Error deleting file:", err)
	}

	mu.Lock()
	delete(jobs, id)
	mu.Unlock()
}
