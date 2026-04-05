import { Router } from "express";
import { getCollections, createCollection, toggleItemInCollection } from "../controllers/collection.controller.js";
import { requireAuth } from "../middlewares/auth.middleware.js";

const router = Router();

// Retrieve all collections for the user
router.get("/", requireAuth, getCollections);

// Create a new collection
router.post("/", requireAuth, createCollection);

// Toggle an item in a collection (add or remove)
router.patch("/toggle", requireAuth, toggleItemInCollection);

export default router;
