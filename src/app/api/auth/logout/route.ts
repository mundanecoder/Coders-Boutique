// app/api/auth/logout/route.ts

import { NextRequest, NextResponse } from "next/server";
import { UserRepository } from "../../repositories/userRepository";
import { AuthService } from "../../services/auth-login-service";

const userRepository = new UserRepository();
const authService = new AuthService(userRepository);

export async function POST(req: NextRequest) {
  try {
    // Retrieve the refresh token from the cookies
    const refreshToken = req.cookies.get("refreshToken")?.value;

    // If no refresh token is found, respond with an error
    if (!refreshToken) {
      return NextResponse.json(
        { error: "No active session found" },
        { status: 401 }
      );
    }

    // Invalidate the refresh token in the database
    await authService.invalidateRefreshToken(refreshToken);

    // Clear the refresh token cookie
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
