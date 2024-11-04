import express from "express";
import { AuthCredentials } from "../models/AuthCredentials";
import { AuthService } from "../services/AuthService";
const router = express.Router();

router.post("/login", (req, res) => {
  const body = req.body as AuthCredentials;
  const auth = new AuthService();
  try {
    const jwt = auth.login(body.username, body.password);
    res
      .cookie("Mysterious-token", jwt, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        // TODO: fix expiry
      })
      .status(200)
      .json({ username: body.username });
  } catch (e) {
    res.status(500).json({ error: e });
  } finally {
    res.send();
  }
});

export default router;
