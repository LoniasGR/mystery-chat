import express from "express";
import { secrets } from "../configs";
import { ensureValidJWT } from "../middleware/ensureValidJWT";
import { AuthCredentials } from "../models/AuthCredentials";
import { ValidationError } from "../models/ValidationError";
import AuthService from "../services/AuthService";
import secs from "../utils/secs";
const router = express.Router();

router.post("/login", async (req, res) => {
  const body = req.body as AuthCredentials;
  console.debug(`Login for user ${body.username}`);

  try {
    const jwt = await AuthService.login(body.username, body.password);
    const refreshToken = await AuthService.createRefreshToken(body.username);

    res
      .cookie(secrets.jwtAccessTokenName, jwt, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: secs(secrets.jwtAccessTokenDuration), // 2 hrs
      })
      .cookie("mysterious-refresh-token", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: secs(secrets.jwtRefreshTokenDuration),
      })
      .status(200)
      .json({ username: body.username });
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

export default router;
