package src

type DownloadRequest struct {
	URL        string `json:"url"`
	Quality    string `json:"Quality"`
	VideoCodec string `json:"video_codec"`
	Start      string `json:"start"`
	End        string `json:"end"`
	Fallback   bool   `json:"fallback"`
	Format     string `json:"format"`
}

type Job struct {
	ID       string
	Status   string
	Progress float64
	Request  DownloadRequest
	File     string
	Error    string
}
