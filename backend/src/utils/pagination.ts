/**
 * @file pagination.ts
 * @description Offset/cursor pagination helpers used by all list endpoints.
 */

export interface PaginationParams {
  page: number;
  limit: number;
  offset: number;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  hasNext: boolean;
}

export const parsePagination = (
  rawPage?: string | number,
  rawLimit?: string | number,
): PaginationParams => {
  const page = Math.max(1, parseInt(String(rawPage ?? '1'), 10) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(String(rawLimit ?? '20'), 10) || 20));
  return { page, limit, offset: (page - 1) * limit };
};

export const buildMeta = (
  page: number,
  limit: number,
  total: number,
): PaginationMeta => ({
  page,
  limit,
  total,
  hasNext: page * limit < total,
});
