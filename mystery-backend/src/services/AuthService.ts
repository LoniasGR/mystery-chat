import { db } from "../configs/mongo";
import { envOrDefault } from "../configs";
import { UsersRepository } from "../repositories/userRepository";
import * as jose from "jose";
import { ValidationError } from "../models/ValidationError";
import { jwtSecret } from "../configs/secrets";

export class AuthService {
  users: UsersRepository;
  secret: Uint8Array;

  constructor() {
    this.users = new UsersRepository(db);
    this.secret = jwtSecret;
  }
  async login(username: string, passphrase: string) {
    const user = await this.users.findById(username);
    if (user == null) {
      throw new ValidationError("Not quite right, give it another bite!");
    }
    const isMatch = await Bun.password.verify(passphrase, user.passphrase);
    if (!isMatch) {
      throw new ValidationError("Not quite right, give it another bite!");
    }

    return new jose.SignJWT({ username: username })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("2h")
      .sign(this.secret);
  }
}
