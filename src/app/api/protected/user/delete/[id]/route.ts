import { NextRequest, NextResponse } from "next/server";
import { UserRepository } from "@/app/api/repositories/userRepository";
import { authMiddleware } from "@/app/api/authMiddleware";
import { prisma } from "../../../../../../../lib/prisma";

const userRepository = new UserRepository();

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  // Apply authentication middleware
  const authResponse = await authMiddleware(req);
  if (authResponse) {
    return authResponse; // Return the middleware response if authentication fails
  }

  const user = req.user;

  // Ensure user and roles exist
  if (!user || !user.roles || user.roles.length === 0) {
    return NextResponse.json(
      { error: "User role information is missing" },
      { status: 403 }
    );
  }

  // Check if user is an admin
  const isAdmin = user.roles.some(
    (role: { id: string; role: String; userId: string }) =>
      role.role === "Admin"
  );

  if (!isAdmin) {
    return NextResponse.json(
      { error: "You do not have permission to perform this action" },
      { status: 403 }
    );
  }

  const userId = params.id;

  try {
    // Use a transaction to ensure all operations succeed or fail together
    await prisma.$transaction(async (prisma: any) => {
      // Delete related records
      await prisma.userRole.deleteMany({ where: { userId } });
      await prisma.token.deleteMany({ where: { userId } });
      await prisma.passwordReset.deleteMany({ where: { userId } });

      // For AuditLog, remove the user association
      await prisma.auditLog.updateMany({
        where: { userId },
        data: { userId: null },
      });

      // Finally, delete the user
      await prisma.user.delete({ where: { id: userId } });
    });

    return NextResponse.json(
      { message: "User deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json(
      { error: "An error occurred while deleting the user" },
      { status: 500 }
    );
  }
}
