import {
  googleLogin,
  googleSignup,
  getMe,
} from "../controllers/auth.controller.js";
import { Router } from "express";

const authRoutes = Router();

authRoutes.post("/google/login", googleLogin);
authRoutes.post("/google/signup", googleSignup);
authRoutes.get("/me", getMe);

export default authRoutes;
