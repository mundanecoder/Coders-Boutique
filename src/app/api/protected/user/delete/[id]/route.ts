import { UserRepository } from "@/app/api/repositories/userRepository";
import { NextRequest, NextResponse } from "next/server";

const userRepository = new UserRepository();

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = params.id;

    // Attempt to delete the user
    await userRepository.deleteUser(userId);

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
