import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import prisma from "@/lib/db";
import { createLinkSchema } from "@/lib/validation";
import { generateShortCode } from "@/lib/shortcode";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.id) {
      return Response.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
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
      },
    });

    return Response.json({ success: true, links });
  } catch (error) {
    console.error("Error fetching links:", error);
    return Response.json(
      { success: false, message: "Failed to fetch links" },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.id) {
      return Response.json(
        { success: false, message: "Unauthorized. Please sign in first." },
        { status: 401 }
      );
    }

    const body = await req.json();

    // Validate with Zod
    const parsed = createLinkSchema.safeParse(body);

    if (!parsed.success) {
      const firstError = parsed.error.errors[0]?.message || "Invalid input";
      return Response.json(
        { success: false, message: firstError },
        { status: 400 }
      );
    }

    const { url, alias } = parsed.data;

    const shortCode = alias || generateShortCode();

    // Check for duplicate alias
    const existing = await prisma.link.findUnique({
      where: { shortCode },
    });

    if (existing) {
      return Response.json(
        {
          success: false,
          message: `The alias "${shortCode}" is already taken. Try a different one.`,
        },
        { status: 409 }
      );
    }

    // Create the link
    await prisma.link.create({
      data: {
        originalUrl: url,
        shortCode,
        userId: session.user.id,
      },
    });

    return Response.json({
      success: true,
      shortCode,
    });
  } catch (error) {
    console.error("Error creating link:", error);
    return Response.json(
      { success: false, message: "Failed to create link" },
      { status: 500 }
    );
  }
}
