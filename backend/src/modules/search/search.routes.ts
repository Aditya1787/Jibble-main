/**
 * @file search.routes.ts
 * @description Search routes under /api/v1/search
 */

import { Router } from 'express';
import { searchController } from './search.controller';
import { authMiddleware } from '../../middlewares/auth.middleware';

const router = Router();

// Search is available to authenticated users
router.use(authMiddleware);

// GET /api/v1/search?q=...&type=all|users|circles|events|groups&limit=15
router.get('/', searchController.search);

export { router as searchRouter };
