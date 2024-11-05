import express from "express";
import { AuthCredentials } from "../models/AuthCredentials";
import { AuthService } from "../services/AuthService";
import { ValidationError } from "../models/ValidationError";
import { ensureValidJWT } from "../middleware/ensureValidJWT";
const router = express.Router();

router.post("/login", async (req, res) => {
  const body = req.body as AuthCredentials;
  const auth = new AuthService();
  console.debug(`Login for user ${body.username}`);

  try {
    const jwt = await auth.login(body.username, body.password);
    res
      .cookie("mysterious-token", jwt, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: 1000 * 60 * 60 * 2, // 2 hrs`
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
  res.clearCookie("mysterious-token").status(200).send();
});

export default router;
