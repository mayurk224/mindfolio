import dotenv from "dotenv";
import { createServer } from "http";
import { initSocket } from "./services/socket.js";

dotenv.config();
import "./services/aiWorker.js";

const { default: app } = await import("./src/app.js");
const { default: connectDB } = await import("./config/db.js");

const PORT = process.env.PORT || 8000;
const server = createServer(app);

// Initialize Socket.io
initSocket(server);

server.listen(PORT, async () => {
  try {
    await connectDB();
    console.log(`Server is running on port ${PORT}`);
  } catch (error) {
    console.error("Failed to start server:", error);
  }
});

