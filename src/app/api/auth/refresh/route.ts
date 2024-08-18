// app/api/auth/refresh/route.ts

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
        { error: "Refresh token not provided" },
        { status: 400 }
      );
    }

    const newTokens = await authService.refreshToken(refreshToken);

    const response = NextResponse.json(
      {
        accessToken: newTokens.accessToken,
      },
      { status: 200 }
    );

    response.cookies.set("refreshToken", newTokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      expires: newTokens.refreshTokenExpires,
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Error refreshing token:", error);
    return NextResponse.json(
      { error: "An error occurred while refreshing the token" },
      { status: 401 }
    );
  }
}
