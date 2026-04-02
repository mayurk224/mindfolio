import express from "express";
import { googleLogin } from "../controllers/auth.controller.js";

const authRoutes = express.Router();

authRoutes.post("/google", googleLogin);

export default authRoutes;
