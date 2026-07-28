import { nanoid } from "nanoid";

/**
 * Generate a unique short code using NanoID.
 * Default length is 9 characters (URL-safe alphabet).
 */
export function generateShortCode(length = 9) {
  return nanoid(length);
}
