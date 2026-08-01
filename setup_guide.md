# Jibble - Setup & Infrastructure Configuration Guide

This guide outlines all the configuration steps, environment variables, cloud console setups, and architectural requirements to successfully deploy and run the Jibble platform (Backend, Frontend, and Cloud Infrastructure) as of the current development phase.

---

## 1. Database Setup (Neon PostgreSQL)

Jibble uses raw SQL queries with PostgreSQL for maximum performance. Follow these steps to set up your Neon database cluster:

### Neon Console Instructions
1. **Create Project**: Sign in to [Neon.tech](https://neon.tech/) and create a new project. Choose the database region closest to your servers/users.
2. **Retrieve Connection String**:
   - In the project dashboard, locate your connection string.
   - It will look like this: `postgresql://[USER]:[PASSWORD]@[HOST]/[DATABASE]?sslmode=require`.
   - Keep this secure; this is your primary database link.
3. **Initialize the Schema**:
   - Open the **SQL Editor** tab in the Neon console.
   - Run your DDL scripts (profiles, posts, comments, likes) to initialize the tables.
   - Example table metrics: ensure `profiles` table has `posts_count` and `comments_count` trackers, and `posts` has `likes_count` and `comments_count`.

---

## 2. AWS S3 & CloudFront Setup

AWS handles raw media storage and content distribution (CDN) with low latency.

### A. AWS S3 Bucket Setup
1. **Create Bucket**:
   - Open the **S3 Console** and click **Create bucket**.
   - Pick a unique bucket name (e.g., `jibble-media-bucket`).
2. **Block Public Access**:
   - Uncheck **Block all public access** if you plan to serve files directly via S3 (or keep it checked if you are routing strictly through CloudFront with OAI/OAC, which is the recommended premium architecture).
3. **CORS Policy Configuration**:
   - In the **Permissions** tab of the bucket, scroll to **Cross-origin resource sharing (CORS)**.
   - Add the following CORS configuration to allow media uploads from the mobile app and admin panels:
     ```json
     [
       {
         "AllowedHeaders": ["*"],
         "AllowedMethods": ["GET", "PUT", "POST", "DELETE", "HEAD"],
         "AllowedOrigins": ["*"],
         "ExposeHeaders": ["ETag"]
       }
     ]
     ```

### B. AWS CloudFront CDN Setup
1. **Create Distribution**:
   - In the **CloudFront Console**, click **Create distribution**.
   - Select your S3 bucket as the **Origin domain**.
2. **Configure Origin Access (OAC)**:
   - Use **Origin access control settings (recommended)** to make sure the S3 bucket is *only* accessible through CloudFront.
   - Click **Create control setting** and let CloudFront update your S3 bucket policy automatically.
3. **Cache Policy**:
   - Set **Minimum TTL** to `0`, **Default TTL** to `86400` (1 day), and **Maximum TTL** to `31536000` (1 year).
   - Select the cache policy `CachingOptimized`.
4. **Deploy**:
   - Copy your **Distribution domain name** (e.g., `https://dxxxxxxxxxx.cloudfront.net`). This will serve as your static media domain.

---

## 3. Redis & BullMQ Setup

BullMQ handles background queues (notifications, media processing, feed fan-out).

### Setup Instructions (Upstash or Railway Redis)
1. **Provision Instance**:
   - Deploy a Redis instance via Upstash (serverless Redis) or directly add a Redis plugin service inside your **Railway** project.
2. **Retrieve Redis URL**:
   - Your Redis link must support TLS/SSL.
   - String format: `rediss://:[PASSWORD]@[HOST]:[PORT]`. (Note: use `redis://` if TLS is disabled in local dev).

---

## 4. Railway Deployment (Backend Hosting)

Railway is used for rapid backend server deployment with native Docker support.

### Railway Console Instructions
1. **Create Project**: Link your GitHub repository containing the Jibble codebase to Railway.
2. **Define Environment Variables**:
   - Go to your service's **Variables** tab and inject the production variables list (detailed in Section 5).
3. **Set Up Health Checks**:
   - In **Settings**, add a health check path pointing to `/health` or `/api/v1/health` to allow zero-downtime rolling deploys.
4. **Expose Domain**:
   - Under **Environment Settings**, click **Generate Domain** to get a public endpoint URL (e.g., `https://jibble-backend.up.railway.app`).

---

## 5. Environment Variables Reference (`.env`)

Create/inject these configurations in your backend production environment:

| Variable Name | Description | Example / Recommendation |
| :--- | :--- | :--- |
| `NODE_ENV` | Mode of runtime | `production` / `development` |
| `PORT` | Backend server port | `8080` |
| `DATABASE_URL` | Neon PG connection URI | `postgresql://user:pass@neon-host/db?sslmode=require` |
| `REDIS_URL` | Redis URL for BullMQ queues | `rediss://:password@redis-host:6379` |
| `JWT_ACCESS_SECRET` | Secret key for access tokens | A secure, random 64-character hex string |
| `JWT_REFRESH_SECRET` | Secret key for refresh tokens | A secure, random 64-character hex string |
| `AWS_ACCESS_KEY_ID` | Access key for AWS S3 upload permissions | `AKIAIOSFODNN7EXAMPLE` |
| `AWS_SECRET_ACCESS_KEY` | Secret access key for S3 | `wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY` |
| `AWS_REGION` | AWS Data center region | `us-east-1` |
| `AWS_S3_BUCKET` | Destination S3 Bucket Name | `jibble-media-bucket` |
| `CLOUDFRONT_URL` | CloudFront Distribution domain | `https://d111111abcdef8.cloudfront.net` |

---

## 6. Socket.io Configuration

Socket.io handles instant updates for chats, real-time likes, notifications, and stories.

- **CORS Configuration**: The backend Socket server must explicitly permit origins. Ensure `cors` options inside your server initializer allow access from wildcard or your deployment URL.
- **Port Matching**: Ensure the Socket listener runs on the same port or gets successfully forwarded by Railway's reverse proxy (supporting WebSocket upgrades).
- **Client Base Path**: If deployed behind paths, specify the route namespaces correctly.

---

## 7. CI/CD Pipeline (GitHub Actions)

Create a workflow in `.github/workflows/deploy.yml` to automate tests and deployments.

```yaml
name: Deploy Backend

on:
  push:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: 18
      - name: Install Dependencies
        run: npm ci
        working-directory: ./backend
      - name: Run Tests
        run: npm test
        working-directory: ./backend

  deploy:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - name: Trigger Railway Deploy
        run: curl -X POST "${{ secrets.RAILWAY_DEPLOY_WEBHOOK }}"
```

---

## 8. Mobile Client Setup (Flutter)

To run the client successfully on a physical device, update the server endpoint configuration:

1. **Locate Client Configuration**:
   - Open [api_client.dart](file:///d:/Jibble/apps/mobile_app/lib/core/network/api_client.dart).
2. **Update Base URL**:
   - Replace the emulator loopback `http://10.0.2.2:8080/api/v1` with your computer's local network IP (e.g. `http://192.168.1.50:8080/api/v1`) or the deployed Railway backend URL (`https://jibble-backend.up.railway.app/api/v1`).
