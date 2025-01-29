import express from "express";
import Message from "../models/messageSchema.js";

const router = express.Router();

/** SEND A MESSAGE */
router.post("/send", async (req, res) => {
  try {
    const { chatroom, content } = req.body;
    const sender = req.session.user.id;

    const newMessage = new Message({ chatroom, content, sender });
    await newMessage.save();

    res.status(201).json({ message: "Message sent successfully", newMessage });
  } catch (error) {
    res.status(500).json({ errorMessage: "Internal server error" });
  }
});

export default router;
