import { db } from "../configs";
import { User } from "../models/User";
import { UsersRepository } from "../repositories/userRepository";

export class UserService {
  static async createUsers(users: User[]) {
    const userRepository = new UsersRepository(db);
    for (const u of users) {
      const userDb = await userRepository.findById(u._id);
      if (userDb == null) {
        console.info(`Creating user ${u._id}`);
        u.passphrase = await Bun.password.hash(u.passphrase);
        userRepository.create(u);
      }
    }
  }
}
