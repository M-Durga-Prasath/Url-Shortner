import { z } from "zod";

export const createLinkSchema = z.object({
  url: z
    .string({ required_error: "URL is required" })
    .trim()
    .min(1, "URL is required")
    .url("Please enter a valid URL (e.g. https://example.com)"),

  alias: z
    .string()
    .trim()
    .max(20, "Alias must be 20 characters or less")
    .regex(
      /^[a-zA-Z0-9_-]*$/,
      "Alias can only contain letters, numbers, hyphens, and underscores"
    )
    .optional()
    .or(z.literal("")),
});
