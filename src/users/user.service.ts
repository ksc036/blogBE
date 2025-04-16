import { TYPES } from "../di/types";
import { UserRepository } from "./user.repository";
export class UserService {
  private userRepository: UserRepository;
  constructor({
    [TYPES.UserRepository]: userRepository,
  }: {
    [TYPES.UserRepository]: UserRepository;
  }) {
    this.userRepository = userRepository;
  }

  getAll() {
    return this.userRepository.findAll();
  }
}
