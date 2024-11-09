import { NextFunction, Request, Response } from "express";
import * as jose from "jose";
import { secrets } from "../configs";

export async function ensureValidJWT(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const jwt = req.cookies[secrets.jwtAccessTokenName];
  const refreshToken = req.cookies[secrets.jwtRefreshTokenName];

  if (!jwt && !refreshToken) {
    return handleUnauthorized(res);
  }

  if (!jwt) {
    return handleForbidden(res);
  }

  try {
    const { payload } = await jose.jwtVerify(jwt, secrets.jwtAccessTokenSecret);
    // JWT payload is in s, date wants ms
    const expDate = new Date(payload.exp! * 1000);

    // The expiration date has passed
    if (new Date() > expDate) {
      return res.status(403).json({ error: "Your time has expired!" });
    }

    next();
  } catch (e) {
    const details = e instanceof Error ? e.message : String(e);
    if (refreshToken) {
      return handleForbidden(res, details);
    }
    handleUnauthorized(res, details);
  }
}

function handleUnauthorized(res: Response, details?: string) {
  res
    .status(401)
    .json({
      error: "Go away you little elfish person. Go to login page!",
      details,
    });
}

function handleForbidden(res: Response, details?: string) {
  res
    .status(403)
    .json({ error: "You seem to be missing some street creds.", details });
}
