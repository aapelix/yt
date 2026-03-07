package src

import (
	"encoding/json"
	"net/http"

	"github.com/google/uuid"
)

func DownloadHandler(w http.ResponseWriter, r *http.Request) {
	var req DownloadRequest
	json.NewDecoder(r.Body).Decode(&req)

	id := uuid.New().String()

	job := &Job{
		ID:      id,
		Status:  "queued",
		Request: req,
	}

	mu.Lock()
	jobs[id] = job
	mu.Unlock()

	queue <- job

	json.NewEncoder(w).Encode(map[string]string{"id": id})
}
