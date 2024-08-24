import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Define the public routes (without the (auth) prefix)
  const isPublic =
    path === "/login" ||
    path === "/register" ||
    path === "/forgot-password" ||
    path === "/reset-password" ||
    path === "/api-docs";

  const refreshtoken = request.cookies.get("refreshToken")?.value || "";

  const refreshTokenExists = refreshtoken ? true : false;

  // Redirect logic
  if (isPublic && refreshTokenExists) {
    return NextResponse.redirect(new URL("/", request.nextUrl));
  }
  if (!isPublic && !refreshTokenExists) {
    console.log("redirecting to login");
    return NextResponse.redirect(new URL("/login", request.nextUrl));
  }
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
