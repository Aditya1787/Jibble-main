/**
 * @file id.ts
 * @description UUID generation helpers.
 */
import { v4 as uuidv4 } from 'uuid';

export const generateId = (): string => uuidv4();
