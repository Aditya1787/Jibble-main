/**
 * @file circle.routes.ts
 * @description Express router definition for Circle endpoints under /api/v1/circles.
 */

import { Router } from 'express';
import { circleController } from './circle.controller';
import { authMiddleware } from '../../middlewares/auth.middleware';
import { validate } from '../../middlewares/validate.middleware';
import {
  createCircleSchema,
  circleIdParamSchema,
  componentKeyParamSchema,
  updateComponentSchema,
  rejectCircleSchema,
} from './circle.validation';

const router = Router();

// All circle routes require authentication
router.use(authMiddleware);

// GET /api/v1/circles/user/config (Must be registered before /:id)
router.get('/user/config', circleController.getUserCircleConfig);

// GET /api/v1/circles/templates/all
router.get('/templates/all', circleController.getComponentTemplates);

// Admin review endpoints
router.get('/admin/pending', circleController.getPendingCircles);
router.post(
  '/:id/approve',
  validate(circleIdParamSchema, 'params'),
  circleController.approveCircle
);
router.post(
  '/:id/reject',
  validate(circleIdParamSchema, 'params'),
  validate(rejectCircleSchema),
  circleController.rejectCircle
);

// Community creation request
router.post('/', validate(createCircleSchema), circleController.requestCircle);

// Community detail & membership
router.get('/:id', validate(circleIdParamSchema, 'params'), circleController.getCircleById);
router.post('/:id/join', validate(circleIdParamSchema, 'params'), circleController.joinCircle);
router.delete('/:id/leave', validate(circleIdParamSchema, 'params'), circleController.leaveCircle);

// Circle 5-Nav Experience Endpoints
router.get('/:id/home', validate(circleIdParamSchema, 'params'), circleController.getCircleHome);
router.post('/:id/events', validate(circleIdParamSchema, 'params'), circleController.createCircleEvent);
router.post('/:id/anonymous', validate(circleIdParamSchema, 'params'), circleController.createAnonymousPost);
router.post('/:id/groups', validate(circleIdParamSchema, 'params'), circleController.createCircleGroup);
router.get('/:id/groups/:groupId/messages', circleController.getGroupMessages);
router.post('/:id/groups/:groupId/messages', circleController.sendGroupMessage);

// Component toggles & configuration
router.get('/:id/components', validate(circleIdParamSchema, 'params'), circleController.getCircleComponents);
router.patch(
  '/:id/components/:key',
  validate(componentKeyParamSchema, 'params'),
  validate(updateComponentSchema),
  circleController.toggleComponent
);

export { router as circleRouter };
