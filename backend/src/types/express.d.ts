/**
 * @file express.d.ts
 * @description Augment Express Request with Jibble-specific properties.
 */

import { JwtPayload } from '../utils/crypto';

declare global {
  namespace Express {
    interface Request {
      /** Authenticated user's JWT payload (set by auth.middleware) */
      user?: JwtPayload;
      /** Correlation ID from correlation middleware */
      correlationId?: string;
      /** Request ID */
      requestId?: string;
    }
  }
}
