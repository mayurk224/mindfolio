import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import authRoutes from "../routes/auth.routes.js";
import itemRoutes from "../routes/item.routes.js";
import collectionRoutes from "../routes/collection.routes.js";
import { saveManualItem } from "../controllers/item.controller.js";
import { requireAuth } from "../middlewares/auth.middleware.js";

const app = express();
const isProduction = process.env.NODE_ENV === "production";

function parseOriginList(...values) {
  return values
    .flatMap((value) => String(value || "").split(","))
    .map((value) => value.trim())
    .filter(Boolean);
}

const allowedOrigins = new Set(
  parseOriginList(
    process.env.CLIENT_URL || "http://localhost:5173",
    process.env.ALLOWED_ORIGINS,
    process.env.EXTENSION_ORIGIN,
    process.env.EXTENSION_ORIGINS,
  ),
);

function isAllowedOrigin(origin) {
  if (!origin) {
    return true;
  }

  if (allowedOrigins.has(origin)) {
    return true;
  }

  if (!isProduction && origin.startsWith("chrome-extension://")) {
    return true;
  }

  return false;
}

app.use(
  cors({
    origin(origin, callback) {
      if (isAllowedOrigin(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Origin is not allowed by CORS."));
    },
    credentials: true,
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok", message: "Server is awake" });
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/auth", authRoutes);
app.use("/api/auth", authRoutes);

app.post("/save", requireAuth, saveManualItem);
app.use("/api/items", itemRoutes);
app.use("/api/collections", collectionRoutes);

export default app;
