/**
 * @file rbac.security.test.ts
 * @description Unit tests for RBAC, Circle Community boundary enforcement, and authorization guards.
 */

jest.mock('../db/index');

import { blockCircleCommunityFromGlobal, authorizeCircleMember, authorizeCircleAdmin } from '../middlewares/circle.guard';
import { query } from '../db/index';

const mockQuery = query as jest.MockedFunction<typeof query>;

describe('RBAC & Circle Security Guards', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('blockCircleCommunityFromGlobal', () => {
    it('allows normal USER account to proceed', async () => {
      const req: any = { user: { sub: 'user-1', account_type: 'USER' } };
      const res: any = {};
      const next = jest.fn();

      await blockCircleCommunityFromGlobal(req, res, next);

      expect(next).toHaveBeenCalledWith();
    });

    it('allows CREATOR account to proceed', async () => {
      const req: any = { user: { sub: 'user-1', account_type: 'CREATOR' } };
      const res: any = {};
      const next = jest.fn();

      await blockCircleCommunityFromGlobal(req, res, next);

      expect(next).toHaveBeenCalledWith();
    });

    it('rejects CIRCLE_COMMUNITY account with 403 FORBIDDEN', async () => {
      const req: any = { user: { sub: 'circle-acc-1', account_type: 'CIRCLE_COMMUNITY' } };
      const res: any = {};
      const next = jest.fn();

      await blockCircleCommunityFromGlobal(req, res, next);

      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({
          statusCode: 403,
          code: 'CIRCLE_COMMUNITY_RESTRICTED',
        }),
      );
    });

    it('fetches account_type from DB if omitted in token and blocks CIRCLE_COMMUNITY', async () => {
      const req: any = { user: { sub: 'circle-acc-1' } };
      const res: any = {};
      const next = jest.fn();

      mockQuery.mockResolvedValueOnce({
        rows: [{ account_type: 'CIRCLE_COMMUNITY' }],
        rowCount: 1,
      } as any);

      await blockCircleCommunityFromGlobal(req, res, next);

      expect(mockQuery).toHaveBeenCalled();
      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({
          statusCode: 403,
          code: 'CIRCLE_COMMUNITY_RESTRICTED',
        }),
      );
    });
  });

  describe('authorizeCircleMember', () => {
    const guard = authorizeCircleMember('circleId');

    it('allows active circle member', async () => {
      const req: any = { user: { sub: 'user-1' }, params: { circleId: 'circle-1' } };
      const res: any = {};
      const next = jest.fn();

      mockQuery.mockResolvedValueOnce({
        rows: [{ role: 'member' }],
        rowCount: 1,
      } as any);

      await guard(req, res, next);

      expect(next).toHaveBeenCalledWith();
      expect(req.circleMemberRole).toBe('member');
    });

    it('rejects non-member with 403 CIRCLE_MEMBERSHIP_REQUIRED', async () => {
      const req: any = { user: { sub: 'user-2' }, params: { circleId: 'circle-1' } };
      const res: any = {};
      const next = jest.fn();

      // circle_members check empty, circles owner check empty
      mockQuery.mockResolvedValueOnce({ rows: [], rowCount: 0 } as any);
      mockQuery.mockResolvedValueOnce({ rows: [{ created_by: 'other-user' }], rowCount: 1 } as any);

      await guard(req, res, next);

      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({
          statusCode: 403,
          code: 'CIRCLE_MEMBERSHIP_REQUIRED',
        }),
      );
    });
  });

  describe('authorizeCircleAdmin', () => {
    const adminGuard = authorizeCircleAdmin('circleId');

    it('allows circle leader / admin', async () => {
      const req: any = { user: { sub: 'admin-1' }, params: { circleId: 'circle-1' } };
      const res: any = {};
      const next = jest.fn();

      mockQuery.mockResolvedValueOnce({
        rows: [{ role: 'admin' }],
        rowCount: 1,
      } as any);

      await adminGuard(req, res, next);

      expect(next).toHaveBeenCalledWith();
    });

    it('rejects regular member from admin operations with 403', async () => {
      const req: any = { user: { sub: 'member-1' }, params: { circleId: 'circle-1' } };
      const res: any = {};
      const next = jest.fn();

      mockQuery.mockResolvedValueOnce({
        rows: [{ role: 'member' }],
        rowCount: 1,
      } as any);
      mockQuery.mockResolvedValueOnce({
        rows: [{ created_by: 'creator-uuid' }],
        rowCount: 1,
      } as any);

      await adminGuard(req, res, next);

      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({
          statusCode: 403,
          code: 'CIRCLE_ADMIN_REQUIRED',
        }),
      );
    });
  });
});
