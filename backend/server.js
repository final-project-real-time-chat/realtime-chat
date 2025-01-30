import express from "express";
import dotenv from "dotenv";
import session from "express-session";
import MongoStore from "connect-mongo";

import userRouter from "./routes/userRouter.js";
import messageRouter from "./routes/messageRouter.js";
import chatroomRouter from "./routes/chatroomRouter.js";
import { connectDB } from "./db.js";

dotenv.config();
connectDB();

const app = express();
app.use(express.json());
app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    },
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI,
    }),
  })
);

app.use("/api/users", userRouter);
app.use("/api/messages", messageRouter);
app.use("/api/chatrooms", chatroomRouter);

const baseUrl = process.env.BASE_URL;
const port = parseInt(process.env.PORT) || 3000;
app.listen(port, () => console.log(`PORT ON: ${baseUrl}:${port}`));
