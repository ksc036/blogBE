import { UserRepository } from "./user.repository";
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}
  private users = [
    { id: 1, name: "Alice" },
    { id: 2, name: "Bob" },
  ];

  getAll() {
    return this.users;
  }
}
