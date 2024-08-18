import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";
import { UserRepository } from "./repositories/userRepository";

export async function authMiddleware(req: NextRequest) {
  const userRepository = new UserRepository();

  // Function to generate a new access token
  const generateAccessToken = (userId: string) => {
    return jwt.sign({ sub: userId }, process.env.JWT_SECRET as string, {
      expiresIn: "15m",
    });
  };

  try {
    // Extract and verify the access token
    const authHeader = req.headers.get("Authorization");
    const accessToken = authHeader?.replace("Bearer ", "");

    if (accessToken) {
      try {
        const decodedToken = jwt.verify(
          accessToken,
          process.env.JWT_SECRET as string
        ) as jwt.JwtPayload;
        if (typeof decodedToken.sub === "string") {
          const user = await userRepository.findUserById(decodedToken.sub);
          if (user) {
            (req as any).user = user; // TypeScript now understands `user` on `req`
            return null; // Proceed with the request
          }
        } else {
          throw new Error("Invalid token payload");
        }
      } catch (error) {
        return NextResponse.json(
          { error: "Invalid access token" },
          { status: 401 }
        );
      }
    }

    const refreshToken = req.cookies.get("refreshToken")?.value;
    if (!refreshToken) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    try {
      const decodedRefreshToken = jwt.verify(
        refreshToken,
        process.env.JWT_REFRESH_SECRET as string
      ) as jwt.JwtPayload;
      if (typeof decodedRefreshToken.sub === "string") {
        const user = await userRepository.findUserById(decodedRefreshToken.sub);
        if (user) {
          const newAccessToken = generateAccessToken(user.id);
          //   const response = NextResponse.json({
          //     user,
          //     accessToken: newAccessToken,
          //   });
          //   response.headers.set("Authorization", `Bearer ${newAccessToken}`);
          (req as any).user = user;
          return null;
        }
      } else {
        throw new Error("Invalid refresh token payload");
      }
    } catch (refreshError) {
      return NextResponse.json(
        { error: "Invalid refresh token" },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: "Authentication failed" },
      { status: 401 }
    );
  } catch (error) {
    console.error("Error in auth middleware:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
