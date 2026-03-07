FROM golang:latest AS builder
WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download
COPY . .

RUN CGO_ENABLED=0 GOOS=linux go build -o yt-api .

FROM alpine:latest
WORKDIR /root/
COPY --from=builder /app/yt-api .
RUN apk --no-cache add ca-certificates python3 py3-pip \
    && pip install --no-cache-dir yt-dlp

EXPOSE 8080
CMD ["./yt-api"]
