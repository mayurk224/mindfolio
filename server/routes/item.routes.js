import { Router } from "express";
import {
  saveManualItem,
  getUserItems,
  getItemStatus,
  searchItems,
  uploadImage,
  softDeleteItem,
} from "../controllers/item.controller.js";
import { requireAuth } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/upload.middleware.js";

const itemRoutes = Router();

itemRoutes.use(requireAuth);

itemRoutes.post("/save", saveManualItem);
itemRoutes.get("/", getUserItems);
itemRoutes.get("/search", searchItems);
itemRoutes.get("/:id", getItemStatus);
itemRoutes.post("/upload",upload.single("file"), uploadImage);
itemRoutes.patch("/:id/delete", softDeleteItem);

export default itemRoutes;
