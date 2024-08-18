// app/api/users/[id]/route.ts

import { UserRepository } from "@/app/api/repositories/userRepository";
import { NextRequest, NextResponse } from "next/server";

const userRepository = new UserRepository();

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = params.id;

    const user = await userRepository.findUserById(userId);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    console.error("Error finding user:", error);
    return NextResponse.json(
      { error: "An error occurred while finding the user" },
      { status: 500 }
    );
  }
}
