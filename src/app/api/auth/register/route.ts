// app/api/users/route.ts

import { NextRequest, NextResponse } from "next/server";
// import { UserService } from "../../services/auth-register-service";
import { UserRepository } from "../../repositories/userRepository";
import { CreateUserInput } from "../../../types/userTypes";
import { UserService } from "../../services/user/user-service";

const userRepository = new UserRepository();
const userService = new UserService(userRepository);

export async function POST(req: NextRequest) {
  try {
    const body: CreateUserInput = await req.json();

    const newUser = await userService.signUp(body);

    return NextResponse.json(newUser, { status: 201 });
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json(
      { error: "An error occurred while creating the user" },
      { status: 500 }
    );
  }
}
