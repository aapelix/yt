package main

import (
	"api/src"
	"fmt"
	"net/http"
)

func cors(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

		if r.Method == http.MethodOptions {
			return
		}

		next.ServeHTTP(w, r)
	})
}

func main() {
	fmt.Println("server started on :8080")
	src.StartWorker()

	mux := http.NewServeMux()
	mux.HandleFunc("/download", src.DownloadHandler)
	mux.HandleFunc("/status", src.StatusHandler)
	mux.HandleFunc("/file", src.FileHandler)

	http.ListenAndServe(":8080", cors(mux))

}
