import { Response } from "express";
import { secrets } from "@/configs";
import secs from "./secs";
import http from "http";

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

function handleWrongCredentials(res: http.ServerResponse, details?: string) {
  res.statusCode = 401;
  res.setHeader("Content-Type", "application/json");

  return res.end(
    JSON.stringify({
      error:
        "Do you actually know the way to enter, or are you just playing smart?",
      details,
    })
  );
}

function handleUnauthorized(res: http.ServerResponse, details?: string) {
  res.statusCode = 401;
  res.setHeader("Content-Type", "application/json");

  return res.end(
    JSON.stringify({
      error: "Go away you little elfish person. Go to login page!",
      details,
    })
  );
}

function handleForbidden(res: http.ServerResponse, details?: string) {
  res.statusCode = 403;
  res.setHeader("Content-Type", "application/json");

  return res.end(
    JSON.stringify({
      error: "You seem to be missing some street creds.",
      details,
    })
  );
}

function handleAlreadyAuthorized(res: http.ServerResponse, username: string) {
  res.statusCode = 301;
  res.setHeader("Content-Type", "application/json");

  return res.end(
    JSON.stringify({
      error: "You were already logged in, dummy!",
      username,
    })
  );
}

function handleExpired(res: http.ServerResponse, details?: string) {
  res.statusCode = 403;
  res.setHeader("Content-Type", "application/json");

  return res.end(
    JSON.stringify({
      error: "Your time has expired!",
      details,
    })
  );
}

function handleUnexpected(res: http.ServerResponse, details?: string) {
  res.statusCode = 500;
  res.setHeader("Content-Type", "application/json");

  return res.end(
    JSON.stringify({
      error: "Something weird happend. Please contact the admins.",
      details,
    })
  );
}

export {
  addAuthCookies,
  handleAlreadyAuthorized,
  handleExpired,
  handleForbidden,
  handleUnauthorized,
  handleWrongCredentials,
  handleUnexpected,
};
