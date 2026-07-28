import prisma from "@/lib/db";
import { NextResponse } from "next/server";

// Reserved paths that should NOT be treated as short codes
const RESERVED_PATHS = new Set([
  "dashboard",
  "api",
  "auth",
  "login",
  "signup",
  "settings",
  "admin",
  "_next",
  "favicon.ico",
]);

/**
 * Detect if the User-Agent is a mobile device.
 * Returns "android", "ios", or "desktop".
 */
function detectDevice(userAgent) {
  if (!userAgent) return "desktop";
  const ua = userAgent.toLowerCase();

  if (/android/i.test(ua)) return "android";
  if (/iphone|ipad|ipod/i.test(ua)) return "ios";
  return "desktop";
}

/**
 * Build the intermediary HTML redirect page for iOS devices.
 * Uses visibility-change detection to avoid the double-open problem.
 */
function buildIosRedirectPage(smartRoutes, originalUrl) {
  const { ios, fallback } = smartRoutes;
  const deepLink = ios?.deepLink || fallback;
  const storeUrl = ios?.storeUrl || fallback;
  const fallbackUrl = fallback || originalUrl;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Redirecting...</title>

  <!-- OG Meta Tags for social previews -->
  <meta property="og:title" content="Opening link..." />
  <meta property="og:description" content="You are being redirected to ${new URL(fallbackUrl).hostname}" />
  <meta property="og:url" content="${fallbackUrl}" />
  <meta property="og:type" content="website" />

  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #0a0a0f;
      color: #e0e0e8;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }
    .container {
      text-align: center;
      padding: 2rem;
    }
    .spinner {
      width: 40px;
      height: 40px;
      border: 3px solid rgba(139, 92, 246, 0.2);
      border-top-color: #8b5cf6;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
      margin: 0 auto 1.5rem;
    }
    @keyframes spin { to { transform: rotate(360deg); } }
    h1 { font-size: 1.25rem; font-weight: 600; margin-bottom: 0.5rem; }
    p { font-size: 0.875rem; color: #9ca3af; }
    .fallback-link {
      display: inline-block;
      margin-top: 1.5rem;
      padding: 0.75rem 1.5rem;
      background: #8b5cf6;
      color: white;
      text-decoration: none;
      border-radius: 0.5rem;
      font-weight: 500;
      font-size: 0.875rem;
    }
    .fallback-link:hover { background: #7c3aed; }
  </style>
</head>
<body>
  <div class="container">
    <div class="spinner"></div>
    <h1>Opening in app...</h1>
    <p>If nothing happens, <a href="${fallbackUrl}" class="fallback-link">open in browser</a></p>
  </div>

  <script>
    (function() {
      var deepLink = ${JSON.stringify(deepLink)};
      var storeUrl = ${JSON.stringify(storeUrl)};
      var fallbackUrl = ${JSON.stringify(fallbackUrl)};

      var appOpened = false;
      var storeTimer = null;
      var fallbackTimer = null;

      // If the page becomes hidden, the app opened — cancel all timers
      function onVisibilityChange() {
        if (document.hidden || document.webkitHidden) {
          appOpened = true;
          clearTimeout(storeTimer);
          clearTimeout(fallbackTimer);
        }
      }

      document.addEventListener('visibilitychange', onVisibilityChange);
      document.addEventListener('webkitvisibilitychange', onVisibilityChange);
      window.addEventListener('pagehide', function() {
        appOpened = true;
        clearTimeout(storeTimer);
        clearTimeout(fallbackTimer);
      });
      window.addEventListener('blur', function() {
        // Short delay — blur can fire for other reasons
        setTimeout(function() {
          if (document.hidden) {
            appOpened = true;
            clearTimeout(storeTimer);
            clearTimeout(fallbackTimer);
          }
        }, 100);
      });

      // Step 1: Try deep-link
      window.location.href = deepLink;

      // Step 2: After 1.5s, try app store
      storeTimer = setTimeout(function() {
        if (!appOpened) {
          window.location.href = storeUrl;
        }
      }, 1500);

      // Step 3: After 4s, ultimate fallback to browser URL
      fallbackTimer = setTimeout(function() {
        if (!appOpened) {
          window.location.href = fallbackUrl;
        }
      }, 4000);
    })();
  </script>
</body>
</html>`;
}

export async function GET(req, { params }) {
  try {
    const { shortCode } = await params;

    // Don't intercept reserved paths
    if (RESERVED_PATHS.has(shortCode.toLowerCase())) {
      return NextResponse.json(
        { error: "Not found" },
        { status: 404 }
      );
    }

    // Look up the link
    const link = await prisma.link.findUnique({
      where: { shortCode },
      select: {
        originalUrl: true,
        smartRoutes: true,
        isActive: true,
      },
    });

    if (!link) {
      return NextResponse.json(
        { error: "Link not found" },
        { status: 404 }
      );
    }

    if (!link.isActive) {
      return NextResponse.json(
        { error: "This link has been deactivated" },
        { status: 410 }
      );
    }

    prisma.link.update({
      where: { shortCode },
      data: { clicks: { increment: 1 } },
    }).catch((err) => console.error("Failed to increment clicks:", err));

    const smartRoutes = link.smartRoutes || {};
    const userAgent = req.headers.get("user-agent") || "";
    const device = detectDevice(userAgent);

    if (smartRoutes.platform === "generic" || !smartRoutes.platform) {
      return NextResponse.redirect(
        smartRoutes.fallback || link.originalUrl,
        302
      );
    }

    if (device === "desktop") {
      return NextResponse.redirect(
        smartRoutes.desktop?.url || smartRoutes.fallback || link.originalUrl,
        302
      );
    }

    if (device === "android" && smartRoutes.android?.intentUri) {
      return NextResponse.redirect(smartRoutes.android.intentUri, 302);
    }

    if (device === "ios" && smartRoutes.ios) {
      const html = buildIosRedirectPage(smartRoutes, link.originalUrl);
      return new Response(html, {
        status: 200,
        headers: {
          "Content-Type": "text/html; charset=utf-8",
          "Cache-Control": "no-cache, no-store, must-revalidate",
        },
      });
    }

    return NextResponse.redirect(
      smartRoutes.fallback || link.originalUrl,
      302
    );
  } catch (error) {
    console.error("Redirect error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
