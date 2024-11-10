import express from "express";
import { secrets } from "../configs";
import { ValidationError } from "../errors/ValidationError";
import { ensureValidJWT } from "../middleware/ensureValidJWT";
import { AuthCredentials } from "../models/AuthCredentials";
import AuthService from "../services/AuthService";
import {
  addAuthCookies,
  handleAlreadyAuthorized,
  handleUnauthorized,
} from "../utils/controllerUtils";

const router = express.Router();

router.post("/login", async (req, res) => {
  const jwt = req.cookies[secrets.jwtAccessTokenName];
  const refreshToken = req.cookies[secrets.jwtRefreshTokenName];
  if (!!jwt || !!refreshToken) {
    return handleAlreadyAuthorized(res);
  }

  const body = req.body as AuthCredentials;
  console.debug(`Login for user ${body.username}`);

  try {
    const cookies = await AuthService.login(body.username, body.password);

    addAuthCookies(res, cookies);
    res.status(200).json({ username: body.username });
  } catch (e) {
    if (e instanceof ValidationError) {
      res.status(401).json({ error: e.message });
    } else if (e instanceof Error) {
      res.status(500).json({ error: e.message });
    } else {
      res.status(500).json({ error: String(e) });
    }
  }
});

router.post("/logout", ensureValidJWT, async (req, res) => {
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
    return handleUnauthorized(res);
  }
  const cookies = await AuthService.refresh(oldRefreshToken);

  addAuthCookies(res, cookies);
  res.status(200).json({});
});

export default router;
