# Search Strategy

## Phase 1 — Postgres Full-Text Search (FTS)
Use `tsvector` columns with GIN indexes on `users.username`, `users.display_name`, `posts.content`, `groups.name`, `events.title`.

## Phase 2 — External Search (Elasticsearch / Typesense)
Swap `search.repository.ts` implementation to call external engine while keeping the same interface contract.

## Index Design
- `idx_users_fts` — GIN on to_tsvector('english', username || ' ' || display_name)
- `idx_posts_fts` — GIN on to_tsvector('english', content)
- `idx_groups_fts` — GIN on to_tsvector('english', name || ' ' || description)
- `idx_events_fts` — GIN on to_tsvector('english', title || ' ' || description)
