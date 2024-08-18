import { NextRequest, NextResponse } from "next/server";
import { UserRepository } from "../../repositories/userRepository";
import { AuthService } from "../../services/auth-login-service";
import { LoginInput } from "../../../types/userTypes";

const userRepository = new UserRepository();
const authService = new AuthService(userRepository);

export async function POST(req: NextRequest) {
  try {
    const body: LoginInput = await req.json();

    const loginResult = await authService.login(body);

    if (!loginResult) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    const response = NextResponse.json(
      {
        user: loginResult.user,
        accessToken: loginResult.accessToken,
      },
      { status: 200 }
    );

    response.cookies.set("refreshToken", loginResult.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Error during login:", error);
    return NextResponse.json(
      { error: "An error occurred during login" },
      { status: 500 }
    );
  }
}
