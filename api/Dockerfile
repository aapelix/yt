FROM golang:latest AS builder
WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download
COPY . .
RUN go build -o yt-api .

FROM debian:bullseye-slim
WORKDIR /root/
COPY --from=builder /app/yt-api .
RUN apt-get update && apt-get install -y ca-certificates && rm -rf /var/lib/apt/lists/*
EXPOSE 8080
CMD ["./yt-api"]
