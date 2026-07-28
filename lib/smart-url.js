/**
 * Smart URL Generator
 *
 * Detects the platform from a URL and generates device-specific
 * routing data (deep-links, app store URLs, fallbacks).
 */

// ─── Platform Registry ─────────────────────────────────────────────
// Each entry maps hostnames to the platform's app identifiers and
// deep-link scheme. Android uses intent:// URIs with built-in fallback.

const PLATFORM_REGISTRY = [
  {
    platform: "youtube",
    hostnames: ["youtube.com", "www.youtube.com", "m.youtube.com", "youtu.be"],
    android: {
      package: "com.google.android.youtube",
    },
    ios: {
      scheme: "youtube",
      storeId: "id544007664",
    },
  },
  {
    platform: "instagram",
    hostnames: ["instagram.com", "www.instagram.com"],
    android: {
      package: "com.instagram.android",
    },
    ios: {
      scheme: "instagram",
      storeId: "id389801252",
    },
  },
  {
    platform: "twitter",
    hostnames: ["twitter.com", "www.twitter.com", "x.com", "www.x.com"],
    android: {
      package: "com.twitter.android",
    },
    ios: {
      scheme: "twitter",
      storeId: "id333903271",
    },
  },
  {
    platform: "spotify",
    hostnames: ["open.spotify.com"],
    android: {
      package: "com.spotify.music",
    },
    ios: {
      scheme: "spotify",
      storeId: "id324684580",
    },
  },
  {
    platform: "reddit",
    hostnames: ["reddit.com", "www.reddit.com", "old.reddit.com"],
    android: {
      package: "com.reddit.frontpage",
    },
    ios: {
      scheme: "reddit",
      storeId: "id1064216828",
    },
  },
  {
    platform: "tiktok",
    hostnames: ["tiktok.com", "www.tiktok.com", "vm.tiktok.com"],
    android: {
      package: "com.zhiliaoapp.musically",
    },
    ios: {
      scheme: "snssdk1233",
      storeId: "id835599320",
    },
  },
  {
    platform: "linkedin",
    hostnames: ["linkedin.com", "www.linkedin.com"],
    android: {
      package: "com.linkedin.android",
    },
    ios: {
      scheme: "linkedin",
      storeId: "id288429040",
    },
  },
];

// ─── URL Normalization ──────────────────────────────────────────────
// Expand short-form URLs (e.g., youtu.be/abc → youtube.com/watch?v=abc)

function normalizeUrl(urlStr) {
  try {
    const url = new URL(urlStr);
    const hostname = url.hostname.toLowerCase();

    // youtu.be/VIDEO_ID → youtube.com/watch?v=VIDEO_ID
    if (hostname === "youtu.be") {
      const videoId = url.pathname.slice(1); 
      if (videoId) {
        return `https://www.youtube.com/watch?v=${videoId}`;
      }
    }

    return urlStr;
  } catch {
    return urlStr;
  }
}

// ─── Platform Detection ─────────────────────────────────────────────

function detectPlatform(urlStr) {
  try {
    const url = new URL(urlStr);
    const hostname = url.hostname.toLowerCase();

    for (const entry of PLATFORM_REGISTRY) {
      if (entry.hostnames.includes(hostname)) {
        return entry;
      }
    }
  } catch {
  }

  return null;
}

// ─── Intent URI Builder (Android) ───────────────────────────────────
// Android Intent URIs handle the deep-link → fallback chain natively.
// Format: intent://host/path#Intent;scheme=https;package=...;S.browser_fallback_url=...;end

function buildAndroidIntentUri(url, platformEntry) {
  const parsed = new URL(url);
  const storeUrl = `https://play.google.com/store/apps/details?id=${platformEntry.android.package}`;

  return (
    `intent://${parsed.host}${parsed.pathname}${parsed.search}` +
    `#Intent;scheme=https;package=${platformEntry.android.package}` +
    `;S.browser_fallback_url=${encodeURIComponent(storeUrl)};end`
  );
}

// ─── iOS Deep-Link Builder ──────────────────────────────────────────

function buildIosDeepLink(url, platformEntry) {
  const parsed = new URL(url);
  return `${platformEntry.ios.scheme}://${parsed.host}${parsed.pathname}${parsed.search}`;
}

function buildIosStoreUrl(platformEntry) {
  return `https://apps.apple.com/app/${platformEntry.ios.storeId}`;
}

// ─── Main Generator ─────────────────────────────────────────────────

/**
 * Generate smart routes for a given URL.
 *
 * @param {string} originalUrl - The URL to generate smart routes for
 * @returns {object} Smart routing data with platform, android, ios, desktop, and fallback info
 */
export function generateSmartRoutes(originalUrl) {
  // Normalize first (e.g., youtu.be → youtube.com)
  const normalizedUrl = normalizeUrl(originalUrl);
  const platformEntry = detectPlatform(normalizedUrl);

  // Generic link — no smart routing
  if (!platformEntry) {
    return {
      platform: "generic",
      android: null,
      ios: null,
      desktop: { url: normalizedUrl },
      fallback: normalizedUrl,
    };
  }

  return {
    platform: platformEntry.platform,
    android: {
      intentUri: buildAndroidIntentUri(normalizedUrl, platformEntry),
      storeUrl: `https://play.google.com/store/apps/details?id=${platformEntry.android.package}`,
    },
    ios: {
      deepLink: buildIosDeepLink(normalizedUrl, platformEntry),
      storeUrl: buildIosStoreUrl(platformEntry),
    },
    desktop: { url: normalizedUrl },
    fallback: normalizedUrl,
  };
}
