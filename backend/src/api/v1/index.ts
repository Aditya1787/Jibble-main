/**
 * @file api/v1/index.ts
 * @description Aggregates all v1 module routes under /api/v1.
 *              Add new module routers here as the project grows.
 */

import { Router } from 'express';
import { healthRouter } from './health.route';

export const v1Router = Router();

// ── Health ────────────────────────────────────────────────────────────────
v1Router.use('/health', healthRouter);

// ── Future module routes (Day 3+) ─────────────────────────────────────────
// v1Router.use('/auth',     authRouter);
// v1Router.use('/users',    userRouter);
// v1Router.use('/posts',    postRouter);
// v1Router.use('/stories',  storyRouter);
// v1Router.use('/messages', messageRouter);
// v1Router.use('/search',   searchRouter);
// v1Router.use('/admin',    adminRouter);
