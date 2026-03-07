FROM golang:latest AS builder
WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download
COPY . .

# Build the Go binary statically
RUN CGO_ENABLED=0 GOOS=linux go build -o yt-api .

FROM alpine:latest
WORKDIR /root/

# Copy Go binary
COPY --from=builder /app/yt-api .

# Install ca-certificates and curl, then download yt-dlp binary
RUN apk --no-cache add ca-certificates curl \
    && curl -L https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp -o /usr/local/bin/yt-dlp \
    && chmod +x /usr/local/bin/yt-dlp

EXPOSE 8080
CMD ["./yt-api"]
