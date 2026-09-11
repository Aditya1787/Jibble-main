/**
 * @file api/v1/index.ts
 * @description Aggregates all v1 module routes for Mobile App Backend.
 */

import { Router } from 'express';
import { healthRouter } from './health.route';
import { authRouter } from '../../modules/auth/auth.routes';
import { userRouter } from '../../modules/user/user.routes';
import { collegeRouter } from '../../modules/college/college.routes';
import { profileRouter } from '../../modules/profile/profile.routes';
import { postRouter } from '../../modules/post/post.routes';
import { globalRateLimiter } from '../../middlewares/rateLimiter.global';
import { storyRouter } from '../../modules/story/story.routes';
import { circleRouter } from '../../modules/circle/circle.routes';
import { followRouter } from '../../modules/follow/follow.routes';
import { searchRouter } from '../../modules/search/search.routes';
import { notificationRouter } from '../../modules/notification/notification.routes';
import { chatRouter } from '../../modules/chat/chat.routes';

export const v1Router = Router();

// ── Global rate limit on all v1 endpoints ────────────────────────────────────
v1Router.use(globalRateLimiter);

// ── Health ────────────────────────────────────────────────────────────────────
v1Router.use('/health', healthRouter);

// ── Auth ──────────────────────────────────────────────────────────────────────
v1Router.use('/auth', authRouter);

// ── Users ─────────────────────────────────────────────────────────────────────
v1Router.use('/users', userRouter);

// ── Colleges ──────────────────────────────────────────────────────────────────
v1Router.use('/colleges', collegeRouter);

// ── Profiles ──────────────────────────────────────────────────────────────────
v1Router.use('/profiles', profileRouter);

// ── Posts ─────────────────────────────────────────────────────────────────────
v1Router.use('/posts', postRouter);

// ── Stories ───────────────────────────────────────────────────────────────────
v1Router.use('/stories', storyRouter);

// ── Circles ───────────────────────────────────────────────────────────────────
v1Router.use('/circles', circleRouter);

// ── Follow ────────────────────────────────────────────────────────────────────
v1Router.use('/follow', followRouter);

// ── Search ────────────────────────────────────────────────────────────────────
v1Router.use('/search', searchRouter);

// ── Notifications ─────────────────────────────────────────────────────────────
v1Router.use('/notifications', notificationRouter);

// ── Chat ──────────────────────────────────────────────────────────────────────
v1Router.use('/chat', chatRouter);

