import { Server } from "socket.io";

let io;

export const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: [
        process.env.CLIENT_URL || "http://localhost:5173",
        "chrome-extension://", // Simplified for dev, we can refine this
      ],
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log(`User connected: ${socket.id}`);

    // Allow user to join a room based on their userId
    socket.on("join-room", (userId) => {
      if (userId) {
        socket.join(userId);
        console.log(`User ${socket.id} joined room: ${userId}`);
      }
    });

    socket.on("disconnect", () => {
      console.log(`User disconnected: ${socket.id}`);
    });
  });

  return io;
};

export const getIO = () => {
  if (!io) {
    throw new Error("Socket.io not initialized!");
  }
  return io;
};

export const emitToUser = (userId, event, data) => {
  if (io && userId) {
    io.to(userId).emit(event, data);
  }
};
