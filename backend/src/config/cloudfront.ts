/**
 * @file cloudfront.ts
 * @description CloudFront URL composition helpers.
 *              Converts S3 object keys into CDN-backed public URLs.
 *              No signed-URL logic here — add it when private distributions
 *              are needed (using @aws-sdk/cloudfront-signer).
 */

import { env } from './env';
import { S3BucketKey } from './s3';

/** Base CloudFront distribution URL (e.g. https://d1234abcd.cloudfront.net) */
const CF_BASE = env.CLOUDFRONT_URL.replace(/\/$/, ''); // strip trailing slash

// ---------------------------------------------------------------------------
// URL builders
// ---------------------------------------------------------------------------

/**
 * Build the public CloudFront URL for an S3 object key.
 *
 * @example
 * getCloudFrontUrl('profile', 'users/abc/avatar.webp')
 * // → 'https://d1234.cloudfront.net/profile/users/abc/avatar.webp'
 *
 * The bucket-name prefix keeps different asset types in separate "virtual
 * folders" inside the same distribution — adjust if your distribution is
 * configured differently (e.g. per-bucket origins).
 */
export const getCloudFrontUrl = (bucket: S3BucketKey, key: string): string => {
  const cleanKey = key.replace(/^\//, '');
  return `${CF_BASE}/${bucket}/${cleanKey}`;
};

/**
 * Build a CloudFront URL when the full path is already known (no bucket prefix).
 */
export const getCloudFrontRawUrl = (path: string): string => {
  const cleanPath = path.replace(/^\//, '');
  return `${CF_BASE}/${cleanPath}`;
};

/**
 * Extract the S3 key from a CloudFront URL (useful when deleting objects).
 * Strips the CF_BASE prefix and the leading bucket-name segment.
 *
 * @example
 * extractS3Key('https://d1234.cloudfront.net/profile/users/abc/avatar.webp')
 * // → 'users/abc/avatar.webp'
 */
export const extractS3Key = (cfUrl: string): string => {
  const withoutBase = cfUrl.replace(CF_BASE, '').replace(/^\//, '');
  const parts = withoutBase.split('/');
  parts.shift(); // remove bucket prefix segment
  return parts.join('/');
};
