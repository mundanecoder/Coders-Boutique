// app/api/users/route.ts

import { NextRequest, NextResponse } from "next/server";
import { UserRepository } from "../../repositories/userRepository";

const userRepository = new UserRepository();

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const skip = (page - 1) * limit;

    const [users, totalUsers] = await Promise.all([
      userRepository.findAllUsers({ skip, limit }),
      userRepository.countUsers(),
    ]);

    const totalPages = Math.ceil(totalUsers / limit);

    return NextResponse.json(
      {
        users,
        meta: {
          page,
          limit,
          totalPages,
          totalUsers,
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
