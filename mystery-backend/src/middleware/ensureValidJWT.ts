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

  if (jwt == undefined && refreshToken == undefined) {
    res.status(401).json("Go away you little elfish person. Go to login page!");
  }

  if (jwt == undefined) {
    res.status(403).json("You seem to be missing some street creds.");
  }
  const { payload } = await jose.jwtVerify(jwt, secrets.jwtAccessTokenSecret);

  // JWT payload is in s, date wants ms
  const expDate = new Date(payload.exp! * 1000);

  // The expiration date has passed
  if (new Date() > expDate) {
    res.status(403).json("Your time has expired!");
  }
  next();
}
