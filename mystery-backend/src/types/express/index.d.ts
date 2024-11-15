import * as express from "express";

declare module "express" {
  interface Request {
    username?: string;
    _query: {
      username?: string;
    };
  }
}

declare module "http" {
  interface IncomingMessage {
    username?: string;
  }
}
