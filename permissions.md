# Jibble Permissions & Circle Architecture Master Specification

This document details the complete production architecture for Jibble's 3 account modes, Circle 5-navigation hub, creator publishing destinations, and database/API permission models.

---

## 1. Architectural System Overview

```
                         JIBBLE
                           │
        ┌──────────────────┼──────────────────┐
        │                  │                  │
   Normal User      Content Creator     Circle Community
        │                  │                  │
   ┌────┼────┐        ┌────┼────┐             │
   │    │    │        │    │    │             │
 Home Reels Chat     Home Reels Chat      Circle Dashboard
   │    │    │        │    │    │             │
   └────┼────┘        └────┼────┘             │
        │                  │                  │
      Circle            Circle             Own Circle
        │                  │                  │
        └──────────┬───────┘                  │
                   │                          │
              Circle Shell                   │
                   │                          │
       ┌───────────┼────────────┐             │
       │           │            │             │
     Circle      Events      Anonymous      Groups
      Home                         │            │
       │                           │            │
       ├── Online Members          │        Group Chat
       ├── Circle Feed             │        Group Posts
       ├── Events                  │
       ├── Groups                  │
       └── Announcements           │
```

---

## 2. Three Account Modes & Access Matrix

| Feature / Area | Normal User | Content Creator | Circle Community (Club/Org) |
| :--- | :---: | :---: | :---: |
| **Home Feed (Global)** | ✅ Yes | ✅ Yes | ❌ Blocked (Backend & Frontend) |
| **Reels (Global)** | ✅ Yes | ✅ Yes | ❌ Blocked (Backend & Frontend) |
| **Personal 1-on-1 Chat** | ✅ Yes | ✅ Yes | ❌ Blocked (Backend & Frontend) |
| **Browse / Join Circles** | ✅ Yes | ✅ Yes | ❌ Only Own Circle |
| **Create Circle** | ❌ No | ✅ Yes | ❌ No (Pre-assigned) |
| **Circle Management** | Only if member role allows | ✅ If Circle Admin/Owner | ✅ Yes (Own Circle Only) |
| **Publishing Destination** | Global Feed Only | Global OR Circle | Circle Only |
| **Account Transition** | Can switch to Creator | Can switch to User | Fixed Organization Account |

### User-to-Creator Role Model
Normal User and Content Creator represent the same human identity:
- Single account credential.
- `roles: ['USER']` upgrades to `roles: ['USER', 'CREATOR']`.
- No second account, no logout, no data migration required.

---

## 3. Circle 5-Navigation Hub

When entering a Circle, the UI loads a dedicated Circle Navigation Shell:

```
[ 1. ← Home ] ─── [ 2. Circle Home ] ─── [ 3. Events ] ─── [ 4. Anonymous ] ─── [ 5. Groups ]
```

### Destination Breakdown:
1. **`← Home`**: Return to main Jibble navigation shell.
2. **`Circle Home`**:
   - **Header**: Back button, Circle Name, Avatar, Verification badge, Options.
   - **Signature Online People Arcs**: Radial/curved floating avatars arranged along the corner/edge of the screen, scrollable, with pagination (20–30 loaded) and profile previews on click.
   - **Center Activity Feed**: Stream of Circle Posts, Anonymous Posts, New Events, Group Activity, and Announcements.
3. **`Events`**:
   - Event cards with dates, cover images, descriptions, and participant limits.
   - **JOIN EVENT Button**: Direct external/in-app URL redirection.
   - Event creation wizard for Circle Owners and Admins.
4. **`Anonymous`**:
   - Dedicated identity-protected posting flow.
   - Client displays randomized aliases (e.g. *Anonymous Student*).
   - Backend securely retains `author_id` for moderation and abuse prevention while masking it on public APIs.
5. **`Groups`**:
   - Internal sub-groups/clubs within the circle (e.g. `#Flutter-Devs`, `#Placement-Prep`).
   - Group Chat and circle-exclusive media sharing.

---

## 4. Creator Content Permissions & Visibility Matrix

When publishing a Post or Reel:

### Destination
- **Global Jibble / Main Reels**: Added to global public feed and reels stream (`circle_id = NULL`).
- **Circle Only**: Associated with a verified `circle_id`, appears only inside that specific Circle stream.

### Privacy & Interaction Controls (Global Posts)
- **Visibility**: `PUBLIC`, `FOLLOWERS`, `FRIENDS`, `ONLY_ME`.
- **Comment Permissions**: `EVERYONE`, `FOLLOWERS`, `FRIENDS`, `MENTIONS`, `NO_ONE`.
- **Share Permissions**: `EVERYONE`, `FOLLOWERS`, `FRIENDS`, `NO_ONE`.
- **Like Visibility**: `PUBLIC`, `FRIENDS`, `ONLY_ME`.
- **View Count Visibility**: `PUBLIC`, `FRIENDS`, `ONLY_ME` (Only creator sees exact view stats).

### Circle Content Rule
Circle content avoids confusing custom privacy matrices:
- Identity Visible OR Anonymous.
- Restricted strictly to that Circle's members.

---

## 5. Backend Authorization Architecture

### Middlewares
1. `authenticate`: Validates JWT token and extracts user context.
2. `blockCircleCommunityFromGlobal`: Throws `403 Forbidden` if a `CIRCLE_COMMUNITY` user attempts to request `/api/v1/posts/feed`, `/api/v1/reels`, `/api/v1/chat`, or other consumer endpoints.
3. `authorizeCircleMembership(circleId)`: Ensures user is an active member or creator of the target circle.
4. `authorizeCircleRole(circleId, ['owner', 'admin'])`: Ensures administrative privileges for event creation, group management, and announcements.
5. `sanitizeAnonymousPost`: Masks `author_id` and author details on public responses, revealing them only to Circle Moderators upon abuse reports.
