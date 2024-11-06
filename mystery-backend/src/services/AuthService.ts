import * as jose from "jose";
import secrets from "../configs/secrets";
import { ValidationError } from "../models/ValidationError";
import RefreshTokenRepository from "../repositories/refreshTokenRepository";
import UserRepository from "../repositories/userRepository";
import secs from "../utils/secs";

async function login(username: string, passphrase: string) {
  const user = await UserRepository.findById(username);
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
    .setExpirationTime(secrets.jwtAccessTokenDuration)
    .sign(secrets.jwtAccessTokenSecret);
}

async function logout(token: string) {
  RefreshTokenRepository.remove(token);
}

async function cleanupOldTokens(username: string) {
  const tokens = await RefreshTokenRepository.findByUser(username);
  const now = new Date();
  while (tokens.hasNext()) {
    const t = await tokens.next();
    if (now > t?.expiresAt!) {
      RefreshTokenRepository.remove(t?.token!);
    }
  }
}

async function createRefreshToken(username: string) {
  const token = await new jose.SignJWT({ username: username })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(secrets.jwtRefreshTokenDuration)
    .sign(secrets.jwtRefreshTokenSecret);

  RefreshTokenRepository.create({
    username: username,
    token: token,
    expiresAt: new Date(
      new Date().getTime() + secs(secrets.jwtRefreshTokenDuration) * 1000
    ),
  });
  cleanupOldTokens(username);
  return token;
}

const AuthService = {
  login,
  logout,
  createRefreshToken,
};

export default AuthService;
