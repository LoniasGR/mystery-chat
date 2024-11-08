import * as jose from "jose";
import secrets from "../configs/secrets";
import { ValidationError } from "../errors/ValidationError";
import RefreshTokenRepository from "../repositories/refreshTokenRepository";
import UserRepository from "../repositories/userRepository";
import secs from "../utils/secs";
import { TokenMissmatchError } from "../errors/TokenMissmatchError";

async function login(username: string, passphrase: string) {
  const user = await UserRepository.findById(username);
  if (user === null) {
    throw new ValidationError("Not quite right, give it another bite!");
  }
  const isMatch = await Bun.password.verify(passphrase, user.passphrase);
  if (!isMatch) {
    throw new ValidationError("Not quite right, give it another bite!");
  }
  return await createTokens(username);
}

async function createTokens(username: string) {
  const jwt = await new jose.SignJWT({ username: username })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(secrets.jwtAccessTokenDuration)
    .sign(secrets.jwtAccessTokenSecret);

  const refreshToken = await createRefreshToken(username);
  return { jwt, refreshToken };
}

async function logout(token: string) {
  RefreshTokenRepository.remove(token);
}

async function cleanupOldTokens(username: string) {
  console.debug(`Cleaning up old tokens for user ${username}`);
  const tokens = await RefreshTokenRepository.findByUser(username);
  const now = new Date();
  for (const t of tokens) {
    if (now > t.expiresAt!) {
      try {
        console.debug(`Removing token ${t.token}`);
        await RefreshTokenRepository.remove(t.token!);
      } catch (err) {
        throw err;
      }
    }
  }
  console.debug(`Finished cleaning up for user ${username}`);
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

async function refresh(oldRefreshToken: string) {
  const oldTokenDB = await RefreshTokenRepository.findByTokenName(
    oldRefreshToken
  );
  if (oldTokenDB?.token !== oldRefreshToken) {
    throw new TokenMissmatchError("Provided token does not much stored token");
  }
  await RefreshTokenRepository.remove(oldRefreshToken);
  return createTokens(oldTokenDB.username);
}

const AuthService = {
  login,
  logout,
  refresh,
  createRefreshToken,
};

export default AuthService;
