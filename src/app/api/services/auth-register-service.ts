// services/user-service.ts
import {
  IUserService,
  CreateUserInput,
  IUserRepository,
} from "../../types/userTypes";
import { User } from "@prisma/client";

export class UserService implements IUserService {
  private userRepository: IUserRepository;

  constructor(userRepository: IUserRepository) {
    this.userRepository = userRepository;
  }

  async signUp(userData: CreateUserInput): Promise<User> {
    return this.userRepository.createUser(userData);
  }
}
