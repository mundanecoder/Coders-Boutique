import { PasswordReset, Token, User } from "@prisma/client";

export interface IUserRepository {
  createUser(data: CreateUserInput): Promise<User>;
  findUserByEmail(email: string): Promise<User | null>;
  createToken(
    userId: string,
    accessToken: string,
    refreshToken: string,
    expiresAt: Date
  ): Promise<Token>;
  deleteTokenByRefreshToken(refreshToken: string): Promise<void>;
  findTokenByRefreshToken(refreshToken: string): Promise<Token | null>;
  findUserById(userId: string): Promise<User | null>;
  findAllUsers(params: { skip: number; limit: number }): Promise<GetAllResult>;
  countUsers(): Promise<number>; // Added method to count total users
  updateUserPassword(userId: string, newPassword: string): Promise<User>;
  createPasswordReset(
    email: string,
    token: string,
    expiresAt: Date
  ): Promise<PasswordReset>;
  findPasswordResetByToken(
    token: string
  ): Promise<(PasswordReset & { user: User }) | null>;
  deletePasswordReset(id: string): Promise<void>;
  deleteUser(userId: string): Promise<void>;
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
  refreshTokenExpires: Date;
}

export interface IUserService {
  signUp(userData: CreateUserInput): Promise<User>;
  getAllUsers(params: { skip: number; limit: number }): Promise<GetAllResult>;
  getUserById(userId: string): Promise<User | null>;
  forgotPassword(email: string): Promise<void>;
  deleteUser(userId: string): Promise<void>;
  resetPassword(resetToken: string, newPassword: string): Promise<void>;
  changePassword(
    userId: string,
    oldPassword: string,
    newPassword: string
  ): Promise<void>;
}

export interface GetAllUsersResponse {
  users: UserObject[];
  currentUser: User;
  meta: Meta;
}

// The Meta interface remains the same
export interface Meta {
  page: number;
  limit: number;
  totalPages: number;
  totalUsers: number;
}

export interface GetAllResult {
  users: User[];
  total: number;
}

export interface CreateUserInput {
  email: string;
  password: string;
  name: string;
  role?: UserRoleEnum;
}
export interface Role {
  id: string;
  role: string;
  userId: string;
}

export interface UserObject {
  id: string;
  email: string;
  passwordHash: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  roles: Role[];
}

export interface Meta {
  page: number;
  limit: number;
  totalPages: number;
  totalUsers: number;
}

export interface GetAllUsersResponse {
  users: UserObject[];
  currentUser: User;
  meta: Meta;
}

export interface GetAllResult {
  users: User[];
  total: number;
}

export enum UserRoleEnum {
  Admin = "Admin",
  Regular = "Regular",
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface LoginResult {
  user: Partial<User>;
  accessToken: string;
  refreshToken: string;
}

export interface IAuthService {
  login(loginData: LoginInput): Promise<LoginResult | null>;
  refreshToken(refreshToken: string): Promise<TokenPair>;
}
