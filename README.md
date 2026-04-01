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
Node.js API
        ↓
┌───────────────┬───────────────┐
│ PostgreSQL    │ Redis         │
│ (Prisma ORM)  │ (Caching/RL)  │
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
- Reporting reels
- Reel analytics
- Cursor-based pagination for feed

---

### ⚡ Performance & Scalability
- **NGINX Reverse Proxy + Load Balancer**
- **Redis caching + rate limiting**
- **Cursor-based pagination (infinite scroll ready)**
- **BullMQ for asynchronous task processing**
- **Idempotent Api's**

---

### 🔐 Security
- JWT-based authentication (Access token and Refresh tokens)
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
/Tech_Reels/
├── caching/           # Cache configurations and store connection logic (e.g., Redis)
├── db/                # Database initialization
├── generated/         # Auto-generated code (e.g., Prisma client, types)
├── jobs/              # Background workers, task queues
├── logs/              # Application logs for debugging and monitoring
├── nginx/             # Nginx specific configuration files for deployment
├── prisma/            # Database schema definitions and seeding scripts
├── schema/            # Request/Response validation schemas (e.g., Zod or Joi)
├── src/               # Application source code
│   ├── config/        # Environment variable management and app configuration
│   ├── constants/     # Reusable hardcoded strings and status codes
│   ├── controller/    # Entry points: handles requests and returns responses
│   ├── dto/           # Data Transfer Objects for input/output formatting
│   ├── factory/       # Design pattern implementations for object creation
│   ├── middleware/    # Request interceptors (Auth, Logging, Error handling)
│   ├── repository/    # Direct database abstraction (Data Access Layer)
│   ├── router/        # Route definitions and endpoint mapping
│   ├── service/       # Business logic layer (orchestrates repositories)
│   ├── types/         # TypeScript interfaces and type definitions
│   └── utils/         # Generic helper functions and utility classes
├── swagger/           # OpenAPI/Swagger documentation assets
├── server.ts          # Application entry point and server initialization
├── Dockerfile         # Containerization instructions for the app
├── docker-compose.yml # Multi-container orchestration (App, DB, Redis)
├── nginx.conf         # Load balancer and reverse proxy configuration
├── prisma.config.ts   # Prisma ORM configuration
├── package.json       # Project dependencies and scripts
└── README.md          # Project documentation and setup guide

```

---

## 📦 Prerequisites
- Node.js >= 18.x
- npm or yarn
- Docker and Docker Compose (for containerized setup)
- PostgreSQL 16+ (or use Docker)
- Redis (or use Docker)

---

## ⚙️ Setup & Installation

### 1. Clone Repository
```bash
git clone https://github.com/ShashankPhiskeKanaka/TechReel.git
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

AWS_REGION=eu-north-1
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

### 7. Seed database
To seed an admin user:
```bash
npx prisma db seed
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
http://localhost:3000/api-docs
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
- User Badges
- User Profiles
- User Roadmap Steps
- User Skills
- User Token Balance
- Reels
- Reel Likes
- Reel Views
- Reel Reports
- Reel Saves
- Challenges
- Challenge Options
- Challenge Submissions
- Notification
- Refresh Token
- Roadmaps
- Roadmap Steps
- Tags
- Token Ledger
- Xp Ledger
- Audit Logs
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
- HMAC validation for media webhooks

---

## 📌 Future

- Recommendations
- Real-time updates
- Notifications
- Env configs

---

## 👨‍💻 Author

Shashank Phiske