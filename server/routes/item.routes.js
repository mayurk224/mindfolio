import express, { Router } from "express";
import { saveManualItem } from "../controllers/item.controller.js";
import { requireAuth } from "../middlewares/auth.middleware.js";

const itemRoutes = Router();

itemRoutes.use(requireAuth);

itemRoutes.post("/save", saveManualItem);

export default itemRoutes;
