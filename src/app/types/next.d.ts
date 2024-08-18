import { User } from "@/app/api/repositories/userRepository"; // Adjust import according to your structure
import { NextRequest } from "next/server";

declare module "next/server" {
  interface NextRequest {
    user?: User;
  }
}
