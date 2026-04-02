import express, { Router } from "express";
import {
  saveManualItem,
  getUserItems,
} from "../controllers/item.controller.js";
import { requireAuth } from "../middlewares/auth.middleware.js";

const itemRoutes = Router();

itemRoutes.use(requireAuth);

itemRoutes.post("/save", saveManualItem);
itemRoutes.get("/", getUserItems);

export default itemRoutes;
