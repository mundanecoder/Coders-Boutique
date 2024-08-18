import { NextRequest, NextResponse } from "next/server";
import { UserRepository } from "../../repositories/userRepository";
import { UserService } from "../../services/user/user-service";

const userRepository = new UserRepository();
const userService = new UserService(userRepository);

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    await userService.forgotPassword(email);

    return NextResponse.json(
      { message: "Password reset email sent successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json(
      { error: "An error occurred while processing your request" },
      { status: 500 }
    );
  }
}
