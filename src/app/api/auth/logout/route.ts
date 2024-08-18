// app/api/auth/logout/route.ts

import { NextRequest, NextResponse } from "next/server";
import { UserRepository } from "../../repositories/userRepository";
import { AuthService } from "../../services/auth-login-service";

const userRepository = new UserRepository();
const authService = new AuthService(userRepository);

export async function POST(req: NextRequest) {
  try {
    const refreshToken = req.cookies.get("refreshToken")?.value;

    if (!refreshToken) {
      return NextResponse.json(
        { error: "No active session found" },
        { status: 401 }
      );
    }

    await authService.invalidateRefreshToken(refreshToken);

    const response = NextResponse.json(
      { message: "Logged out successfully" },
      { status: 200 }
    );

    response.cookies.delete("refreshToken");

    return response;
  } catch (error) {
    console.error("Error during logout:", error);
    return NextResponse.json(
      { error: "An error occurred during logout" },
      { status: 500 }
    );
  }
}
