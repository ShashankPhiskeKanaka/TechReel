# 🚀 TechReel Backend

A **high-performance, scalable backend system** for short-form educational video content (reels), built using **Node.js, Express, TypeScript**, and a **microservices-inspired architecture**.  

It supports **video streaming (HLS), gamification, challenges, and skill-based learning paths**, with production-grade infrastructure like **NGINX Gateway, Redis caching, and AWS Lambda processing**.

---

## 🎯 Overview

TechReel is designed as a **content + learning + engagement platform**, where users:

- Watch short educational reels
- Solve coding/MCQ challenges
- Follow structured skill roadmaps
- Earn XP, badges, and maintain streaks
- Interact via likes, views, and engagement metrics

---

## 🧱 Architecture

```
Client (Mobile/Web)
        ↓
NGINX Gateway (Reverse Proxy + LB)
        ↓
Node.js API (PM2 Cluster Mode)
        ↓
┌───────────────┬───────────────┐
│ PostgreSQL     │ Redis         │
│ (Prisma ORM)   │ (Caching/RL)  │
└───────────────┴───────────────┘
        ↓
AWS S3 (Raw Uploads)
        ↓
AWS Lambda (FFmpeg Processing)
        ↓
HLS Output (S3 + CDN)
```

---

## ✨ Core Features

### 🎥 Reels System
- Upload raw video (MP4)
- Automatic conversion to **HLS (480p, 720p, 1080p)**
- CDN-ready streaming (`.m3u8 + .ts`)
- Thumbnail generation

---

### 🧠 Challenges System
- Coding & MCQ challenges per reel
- Multiple options support
- Answer validation & scoring
- Submission tracking

---

### 🛤️ Skill Roadmaps
- Structured learning paths
- Difficulty-based progression
- Step-by-step roadmap execution
- Reel + Challenge mapping per step

---

### 🎮 Gamification
- XP system (ledger-based)
- Badge unlocking
- Streak tracking (daily engagement)
- Progress tracking across roadmap

---

### 📊 Engagement System
- Views tracking (watch time + completion)
- Likes system
- Reel analytics
- Cursor-based pagination for feed

---

### ⚡ Performance & Scalability
- **NGINX Reverse Proxy + Load Balancer**
- **PM2 Cluster Mode (multi-core scaling)**
- **Redis caching + rate limiting**
- **Cursor-based pagination (infinite scroll ready)**

---

### 🔐 Security
- JWT-based authentication
- Rate limiting (NGINX + Redis)
- Internal API protection (API keys)
- Input validation via DTOs

---

## 🛠️ Tech Stack

### Backend
- Node.js (v20+)
- Express.js
- TypeScript

### Database
- PostgreSQL
- Prisma ORM

### Caching & Queue
- Redis

### Media Processing
- AWS S3 (storage)
- AWS Lambda (FFmpeg processing)
- HLS Streaming (adaptive bitrate)

### Infrastructure
- Docker & Docker Compose
- NGINX (API Gateway + Load Balancer)

### Documentation
- Swagger (OpenAPI)

---

## 📁 Project Structure

```
.
├── caching/
├── db/
├── generated/
├── jobs/
├── logs/
├── nginx/
├── prisma/
├── schema/
├── src/
│   ├── config/
│   ├── constants/
│   ├── controller/
│   ├── dto/
│   ├── factory/
│   ├── middleware/
│   ├── repository/
│   ├── router/
│   ├── service/
│   ├── types/
│   └── utils/
│
├── swagger/
├── server.ts
├── Dockerfile
├── docker-compose.yml
├── nginx.conf
├── prisma.config.ts
├── package.json
└── README.md
```

---

## ⚙️ Setup & Installation

### 1. Clone Repository
```bash
git clone <your-repo-url>
cd techreel-backend
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Variables

```env
PORT=3000

DATABASE_URL=postgresql://user:password@localhost:5432/techreel

REDIS_URL=redis://localhost:6379

JWT_SECRET=your_secret

AWS_REGION=your-region
AWS_ACCESS_KEY_ID=your-key
AWS_SECRET_ACCESS_KEY=your-secret

S3_BUCKET_RAW=raw-bucket
S3_BUCKET_HLS=hls-bucket

CLOUDFRONT_DOMAIN=your-cdn-domain

INTERNAL_SECRET=internal-api-key
```

### 4. Run Database Migrations
```bash
npx prisma migrate dev
```

### 5. Start Development Server
```bash
npm run dev
```

### 6. Production Mode
```bash
npm run build
npm run start
```

---

## 🐳 Docker Setup

### Start
```bash
docker-compose up -d
```

### Stop
```bash
docker-compose down
```

---

## 🌐 API Gateway (NGINX)

- Single entry point → http://localhost
- Load balancing
- WebSocket support
- Rate limiting
- Reverse proxy

---

## 🎬 Video Processing Flow

- Upload → S3
- Trigger → Lambda
- Process → FFmpeg (HLS)
- Store → S3
- Serve → CDN
- Update → Backend

---

## 📚 API Docs

```
http://localhost:3000/docs
```

---

## 🔁 Pagination

```ts
orderBy: [
  { createdAt: 'desc' },
  { id: 'desc' }
]
```

```ts
{
  lastId,
  lastCreatedAt
}
```

---

## 📊 Modules

- Users
- Reels
- Challenges
- Submissions
- Roadmaps
- Steps
- Likes
- Views
- Streaks
- Badges

---

## 🧠 Principles

- Controller → Service → Repository
- Stateless APIs
- Redis caching
- Indexed queries
- Modular design

---

## 🔐 Security

- JWT
- Rate limiting
- API keys
- DTO validation
- Audit logs

---

## 📌 Future

- Recommendations
- Real-time updates
- Notifications
- Env configs

---

## 👨‍💻 Author

Shashank Phiske