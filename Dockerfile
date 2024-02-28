FROM golang:1.20 as builder

WORKDIR /app

COPY . .

RUN go mod tidy
RUN go build -o lokisend

# 実行環境
FROM alpine:latest  
RUN apk --no-cache add ca-certificates

WORKDIR /root/

COPY --from=builder /app/lokisend .

ENTRYPOINT ["./lokisend"]