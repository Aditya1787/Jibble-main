# Jibble — Entity Relationship Diagram & Database Architecture

## Overview

The Jibble database is a normalized PostgreSQL schema designed for a college-focused social platform. It separates authentication identity from public profile data and uses UUID primary keys throughout for security and distribution compatibility.

---

## ER Diagram

```mermaid
erDiagram
    colleges {
        UUID id PK
        VARCHAR name UK
        VARCHAR short_name
        VARCHAR city
        VARCHAR state
        VARCHAR country
        VARCHAR website
        VARCHAR logo_url
        BOOLEAN is_active
        TIMESTAMPTZ created_at
        TIMESTAMPTZ updated_at
    }

    users {
        UUID id PK
        VARCHAR email UK
        VARCHAR phone UK
        VARCHAR password_hash
        auth_provider provider
        VARCHAR provider_id
        user_status status
        BOOLEAN email_verified
        BOOLEAN phone_verified
        TIMESTAMPTZ last_login_at
        VARCHAR refresh_token
        TIMESTAMPTZ created_at
        TIMESTAMPTZ updated_at
    }

    profiles {
        UUID id PK
        UUID user_id FK UK
        UUID college_id FK
        VARCHAR username UK
        VARCHAR display_name
        TEXT bio
        VARCHAR avatar_url
        VARCHAR cover_url
        gender_type gender
        DATE date_of_birth
        SMALLINT graduation_year
        VARCHAR degree
        VARCHAR department
        BOOLEAN is_private
        BOOLEAN is_verified
        INT followers_count
        INT following_count
        INT posts_count
        TIMESTAMPTZ created_at
        TIMESTAMPTZ updated_at
    }

    follows {
        UUID id PK
        UUID follower_id FK
        UUID following_id FK
        BOOLEAN is_accepted
        TIMESTAMPTZ created_at
    }

    posts {
        UUID id PK
        UUID user_id FK
        UUID college_id FK
        post_type type
        visibility_type visibility
        TEXT caption
        TEXT[] media_urls
        TEXT[] hashtags
        UUID[] mentions
        BOOLEAN is_pinned
        BOOLEAN is_archived
        INT likes_count
        INT comments_count
        BIGINT views_count
        TIMESTAMPTZ created_at
        TIMESTAMPTZ updated_at
    }

    stories {
        UUID id PK
        UUID user_id FK
        story_type type
        VARCHAR media_url
        TEXT text_content
        JSONB text_style
        JSONB stickers
        JSONB music
        SMALLINT duration
        INT views_count
        BOOLEAN is_highlight
        TIMESTAMPTZ expires_at
        TIMESTAMPTZ created_at
    }

    comments {
        UUID id PK
        UUID post_id FK
        UUID user_id FK
        UUID parent_id FK
        TEXT content
        UUID[] mentions
        INT likes_count
        INT replies_count
        BOOLEAN is_pinned
        BOOLEAN is_deleted
        TIMESTAMPTZ created_at
        TIMESTAMPTZ updated_at
    }

    likes {
        UUID id PK
        UUID user_id FK
        likeable_type likeable_type
        UUID likeable_id
        reaction_type reaction
        TIMESTAMPTZ created_at
    }

    messages {
        UUID id PK
        UUID sender_id FK
        UUID recipient_id FK
        message_type type
        TEXT content
        VARCHAR media_url
        UUID shared_post_id FK
        UUID reply_to_id FK
        message_status status
        BOOLEAN is_deleted_by_sender
        BOOLEAN is_deleted_by_recipient
        TIMESTAMPTZ read_at
        TIMESTAMPTZ created_at
    }

    events {
        UUID id PK
        UUID creator_id FK
        UUID college_id FK
        VARCHAR title
        TEXT description
        event_status status
        event_visibility visibility
        VARCHAR location_name
        BOOLEAN is_online
        TIMESTAMPTZ starts_at
        TIMESTAMPTZ ends_at
        INT max_attendees
        INT attendees_count
        TEXT[] tags
        TIMESTAMPTZ created_at
    }

    event_rsvps {
        UUID id PK
        UUID event_id FK
        UUID user_id FK
        rsvp_status status
        TIMESTAMPTZ created_at
    }

    notifications {
        UUID id PK
        UUID recipient_id FK
        UUID actor_id FK
        notification_type type
        VARCHAR entity_type
        UUID entity_id
        VARCHAR title
        TEXT body
        VARCHAR deep_link
        BOOLEAN is_read
        BOOLEAN is_pushed
        JSONB metadata
        TIMESTAMPTZ created_at
    }

    schema_migrations {
        SERIAL id PK
        VARCHAR filename UK
        TIMESTAMPTZ executed_at
    }

    %% Relationships
    users      ||--o{ profiles       : "has one"
    colleges   ||--o{ profiles       : "affiliated with"
    users      ||--o{ follows        : "follower"
    users      ||--o{ follows        : "following"
    users      ||--o{ posts          : "creates"
    colleges   ||--o{ posts          : "tagged in"
    users      ||--o{ stories        : "creates"
    users      ||--o{ comments       : "writes"
    posts      ||--o{ comments       : "has many"
    comments   ||--o{ comments       : "replies to"
    users      ||--o{ likes          : "reacts"
    users      ||--o{ messages       : "sends"
    users      ||--o{ messages       : "receives"
    posts      ||--o{ messages       : "shared via"
    messages   ||--o{ messages       : "replied to"
    users      ||--o{ events         : "creates"
    colleges   ||--o{ events         : "hosts"
    events     ||--o{ event_rsvps    : "has RSVPs"
    users      ||--o{ event_rsvps    : "RSVPs"
    users      ||--o{ notifications  : "receives"
    users      ||--o{ notifications  : "actor"
```

