import { NextFunction, Request, Response } from "express";
import * as jose from "jose";
import { secrets } from "../configs";
import {
  handleExpired,
  handleForbidden,
  handleUnauthorized,
} from "../utils/controllerUtils";

export async function ensureValidJWT(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const jwt = req.cookies[secrets.jwtAccessTokenName];
  const refreshToken = req.cookies[secrets.jwtRefreshTokenName];

  if (!jwt && !refreshToken) {
    handleUnauthorized(res);
    return;
  }

  if (!jwt) {
    handleForbidden(res);
    return;
  }

  try {
    const { payload } = await jose.jwtVerify(jwt, secrets.jwtAccessTokenSecret);
    // JWT payload is in s, date wants ms
    const expDate = new Date(payload.exp! * 1000);

    // The expiration date has passed
    if (new Date() > expDate) {
      handleExpired(res);
      return;
    }

    next();
  } catch (e) {
    const details = e instanceof Error ? e.message : String(e);
    if (refreshToken) {
      handleForbidden(res, details);
      return;
    }
    handleUnauthorized(res, details);
  }
}
