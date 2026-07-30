import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import prisma from "@/lib/db";

export async function DELETE(req, { params }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.id) {
      return Response.json(
        { success: false, message: "Unauthorized. Please sign in first." },
        { status: 401 }
      );
    }

    const { id } = await params;
    const linkId = parseInt(id, 10);

    if (isNaN(linkId)) {
      return Response.json(
        { success: false, message: "Invalid link ID" },
        { status: 400 }
      );
    }

    const link = await prisma.link.findUnique({
      where: { id: linkId },
    });

    if (!link) {
      return Response.json(
        { success: false, message: "Link not found" },
        { status: 404 }
      );
    }

    if (link.userId !== session.user.id) {
      return Response.json(
        { success: false, message: "You do not have permission to delete this link" },
        { status: 403 }
      );
    }

    await prisma.link.delete({
      where: { id: linkId },
    });

    return Response.json({
      success: true,
      message: "Link deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting link:", error);
    return Response.json(
      { success: false, message: "Failed to delete link" },
      { status: 500 }
    );
  }
}
