/**
 * @file college.routes.ts
 * @description Routes under /api/v1/colleges
 */

import { Router } from 'express';
import { collegeController } from './college.controller';
import { validate } from '../../middlewares/validate.middleware';
import { searchCollegesSchema, collegeIdParamSchema } from './college.validation';

const router = Router();

// GET /api/v1/colleges?q=...&country=...&page=1&limit=20
router.get('/', validate(searchCollegesSchema, 'query'), collegeController.search);

// GET /api/v1/colleges/:id
router.get('/:id', validate(collegeIdParamSchema, 'params'), collegeController.getById);

export { router as collegeRouter };
