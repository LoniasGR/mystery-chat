import express from "express";
import { secrets } from "../configs";
import { ValidationError } from "../errors/ValidationError";
import { ensureValidJWT } from "../middleware/ensureValidJWT";
import { AuthCredentials } from "../models/AuthCredentials";
import AuthService from "../services/AuthService";
import secs from "../utils/secs";

const router = express.Router();

function addAuthCookes(
  res: express.Response,
  cookies: { jwt: string; refreshToken: string }
) {
  return res
    .cookie(secrets.jwtAccessTokenName, cookies.jwt, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: secs(secrets.jwtAccessTokenDuration) * 1000,
    })
    .cookie(secrets.jwtRefreshTokenName, cookies.refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: secs(secrets.jwtRefreshTokenDuration) * 1000,
    });
}

router.post("/login", async (req, res) => {
  const jwt = req.cookies[secrets.jwtAccessTokenName];
  const refreshToken = req.cookies[secrets.jwtRefreshTokenName];
  if (jwt !== undefined || refreshToken !== undefined) {
    res.status(403).json({ error: "You are already logged in, dummy!" });
    return;
  }

  const body = req.body as AuthCredentials;
  console.debug(`Login for user ${body.username}`);

  try {
    const cookies = await AuthService.login(body.username, body.password);

    addAuthCookes(res, cookies);
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

  if (oldRefreshToken === undefined) {
    res
      .status(401)
      .json({ error: "Go away you little elfish person. Go to login page!" });
    return;
  }
  const cookies = await AuthService.refresh(oldRefreshToken);

  addAuthCookes(res, cookies);
  res.status(200).json({});
});

export default router;
