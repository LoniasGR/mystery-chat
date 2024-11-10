import { Response } from "express";
import { secrets } from "../configs";
import secs from "./secs";

type AuthCookies = {
  jwt: string;
  refreshToken: string;
};

function addAuthCookies(res: Response, cookies: AuthCookies) {
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

function handleUnauthorized(res: Response, details?: string) {
  return res.status(401).json({
    error: "Go away you little elfish person. Go to login page!",
    details,
  });
}

function handleForbidden(res: Response, details?: string) {
  return res
    .status(403)
    .json({ error: "You seem to be missing some street creds.", details });
}

function handleAlreadyAuthorized(res: Response, username: string) {
  return res
    .status(301)
    .json({ username, error: "You were already logged in, dummy!" });
}

function handleExpired(res: Response, details?: string) {
  return res.status(403).json({ error: "Your time has expired!", details });
}

function handleUnexpected(res: Response, details?: string) {
  return res.status(500).json({
    error: "Something weird happend. Please contact the admins.",
    details,
  });
}

export {
  addAuthCookies,
  handleAlreadyAuthorized,
  handleExpired,
  handleForbidden,
  handleUnauthorized,
  handleUnexpected,
};
