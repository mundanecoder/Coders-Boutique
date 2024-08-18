// services/auth-service.ts

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {
  IAuthService,
  LoginInput,
  LoginResult,
  TokenPair,
} from "../../types/userTypes";
import { IUserRepository } from "../../types/userTypes";
import { User } from "@prisma/client";

export class AuthService implements IAuthService {
  private userRepository: IUserRepository;

  constructor(userRepository: IUserRepository) {
    this.userRepository = userRepository;
  }

  async login(loginData: LoginInput): Promise<LoginResult | null> {
    const user = await this.userRepository.findUserByEmail(loginData.email);

    if (!user) {
      return null;
    }

    const isPasswordValid = await bcrypt.compare(
      loginData.password,
      user.passwordHash
    );

    if (!isPasswordValid) {
      return null;
    }

    const accessToken = this.generateAccessToken(user);
    const refreshToken = this.generateRefreshToken(user);

    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await this.userRepository.createToken(
      user.id,
      accessToken,
      refreshToken,
      expiresAt
    );

    return {
      user: this.sanitizeUser(user),
      accessToken,
      refreshToken,
    };
  }
  async refreshToken(refreshToken: string): Promise<TokenPair> {
    const tokenData = await this.userRepository.findTokenByRefreshToken(
      refreshToken
    );
    if (!tokenData) {
      throw new Error("Invalid refresh token");
    }

    if (new Date() > tokenData.expiresAt) {
      await this.userRepository.deleteTokenByRefreshToken(refreshToken);
      throw new Error("Refresh token expired");
    }

    const user = await this.userRepository.findUserById(tokenData.userId);
    if (!user) {
      throw new Error("User not found");
    }

    const newTokens = this.generateTokenPair(user);

    // Implement token rotation
    await this.userRepository.deleteTokenByRefreshToken(refreshToken);
    await this.userRepository.createToken(
      user.id,
      newTokens.accessToken,
      newTokens.refreshToken,
      newTokens.refreshTokenExpires
    );

    return newTokens;
  }
  private generateTokenPair(user: User): TokenPair {
    const accessToken = this.generateAccessToken(user);
    const refreshToken = this.generateRefreshToken(user);
    const refreshTokenExpires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    return { accessToken, refreshToken, refreshTokenExpires };
  }

  private generateAccessToken(user: User): string {
    return jwt.sign({ sub: user.id }, process.env.JWT_SECRET!, {
      expiresIn: "15m",
      algorithm: "HS256",
    });
  }

  private generateRefreshToken(user: User): string {
    return jwt.sign({ sub: user.id }, process.env.JWT_REFRESH_SECRET!, {
      expiresIn: "7d",
      algorithm: "HS256",
    });
  }

  private sanitizeUser(user: User): Partial<User> {
    const { passwordHash, ...sanitizedUser } = user;
    return sanitizedUser;
  }

  async invalidateRefreshToken(refreshToken: string): Promise<void> {
    // Delete the token from the database
    await this.userRepository.deleteTokenByRefreshToken(refreshToken);
  }
}
