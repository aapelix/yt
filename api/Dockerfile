FROM golang:latest AS builder
WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download
COPY . .
RUN CGO_ENABLED=0 GOOS=linux go build -o yt-api .

FROM python:3.12-slim
WORKDIR /root/

COPY --from=builder /app/yt-api .

RUN apt-get update && apt-get install -y ca-certificates curl \
    && pip install --no-cache-dir yt-dlp \
    && rm -rf /var/lib/apt/lists/*

EXPOSE 8080
CMD ["./yt-api"]
