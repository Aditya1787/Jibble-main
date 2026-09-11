/**
 * @file chat.routes.ts
 * @description Direct chat routes under /api/v1/chat
 */

import { Router } from 'express';
import { chatController } from './chat.controller';
import { authMiddleware } from '../../middlewares/auth.middleware';
import { blockCircleCommunityFromGlobal } from '../../middlewares/circle.guard';

const router = Router();

router.use(authMiddleware);
// Circle community accounts are quarantined to their circle only; block from global 1:1 chat
router.use(blockCircleCommunityFromGlobal);

// GET /api/v1/chat/conversations
router.get('/conversations', chatController.getConversations);

// GET /api/v1/chat/messages/:recipientId
router.get('/messages/:recipientId', chatController.getMessages);

// POST /api/v1/chat/messages
router.post('/messages', chatController.sendMessage);

export { router as chatRouter };
