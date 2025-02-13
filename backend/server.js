import express from "express";
import { createServer } from "node:http";
import { Server } from "socket.io";
import dotenv from "dotenv";
import session from "express-session";
import MongoStore from "connect-mongo";
import cors from "cors";

import userRouter from "./routes/userRouter.js";
import messageRouter from "./routes/messageRouter.js";
import chatroomRouter from "./routes/chatroomRouter.js";
import { connectDB } from "./db.js";

dotenv.config();
connectDB();

const app = express();
app.use(express.json());

app.use(
  cors({
    origin: [process.env.CORS_ORIGIN, process.env.CORS_ORIGIN2],
    credentials: true,
  })
);

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: [process.env.CORS_ORIGIN, process.env.CORS_ORIGIN2],
    allowedHeaders: ["cors-header"],
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log(`Client connected: ${socket.id}`);
  socket.on("message", (message) => {
    console.log(`Message from ${socket.id}:`, message);
    io.emit("message", message);
  });

  socket.on("disconnect", () => {
    console.log(`Client disconnected: ${socket.id}`);
  });
});

app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 24 * 60 * 60 * 1000, // 1 day
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
    },
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI,
    }),
  })
);

app.use("/api/users", userRouter);
app.use("/api/messages", messageRouter(io));
app.use("/api/chatrooms", chatroomRouter(io));

const baseUrl = process.env.BASE_URL;
const port = parseInt(process.env.PORT) || 3030;
httpServer.listen(port, () => console.log(`PORT ON: ${baseUrl}:${port}`));
