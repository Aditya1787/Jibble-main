/**
 * @file s3.ts
 * @description AWS S3 client singleton with helper utilities for:
 *              - generating pre-signed PUT URLs (uploads)
 *              - generating pre-signed GET URLs (private downloads)
 *              - deleting objects
 *              - composing public-facing CloudFront URLs
 */

import {
  S3Client,
  DeleteObjectCommand,
  HeadObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { env } from './env';
import { logger } from './logger';

// ---------------------------------------------------------------------------
// Singleton client
// ---------------------------------------------------------------------------
export const s3Client = new S3Client({
  region: env.AWS_REGION,
  credentials: {
    accessKeyId: env.AWS_ACCESS_KEY_ID,
    secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
  },
});

// ---------------------------------------------------------------------------
// Bucket map (convenience)
// ---------------------------------------------------------------------------
export const S3Buckets = {
  profile: env.S3_BUCKET_PROFILE,
  posts:   env.S3_BUCKET_POSTS,
  stories: env.S3_BUCKET_STORIES,
} as const;

export type S3BucketKey = keyof typeof S3Buckets;

// ---------------------------------------------------------------------------
// Pre-signed upload URL
// ---------------------------------------------------------------------------
export interface PresignedUploadOptions {
  bucket: S3BucketKey;
  key: string;
  contentType: string;
  /** Expiry in seconds — default 300 (5 min) */
  expiresIn?: number;
}

/**
 * Returns a pre-signed PUT URL the client can use to upload directly to S3.
 */
export const getPresignedUploadUrl = async ({
  bucket,
  key,
  contentType,
  expiresIn = 300,
}: PresignedUploadOptions): Promise<string> => {
  const command = new PutObjectCommand({
    Bucket: S3Buckets[bucket],
    Key: key,
    ContentType: contentType,
  });

  const url = await getSignedUrl(s3Client, command, { expiresIn });
  logger.debug('Generated pre-signed upload URL', { bucket, key, expiresIn });
  return url;
};

// ---------------------------------------------------------------------------
// Pre-signed download URL
// ---------------------------------------------------------------------------
export interface PresignedDownloadOptions {
  bucket: S3BucketKey;
  key: string;
  /** Expiry in seconds — default 3600 (1 hour) */
  expiresIn?: number;
}

/**
 * Returns a pre-signed GET URL for private object access.
 */
export const getPresignedDownloadUrl = async ({
  bucket,
  key,
  expiresIn = 3600,
}: PresignedDownloadOptions): Promise<string> => {
  const command = new GetObjectCommand({
    Bucket: S3Buckets[bucket],
    Key: key,
  });

  return getSignedUrl(s3Client, command, { expiresIn });
};

// ---------------------------------------------------------------------------
// Delete object
// ---------------------------------------------------------------------------
export const deleteS3Object = async (
  bucket: S3BucketKey,
  key: string,
): Promise<void> => {
  await s3Client.send(
    new DeleteObjectCommand({ Bucket: S3Buckets[bucket], Key: key }),
  );
  logger.debug('Deleted S3 object', { bucket, key });
};

// ---------------------------------------------------------------------------
// Object existence check
// ---------------------------------------------------------------------------
export const s3ObjectExists = async (
  bucket: S3BucketKey,
  key: string,
): Promise<boolean> => {
  try {
    await s3Client.send(
      new HeadObjectCommand({ Bucket: S3Buckets[bucket], Key: key }),
    );
    return true;
  } catch {
    return false;
  }
};
