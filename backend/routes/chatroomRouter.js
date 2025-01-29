import express from "express";
import Chatroom from "../models/chatroomSchema.js";
import Message from "../models/messageSchema.js";

const router = express.Router();

/** GET CHATROOM MESSAGES */
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const sender = req.session.user.id;

    const chatroomMessagesFromSender = await Message.find({
      chatroom: id,
      sender,
    });
    const chatroomMessagesToOthers = await Message.find({
      chatroom: id,
      sender: { $ne: sender },
    });
    const chatroom = await Chatroom.findById(id);
    const chatroomAttendees = chatroom ? chatroom.users : [];

    req.body.chatroomMessagesFromSender = chatroomMessagesFromSender;
    req.body.chatroomMessagesToOthers = chatroomMessagesToOthers;
    req.body.chatroomAttendees = chatroomAttendees;

    res.json({
      chatroomMessagesFromSender,
      chatroomMessagesToOthers,
      chatroomAttendees,
    });
  } catch (error) {
    res.status(500).json({ errorMessage: "Internal server error" });
  }
});

export default router;
