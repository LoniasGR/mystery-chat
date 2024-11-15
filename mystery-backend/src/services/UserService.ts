import type { User } from "@/models/User";
import UserRepository from "@/repositories/userRepository";

export class UserService {
  static async createUsers(users: User[]) {
    for (const u of users) {
      const userDb = await UserRepository.findById(u._id);
      if (userDb === null) {
        console.info(`Creating user ${u._id}`);
        u.passphrase = await Bun.password.hash(u.passphrase);
        UserRepository.create(u);
      }
    }
  }
}
