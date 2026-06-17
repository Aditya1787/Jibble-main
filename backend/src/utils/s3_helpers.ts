/**
 * @file s3_helpers.ts
 * @description S3 object key builders — generate consistent, unique keys for each asset type.
 */

import { generateId } from './id';

export const profileImageKey = (userId: string, ext: string): string =>
  `profiles/${userId}/${generateId()}.${ext}`;

export const postMediaKey = (userId: string, ext: string): string =>
  `posts/${userId}/${generateId()}.${ext}`;

export const storyMediaKey = (userId: string, ext: string): string =>
  `stories/${userId}/${generateId()}.${ext}`;

export const getExtension = (mimetype: string): string => {
  const map: Record<string, string> = {
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'image/webp': 'webp',
    'image/gif': 'gif',
    'video/mp4': 'mp4',
    'video/quicktime': 'mov',
  };
  return map[mimetype] ?? 'bin';
};
