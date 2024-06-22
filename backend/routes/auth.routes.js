import express from "express";
import { googleSignIn, login, logout, signup } from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/signup", signup);

router.post("/login", login);
router.post("/google-signin", googleSignIn)

router.post("/logout", logout);

export default router;
