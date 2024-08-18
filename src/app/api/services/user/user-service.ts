// services/user-service.ts

import {
  CreateUserInput,
  IUserRepository,
  IUserService,
} from "@/app/types/userTypes";
import { User } from "@prisma/client";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { EmailService } from "../../utils/emailService";

export class UserService implements IUserService {
  private userRepository: IUserRepository;
  private emailService: EmailService;

  constructor(userRepository: IUserRepository) {
    this.userRepository = userRepository;
    this.emailService = new EmailService();
  }

  async signUp(userData: CreateUserInput): Promise<User> {
    return this.userRepository.createUser(userData);
  }

  async getAllUsers(params: { skip: number; limit: number }): Promise<User[]> {
    return this.userRepository.findAllUsers(params);
  }

  async getUserById(userId: string): Promise<User | null> {
    return this.userRepository.findUserById(userId);
  }

  async forgotPassword(email: string): Promise<void> {
    const user = await this.userRepository.findUserByEmail(email);
    if (!user) {
      throw new Error("User not found");
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpires = new Date(Date.now() + 3600000); // 1 hour from now

    await this.userRepository.createPasswordReset(
      email,
      resetToken,
      resetTokenExpires
    );

    // Send reset password email
    await this.emailService.sendResetPasswordEmail(user.email, resetToken);
  }

  async resetPassword(resetToken: string, newPassword: string): Promise<void> {
    const passwordReset = await this.userRepository.findPasswordResetByToken(
      resetToken
    );
    if (!passwordReset || passwordReset.expiresAt < new Date()) {
      throw new Error("Invalid or expired reset token");
    }

    await this.userRepository.updateUserPassword(
      passwordReset.user.id,
      newPassword
    );
    await this.userRepository.deletePasswordReset(passwordReset.id);
  }

  async deleteUser(userId: string): Promise<void> {
    const user = await this.userRepository.findUserById(userId);
    if (!user) {
      throw new Error("User not found");
    }
    await this.userRepository.deleteUser(userId);
  }

  async changePassword(
    userId: string,
    oldPassword: string,
    newPassword: string
  ): Promise<void> {
    const user = await this.userRepository.findUserById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    const isPasswordValid = await bcrypt.compare(
      oldPassword,
      user.passwordHash
    );
    if (!isPasswordValid) {
      throw new Error("Invalid old password");
    }

    await this.userRepository.updateUserPassword(userId, newPassword);
  }
}
