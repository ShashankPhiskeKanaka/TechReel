# TechReel Backend

An industry-grade, scalable video streaming and social media backend built with **Node.js**, **TypeScript**, and **Microservices architecture**. Features automated video transcoding via AWS Lambda and a high-performance NGINX API Gateway.

## Tech Stack

- **Runtime:** Node.js (v20+) with TypeScript
- **Gateway/LB:** NGINX (Reverse Proxy, Rate Limiting, Sticky Sessions)
- **Database:** PostgreSQL with Prisma ORM
- **Caching:** Redis (Rate Limit Store)
- **Processing:** AWS Lambda & FFmpeg (HLS Adaptive Bitrate Streaming)
- **Containerization:** Docker & Docker Compose

## Key Features

- **NGINX Gateway:** Central entry point for all API requests and WebSockets.
- **Video Transcoding:** Automatic conversion of MP4 to HLS (480p, 720p, 1080p) using FFmpeg.
- **Rate Limiting:** Dual-layer protection (NGINX + Redis-backed Express middleware).
- **Security:** JWT Authentication and strictly typed Prisma models.

---

## Getting Started

### Prerequisites
- [Docker Desktop](https://docker.com)
- Node.js v20+

### 1. Clone the Repository
```bash
git clone https://github.com
cd techreel-backend
```

### 2. Install Dependencies
```bash
npm i
```

### 3. Start local server
```bash
npm run dev
```