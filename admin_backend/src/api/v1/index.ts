/**
 * @file api/v1/index.ts
 * @description API v1 Router for admin_backend.
 */

import { Router } from 'express';
import { healthRouter } from './health.route';
import { adminRouter } from '../../modules/admin/admin.routes';

export const v1Router = Router();

v1Router.use('/health', healthRouter);
v1Router.use('/admin', adminRouter);
