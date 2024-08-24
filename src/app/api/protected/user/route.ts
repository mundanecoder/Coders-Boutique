export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { UserRepository } from "../../repositories/userRepository";
import { authMiddleware } from "../../authMiddleware";

const userRepository = new UserRepository();

export async function GET(req: NextRequest) {
  const authResponse = await authMiddleware(req);
  if (authResponse) {
    return authResponse;
  }

  try {
    const { searchParams } = new URL(req.url);
    const page = Math.max(parseInt(searchParams.get("page") || "1", 10), 1);
    const limit = Math.min(
      Math.max(parseInt(searchParams.get("limit") || "10", 10), 1),
      100
    ); // Set a reasonable maximum limit
    const skip = (page - 1) * limit;

    const { users, total } = await userRepository.findAllUsers({ skip, limit });

    const totalPages = Math.ceil(total / limit);

    return NextResponse.json(
      {
        users,
        currentUser: req.user,
        meta: {
          page,
          limit,
          totalPages,
          totalUsers: total,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error finding users:", error);
    return NextResponse.json(
      { error: "An error occurred while retrieving users" },
      { status: 500 }
    );
  }
}
