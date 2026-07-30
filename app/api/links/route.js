import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import prisma from "@/lib/db";
import { createLinkSchema } from "@/lib/validation";
import { generateShortCode } from "@/lib/shortcode";
import { generateSmartRoutes } from "@/lib/smart-url";

const RESERVED_ALIASES = new Set([
  "dashboard",
  "api",
  "auth",
  "login",
  "signup",
  "settings",
  "admin",
  "_next",
]);

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.id) {
      return Response.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );
    }

    const links = await prisma.link.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        shortCode: true,
        originalUrl: true,
        clicks: true,
        createdAt: true,
        smartRoutes: true,
      },
    });

    return Response.json({ success: true, links });
  } catch (error) {
    console.error("Error fetching links:", error);
    return Response.json(
      { success: false, message: "Failed to fetch links" },
      { status: 500 },
    );
  }
}

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.id) {
      return Response.json(
        { success: false, message: "Unauthorized. Please sign in first." },
        { status: 401 },
      );
    }

    const body = await req.json();

    // Validate with Zod
    const parsed = createLinkSchema.safeParse(body);

    if (!parsed.success) {
      const firstError = parsed.error.errors[0]?.message || "Invalid input";
      return Response.json(
        { success: false, message: firstError },
        { status: 400 },
      );
    }

    const { url, alias } = parsed.data;
    if (alias && RESERVED_ALIASES.has(alias.toLowerCase())) {
      return Response.json(
        { success: false, message: "This alias is restricted. Please choose a different one." },
        { status: 400 },
      );
    }  
    const shortCode = alias || generateShortCode();

    // Generate device-specific smart routes (deep-links, store URLs, fallbacks)
    const smartRoutes = generateSmartRoutes(url);

    const existing = await prisma.link.findUnique({
      where: { shortCode },
    });

    if (existing) {
      return Response.json(
        {
          success: false,
          message: `The alias "${shortCode}" is already taken. Try a different one.`,
        },
        { status: 409 },
      );
    }

    const newLink = await prisma.link.create({
      data: {
        originalUrl: url,
        shortCode,
        smartRoutes,
        userId: session.user.id,
      },
    });

    return Response.json({
      success: true,
      id: newLink.id,
      shortCode,
    });
  } catch (error) {
    console.error("Error creating link:", error);
    return Response.json(
      { success: false, message: "Failed to create link" },
      { status: 500 },
    );
  }
}
