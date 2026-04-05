import { Router } from "express";
import {
  saveManualItem,
  getUserItems,
  getItemStatus,
  searchItems,
  uploadImage,
  softDeleteItem,
  updateItem,
  getDeletedItems,
} from "../controllers/item.controller.js";
import { requireAuth } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/upload.middleware.js";
import multer from "multer";

const itemRoutes = Router();

itemRoutes.use(requireAuth);

itemRoutes.post("/save", saveManualItem);
itemRoutes.get("/", getUserItems);
itemRoutes.get("/search", searchItems);
itemRoutes.get("/deleted", getDeletedItems);
itemRoutes.get("/:id", getItemStatus);
itemRoutes.post(
  "/upload",
  (req, res, next) => {
    upload.single("file")(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        if (err.code === "LIMIT_FILE_SIZE") {
          return res
            .status(400)
            .json({ message: "File is too large. Max size is 5MB." });
        }
        return res.status(400).json({ message: err.message });
      } else if (err) {
        return res.status(400).json({ message: err.message });
      }
      next();
    });
  },
  uploadImage,
);
itemRoutes.patch("/:id/delete", softDeleteItem);
itemRoutes.patch("/:id", updateItem);

export default itemRoutes;
