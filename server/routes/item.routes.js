import express, { Router } from "express";
import {
  saveManualItem,
  getUserItems,
  getItemStatus,
} from "../controllers/item.controller.js";
import { requireAuth } from "../middlewares/auth.middleware.js";

const itemRoutes = Router();

itemRoutes.use(requireAuth);

itemRoutes.post("/save", saveManualItem);
itemRoutes.get("/", getUserItems);
itemRoutes.get("/:id", getItemStatus);

export default itemRoutes;