---

## Table Reference

| Table | PK | Key FKs | Purpose |
|-------|-----|---------|---------|
| `colleges` | UUID | — | Lookup table for college/university records |
| `users` | UUID | — | Authentication identity (email, phone, OAuth) |
| `profiles` | UUID | `user_id → users`, `college_id → colleges` | Public display data, 1:1 with users |
| `follows` | UUID | `follower_id → users`, `following_id → users` | Social graph (who follows whom) |
| `posts` | UUID | `user_id → users`, `college_id → colleges` | Core content — text, image, video, poll |
| `stories` | UUID | `user_id → users` | Ephemeral 24-hour content |
| `comments` | UUID | `post_id → posts`, `user_id → users`, `parent_id → comments` | Threaded comments |
| `likes` | UUID | `user_id → users` | Polymorphic reactions (post/comment/story) |
| `messages` | UUID | `sender_id → users`, `recipient_id → users` | Direct messages |
| `events` | UUID | `creator_id → users`, `college_id → colleges` | Campus events |
| `event_rsvps` | UUID | `event_id → events`, `user_id → users` | RSVP records |
| `notifications` | UUID | `recipient_id → users`, `actor_id → users` | Fan-out notification store |
| `schema_migrations` | SERIAL | — | Migration run tracking |

---

## Key Design Decisions

### 1. Auth vs. Profile Separation
`users` stores only authentication data (credentials, OAuth, status, refresh tokens).  
`profiles` stores everything public-facing (username, bio, avatar, college, counts).  
This separation allows auth refactors without touching profile data and vice versa.

### 2. UUID Primary Keys
All entity tables use `gen_random_uuid()` (via `pgcrypto`) instead of sequential integers to:
- Prevent enumeration attacks (no guessable IDs in URLs)
- Support future distributed / sharded architectures
- Enable client-side ID generation for offline-first mobile scenarios

### 3. Polymorphic Likes
The `likes` table uses a `(likeable_type, likeable_id)` pattern (post, comment, story) instead of three separate tables. A `UNIQUE(user_id, likeable_type, likeable_id)` constraint prevents duplicate reactions.

### 4. Denormalized Counters
`likes_count`, `comments_count`, `followers_count`, etc. are stored as denormalized integers and updated via triggers or application logic. This avoids expensive `COUNT(*)` queries on hot read paths (feed, post cards).

### 5. GIN Indexes on Arrays
`hashtags TEXT[]` and `mentions UUID[]` on `posts` and `comments` use PostgreSQL GIN indexes for efficient containment queries (`@>`, `&&`), enabling fast hashtag feed and mention notification fan-out.

### 6. Partial Indexes
- `idx_posts_is_archived` — only indexes non-archived posts (the common read path)
- `idx_stories_active` — only indexes stories that haven't expired
- `idx_comments_active` — only indexes non-soft-deleted comments  

This dramatically reduces index size and write amplification.

### 7. Migration Tracking
The `schema_migrations` table records each executed SQL file by filename. The TypeScript runner reads all `.sql` files, diffs against the tracking table, and runs only pending migrations — each in a transaction with ROLLBACK on error.

### 8. Notification Fan-out
`notifications` uses a single `entity_type / entity_id` polymorphic reference and a `deep_link` column for mobile deep linking. The `is_pushed` flag tracks whether the FCM/APNs push was sent, enabling retry logic without double-pushing.

---

## Enum Types

| Enum | Values |
|------|--------|
| `user_status` | `active`, `inactive`, `banned`, `pending_verification` |
| `auth_provider` | `local`, `google`, `apple` |
| `gender_type` | `male`, `female`, `non_binary`, `prefer_not_to_say` |
| `post_type` | `text`, `image`, `video`, `carousel`, `link`, `poll` |
| `visibility_type` | `public`, `followers`, `college_only`, `private` |
| `story_type` | `image`, `video`, `text`, `boomerang` |
| `reaction_type` | `like`, `love`, `haha`, `wow`, `sad`, `angry` |
| `likeable_type` | `post`, `comment`, `story` |
| `message_type` | `text`, `image`, `video`, `audio`, `file`, `post_share`, `story_reply`, `location` |
| `message_status` | `sent`, `delivered`, `read`, `failed` |
| `event_status` | `draft`, `published`, `cancelled`, `completed` |
| `event_visibility` | `public`, `college_only`, `invite_only` |
| `rsvp_status` | `going`, `maybe`, `not_going` |
| `notification_type` | 15 types covering likes, comments, follows, mentions, events, system |

---

## Migration Sequence

```
001_create_extensions.sql     → pgcrypto, uuid-ossp, schema_migrations
002_create_colleges.sql       → colleges (no FK deps)
003_create_users.sql          → users (no FK deps)
004_create_profiles.sql       → profiles → users, colleges
005_create_follows.sql        → follows → users
006_create_posts.sql          → posts → users, colleges
007_create_stories.sql        → stories → users
008_create_comments.sql       → comments → posts, users (self-ref)
009_create_likes.sql          → likes → users (polymorphic)
010_create_messages.sql       → messages → users, posts (self-ref)
011_create_events.sql         → events + event_rsvps → users, colleges
012_create_notifications.sql  → notifications → users
```

Each migration is independent, idempotent (`CREATE TABLE IF NOT EXISTS`), and tracked by filename in `schema_migrations`.
