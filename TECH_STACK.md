# 🛠️ JIBBLE COMMUNITY APP - COMPLETE MASTER TECH STACK

This document provides a comprehensive, end-to-end breakdown of **every technology, framework, language, library, database, and infrastructure tool** powering the Jibble platform—from basic foundational layers to advanced cloud architecture.

---

```
┌─────────────────────────────────────────────────────────────────────────────────────────────┐
│                               JIBBLE MASTER TECH STACK MAP                                  │
├─────────────────────────────────────────────────────────────────────────────────────────────┤
│  MOBILE APP (FRONTEND) │ Flutter 3.x • Dart • Riverpod 2.x • GoRouter • Dio • Flutter Secure  │
├────────────────────────┼────────────────────────────────────────────────────────────────────┤
│  ADMIN PANEL (WEB)     │ React 18 • TypeScript • Vite • Tailwind CSS • Lucide • Recharts    │
├────────────────────────┼────────────────────────────────────────────────────────────────────┤
│  CORE BACKEND API      │ Node.js • Express • TypeScript • Socket.io • BullMQ • JWT          │
├────────────────────────┼────────────────────────────────────────────────────────────────────┤
│  DATABASE & CACHE      │ Neon PostgreSQL (v16) • SQL Migrations • Upstash Redis (TLS)       │
├────────────────────────┼────────────────────────────────────────────────────────────────────┤
│  CLOUD & STORAGE       │ AWS S3 (Media Storage) • Firebase FCM (Push Notifications)        │
├────────────────────────┼────────────────────────────────────────────────────────────────────┤
│  DEVOPS & TOOLS        │ Git • VS Code • PowerShell Scripts • npm Workspaces / Monorepo     │
└─────────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 1. FRONTEND: MOBILE APPLICATION (FLUTTER / DART)

### 🔹 Basic & Core Foundation
- **Dart (v3.x)**: Type-safe, high-performance object-oriented programming language compiled natively to ARM64 binary for Android and iOS.
- **Flutter Framework (v3.x)**: Google’s cross-platform UI toolkit rendering 60 FPS / 120 FPS screens using the Impeller / Skia rendering engines.

### 🔹 Advanced Architecture & Libraries
- **State Management & DI**:
  - `flutter_riverpod (v2.6)`: Reactive, compile-time safe state management for feeds, user sessions, and real-time updates.
  - `get_it (v7.7)` & `injectable (v2.6)`: Service Locator & Dependency Injection container for loose coupling.
- **Routing & Navigation**:
  - `go_router (v13.2)`: Declarative, URL-driven router supporting deep-linking (e.g. tapping a push notification opens a specific post or chat).
- **Networking & Storage**:
  - `dio (v5.9)`: Advanced HTTP client supporting request interceptors, automatic JWT retry refresh tokens, and download/upload progress tracking.
  - `flutter_secure_storage (v10.2)`: Encrypted hardware storage (Android Keystore / iOS Keychain) for storing authentication JWT tokens securely.
  - `shared_preferences`: Lightweight local key-value storage for app settings & user theme preferences.
- **Real-Time Communications**:
  - `socket_io_client (v2.0)`: WebSocket connection client for instant direct messages, live circle channels, and typing indicators.
- **Media & Hardware Access**:
  - `image_picker` / Camera APIs: Accessing native Android/iOS camera hardware for avatar updates, post uploads, and Reels recording.
  - Video Player & Media Cache (`flutter_cache_manager`): Hardware-accelerated video playback and image caching.
- **Push Notifications**:
  - `firebase_messaging (v14.7)` & `flutter_local_notifications (v17.2)`: Receiving foreground and background push notification banners.

---

## 2. FRONTEND: ADMIN PANEL (WEB DASHBOARD)

### 🔹 Basic & Core Foundation
- **HTML5 & Vanilla CSS3**: Semantic markup and modern custom styling tokens.
- **TypeScript**: Strict type definitions for admin API payloads, role objects, and system logs.
- **React (v18)**: Component-based UI library using modern Hooks (`useState`, `useEffect`, `useContext`, `useMemo`).

### 3. Advanced Tooling & Libraries
- **Build Tooling**: `Vite` for sub-second hot module replacement (HMR) and optimized ESBuild production bundling.
- **Styling & UI Components**:
  - `Tailwind CSS`: Utility-first CSS framework for glassmorphism, responsive grid layouts, and dark/light modes.
  - `Lucide React Icons`: Modern SVG vector icons.
- **Analytics & Data Visualization**:
  - `Recharts`: Interactive SVG charts rendering user growth, server CPU/memory graphs, and community activity metrics.
- **State Management**:
  - `Zustand` / Custom Context Store: Global auth state managing Admin JWT tokens and RBAC permissions.

---

## 3. CORE BACKEND SERVER & ADMIN BACKEND

### 🔹 Basic & Core Foundation
- **Node.js (v20+ LTS)**: Asynchronous event-driven JavaScript runtime.
- **Express.js**: Fast, unopinionated web framework for handling RESTful API routes, JSON parsing, and request handling.
- **TypeScript**: Ensures strict interface contracts across controller layers, middleware, and database models.

### 🔹 Advanced Backend Infrastructure
- **Real-Time WebSockets (`Socket.io v4`)**: Bi-directional event-based socket engine powering real-time chat rooms, read receipts, and online status badges.
- **Asynchronous Task Queue (`BullMQ` + `Redis`)**: Background job queue processing heavy asynchronous tasks (e.g. push notification batches, email delivery, media cleanup).
- **Authentication & Security**:
  - `JSON Web Tokens (JWT)`: Stateless session authorization via Signed Bearer Tokens.
  - `Bcrypt / Pgcrypto`: Salted hashing algorithm for encrypting user passwords before DB storage.
  - CORS & Rate-Limiting Middlewares: Protecting backend endpoints from DDoS attacks and unauthorized domain origin requests.

---

## 4. DATABASE, CACHING & STORAGE ARCHITECTURE

### 🔹 Database Engine: Neon PostgreSQL (v16)
- **Serverless PostgreSQL**: Cloud-hosted PostgreSQL with automatic connection pooling and instant branching.
- **Raw SQL & Migration Scripts**: Standardized schema execution scripts (`schema.sql`, `001_admin_panel_schema.sql`) for exact foreign key integrity and performance indexing.
- **Data Features**:
  - `UUID v4` primary keys to prevent ID enumeration attacks.
  - Indexes on `user_id`, `community_id`, `created_at`, and `parent_comment_id` for fast query response times.

### 🔹 In-Memory Cache: Upstash Redis
- **Cloud Managed Redis**: High-speed, in-memory data store operating over TLS.
- **Use Cases**: Socket connection mapping, active user sessions, rate-limit counters, and fast feed caching.

### 🔹 Cloud Media Storage: AWS S3
- **Amazon Simple Storage Service**: Infinite object store configured with custom CORS policies for direct media upload and high-performance CDN delivery of user avatars, post images, and Reels videos.

---

## 5. PUSH NOTIFICATIONS & EXTERNAL SERVICES

- **Firebase Cloud Messaging (FCM V1 API)**: Cross-platform messaging solution sending push notification payloads to Android and iOS devices.
- **Google Play Console & Apple Developer APIs**: Native store delivery pipelines.

---

## 🛠️ TECH STACK SUMMARY TABLE

| Layer | Basic Tech | Advanced Tech / Framework | Purpose |
| :--- | :--- | :--- | :--- |
| **Mobile App** | Dart, HTML/CSS concept | Flutter 3, Riverpod 2, GoRouter, Dio, Socket.io | Cross-platform iOS/Android app |
| **Admin Panel** | React, HTML, CSS | TypeScript, Vite, Tailwind CSS, Recharts | Web moderation dashboard |
| **Core Backend** | Node.js, Express | TypeScript, Socket.io, BullMQ, JWT | REST API & Real-time engine |
| **Database** | PostgreSQL | Neon Postgres (Serverless + Connection Pooling) | Primary relational database |
| **Cache & Queue** | Key-Value Store | Upstash Redis (TLS) | Session cache & Task queue driver |
| **Cloud Storage** | Filesystem | AWS S3 Bucket + IAM User Access Keys | Media file hosting (images/videos) |
| **Notifications** | Push Banners | Firebase Cloud Messaging (FCM V1 API) | Mobile push notification engine |
