import { nanoid } from "nanoid";

/**
 * Generate a unique short code using NanoID.
 * Default length is 7 characters (URL-safe alphabet).
 */
export function generateShortCode(length = 7) {
  return nanoid(length);
}
