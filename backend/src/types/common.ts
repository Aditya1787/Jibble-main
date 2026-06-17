/**
 * @file common.ts
 * @description Generic shared types used across the backend.
 */

export interface ServiceResult<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface DbRow {
  id: string;
  created_at: string;
  updated_at: string;
}

export interface ListResult<T> {
  items: T[];
  total: number;
}
