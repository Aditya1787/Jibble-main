/**
 * @file validate.middleware.ts
 * @description Zod-based request validation middleware factory.
 *              Usage: router.post('/signup', validate(signupSchema), authController.signup)
 */

import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';
import { AppError } from './error.middleware';

type RequestPart = 'body' | 'params' | 'query';

export const validate =
  (schema: ZodSchema, part: RequestPart = 'body') =>
  (req: Request, _res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req[part]);

    if (!result.success) {
      const err = result.error as ZodError;
      const details = err.errors.map((e) => ({
        path: e.path.join('.'),
        message: e.message,
      }));
      return next(
        new AppError(
          `Validation failed: ${details.map((d) => d.message).join(', ')}`,
          422,
          'VALIDATION_ERROR',
        ),
      );
    }

    // Overwrite with parsed (coerced) values
    (req as unknown as Record<string, unknown>)[part] = result.data;
    next();
  };
