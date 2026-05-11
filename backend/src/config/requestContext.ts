/**
 * @file requestContext.ts
 * @description AsyncLocalStorage-based request context.
 *              Stores per-request data (correlationId, userId, etc.) without
 *              passing it through every function call.
 */

import { AsyncLocalStorage } from 'async_hooks';

// ---------------------------------------------------------------------------
// Context shape
// ---------------------------------------------------------------------------
export interface RequestContext {
  /** UUID v4 assigned by the correlation middleware */
  correlationId: string;
  /** Authenticated user ID (populated by auth middleware, null if guest) */
  userId: string | null;
  /** ISO timestamp of when the request arrived */
  startedAt: string;
  /** HTTP method (GET, POST …) */
  method: string;
  /** Request path (/api/v1/…) */
  path: string;
}

// ---------------------------------------------------------------------------
// Store
// ---------------------------------------------------------------------------
const _store = new AsyncLocalStorage<RequestContext>();

/**
 * Run `callback` within a new request context.
 * Called once per request in the correlation middleware.
 */
export const runWithContext = <T>(
  context: RequestContext,
  callback: () => T,
): T => _store.run(context, callback);

/**
 * Retrieve the active request context.
 * Returns `undefined` when called outside of a request (e.g. background job).
 */
export const getRequestContext = (): RequestContext | undefined =>
  _store.getStore();

/**
 * Helper — returns the current correlationId or 'N/A' if unavailable.
 */
export const getCorrelationId = (): string =>
  _store.getStore()?.correlationId ?? 'N/A';
