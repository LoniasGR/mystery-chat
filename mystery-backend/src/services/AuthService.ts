import { db } from "../configs/mongo";
import { envOrDefault } from "../configs";
import { UsersRepository } from "../repositories/userRepository";
import * as jose from "jose";

export class AuthService {
  users: UsersRepository;
  secret: Uint8Array;

  constructor() {
    this.users = new UsersRepository(db);
    this.secret = new TextEncoder().encode(
      envOrDefault("JWT_SECRET") as string
    );
  }
  async login(username: string, passphrase: string) {
    const user = await this.users.findById(username);
    if (user == null) {
      throw new Error("Not quite right, give it another bite!");
    }
    const isMatch = Bun.password.verify(passphrase, user.passphrase);
    if (!isMatch) {
      throw new Error("Not quite right, give it another bite!");
    }
    return new jose.SignJWT({ username: username })
      .setIssuedAt()
      .setExpirationTime("2h")
      .sign(this.secret);
  }
}
