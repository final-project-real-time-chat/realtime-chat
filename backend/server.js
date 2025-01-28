import express from "express";
import dotenv from "dotenv";
import session from "express-session"

import userRouter from "./routes/userRouter.js"
import messageRouter from "./routes/messageRouter.js";
import { connectDB } from "./db.js";

dotenv.config();
connectDB();

const app = express();
app.use(express.json());
app.use(
  session({
    secret: process.env.JWT_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);

app.use("/api/users", userRouter);
app.use("/api/messages", messageRouter);

const baseUrl = process.env.BASE_URL;
const port = parseInt(process.env.PORT) || 3000;
app.listen(port, () => console.log(`PORT ON: ${baseUrl}:${port}`));
