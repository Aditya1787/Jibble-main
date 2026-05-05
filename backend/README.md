# Jibble Backend

Node.js + Express + TypeScript + Socket.io backend for the Jibble platform.

## Stack
- **Runtime**: Node.js 20
- **Framework**: Express 4
- **Language**: TypeScript 5
- **Real-time**: Socket.io 4
- **ORM**: Prisma 5
- **Database**: Neon PostgreSQL
- **Cache / Queue broker**: Redis (via BullMQ)
- **Object storage**: AWS S3 + CloudFront CDN
- **Auth**: JWT (access + refresh tokens)

## Getting Started

```bash
npm install
cp .env.example .env   # fill in your values
npm run db:generate    # generate Prisma client
npm run dev            # start dev server
```

## API Base Path
All routes are versioned under `/api/v1/...`
