import express from "express";
import Message from "../models/messageSchema.js";
import Chatroom from "../models/chatroomSchema.js";

const router = express.Router();

/** SEND A MESSAGE */
router.post("/send", async (req, res) => {
  try {
    const { chatroom, content } = req.body;
    const sender = req.session.user.id;

    console.log("Sender ID:", sender);
    console.log("Chatroom ID:", chatroom);

    const chatroomData = await Chatroom.findById(chatroom);
    if (!chatroomData) {
      return res.status(404).json({ errorMessage: "Chatroom not found" });
    }

    console.log("Chatroom Data:", chatroomData);

    // if (!chatroomData.invitedUsers.includes(sender)) {
    //   console.log("Access denied for user:", sender);
    //   return res.status(403).json({ errorMessage: "Access denied" });
    // }

    const newMessage = new Message({ chatroom, content, sender });
    await newMessage.save();

    res.status(201).json({ message: "Message sent successfully", newMessage });
  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).json({ errorMessage: "Internal server error" });
  }
});

export default router;
