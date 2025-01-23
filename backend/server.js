import express from "express";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.get("/", (req, res) => res.json({ message: "Server is running" }));

const port = parseInt(process.env.PORT) || 3000;
app.listen(port, () => console.log(`PORT ON: http://localhost:${port}`));
