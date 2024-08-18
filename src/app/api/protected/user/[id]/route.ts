import { NextRequest, NextResponse } from "next/server";
import { UserRepository } from "@/app/api/repositories/userRepository";
import { authMiddleware } from "@/app/api/authMiddleware";

const userRepository = new UserRepository();

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const authResponse = await authMiddleware(req);
  if (authResponse) {
    return authResponse;
  }

  const currentUser = req.user;
  if (currentUser.id !== params.id) {
    return NextResponse.json(
      { error: "You do not have permission to view this user" },
      { status: 401 }
    );
  }

  try {
    const userId = params.id;

    const user = await userRepository.findUserById(userId);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ data: { user, currentUser } }, { status: 200 });
  } catch (error) {
    console.error("Error finding user:", error);
    return NextResponse.json(
      { error: "An error occurred while finding the user" },
      { status: 500 }
    );
  }
}
