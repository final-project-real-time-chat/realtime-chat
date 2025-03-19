import express from "express";
import multer from "multer";
import cloudinary from "../cloudinary.js";
import fs from "fs";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.post("/upload", upload.single("image"), async (req, res) => {
  try {
    const result = await cloudinary.uploader.upload(req.file.path);
    fs.unlinkSync(req.file.path); // Lösche die Datei nach dem Hochladen
    res.json({ url: result.secure_url });
  } catch (error) {
    res.status(500).json({ error: "Failed to upload image" });
  }
});

export default router;
