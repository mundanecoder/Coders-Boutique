// repositories/user-repository.ts

import {
  IUserRepository,
  CreateUserInput,
  UserRoleEnum,
} from "../../types/userTypes";
import { User, Token, PasswordReset } from "../../../../prisma/generated/client";
import bcrypt from "bcrypt";
import { prisma } from "../../../../lib/prisma";

export class UserRepository implements IUserRepository {
  async countUsers(): Promise<number> {
    return prisma.user.count();
  }
  async createUser(data: CreateUserInput): Promise<User> {
    const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS ?? "10", 10);
    const hashedPassword = await bcrypt.hash(data.password, saltRounds);

    return prisma.user.create({
      data: {
        email: data.email,
        passwordHash: hashedPassword,
        name: data.name,
        roles: {
          create: [
            {
              role: data.role ?? UserRoleEnum.Regular,
            },
          ],
        },
      },
      include: {
        roles: true,
      },
    });
  }

  async findUserByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { email },
      include: { roles: true },
    });
  }

  async createToken(
    userId: string,
    accessToken: string,
    refreshToken: string,
    expiresAt: Date
  ): Promise<Token> {
    return prisma.token.create({
      data: {
        userId,
        accessToken,
        refreshToken,
        expiresAt,
      },
    });
  }

  async deleteTokenByRefreshToken(refreshToken: string): Promise<void> {
    await prisma.token.deleteMany({
      where: { refreshToken },
    });
  }

  async findTokenByRefreshToken(refreshToken: string): Promise<Token | null> {
    return prisma.token.findFirst({
      where: { refreshToken },
    });
  }

  async findUserById(userId: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { id: userId },
      include: { roles: true },
    });
  }

  async findAllUsers({
    skip = 0,
    limit = 10,
  }: {
    skip: number;
    limit: number;
  }): Promise<{ users: User[]; total: number }> {
    console.log(`Fetching users with skip: ${skip}, limit: ${limit}`);

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        skip: Number(skip), // Ensure skip is a number
        take: Number(limit), // Ensure limit is a number
        include: { roles: true },
        orderBy: { id: "asc" }, // Add consistent ordering
      }),
      prisma.user.count(),
    ]);

    return { users, total };
  }
  async updateUserPassword(userId: string, newPassword: string): Promise<User> {
    const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS ?? "10", 10);
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    return prisma.user.update({
      where: { id: userId },
      data: { passwordHash: hashedPassword },
      include: { roles: true },
    });
  }

  async createPasswordReset(
    email: string,
    token: string,
    expiresAt: Date
  ): Promise<PasswordReset> {
    return prisma.passwordReset.create({
      data: {
        email,
        token,
        expiresAt,
        user: { connect: { email } },
      },
    });
  }

  async findPasswordResetByToken(
    token: string
  ): Promise<(PasswordReset & { user: User }) | null> {
    return prisma.passwordReset.findUnique({
      where: { token },
      include: { user: true },
    });
  }

  async deletePasswordReset(id: string): Promise<void> {
    await prisma.passwordReset.delete({
      where: { id },
    });
  }

  async deleteUser(userId: string): Promise<void> {
    await prisma.user.delete({
      where: { id: userId },
    });
  }
}
