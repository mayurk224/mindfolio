import express from "express";
import { googleLogin, googleSignup } from "../controllers/auth.controller.js";

const authRoutes = express.Router();

authRoutes.post("/google/login", googleLogin);

authRoutes.post("/google/signup", googleSignup);

export default authRoutes;
