import { secrets } from "@/configs";
import { TokenMissmatchError } from "@/errors/TokenMissmatchError";
import { ValidationError } from "@/errors/ValidationError";
import { ensureValidJWT } from "@/middleware/ensureValidJWT";
import type { AuthCredentials } from "@/models/AuthCredentials";
import UserRepository from "@/repositories/userRepository";
import AuthService from "@/services/AuthService";
import {
  addAuthCookies,
  handleAlreadyAuthorized,
  handleExpired,
  handleUnauthorized,
  handleUnexpected,
  handleWrongCredentials,
} from "@/utils/controllerUtils";
import { verifyJwt } from "@/utils/jwtUtils";
import express from "express";

const router = express.Router();

router.post("/login", async (req, res) => {
  const jwt = req.cookies[secrets.jwtAccessTokenName] as string;
  const refreshToken = req.cookies[secrets.jwtRefreshTokenName] as string;

  if (!!jwt && !!refreshToken) {
    const verification = await verifyJwt(jwt);

    if (verification.status === "success") {
      handleAlreadyAuthorized(res, verification.payload.username);
      return;
    }

    if (verification.status === "expired") {
      handleExpired(res);
      return;
    }
  }

  const body = req.body as AuthCredentials;
  console.debug(`Login for user ${body.username}`);

  try {
    const cookies = await AuthService.login(body.username, body.password);

    addAuthCookies(res, cookies);
    res.status(200).json({ username: body.username });
  } catch (e) {
    if (e instanceof ValidationError) {
      handleWrongCredentials(res, e.message);
    } else if (e instanceof Error) {
      handleUnexpected(res, e.message);
    } else {
      handleUnexpected(res, String(e));
    }
  }
});

router.post("/logout", async (req, res) => {
  const refreshToken = req.cookies[secrets.jwtRefreshTokenName];
  AuthService.logout(refreshToken);
  res
    .clearCookie(secrets.jwtAccessTokenName)
    .clearCookie(secrets.jwtRefreshTokenName)
    .status(200)
    .send();
});

router.post("/refresh", async (req, res) => {
  const oldRefreshToken = req.cookies[secrets.jwtRefreshTokenName];

  if (!oldRefreshToken) {
    handleUnauthorized(res);
    return;
  }
  try {
    const cookies = await AuthService.refresh(oldRefreshToken);
    addAuthCookies(res, cookies);
    res.status(200).json({});
  } catch (err) {
    if (err instanceof TokenMissmatchError) {
      handleUnauthorized(res);
    } else if (err instanceof Error) {
      handleUnexpected(res, err.message);
    } else {
      handleUnexpected(res, String(err));
    }
  }
});

router.get("/user", ensureValidJWT, async (req, res) => {
  const data = await UserRepository.findById(req.username!);
  if (data === null) {
    handleUnexpected(res);
    return;
  }
  const { passphrase, ...userResp } = data;
  res.status(200).json(userResp);
});

export default router;
