import express from "express";
import Chatroom from "../models/chatroomSchema.js";
import Message from "../models/messageSchema.js";

const router = express.Router();

/** TODO: GET ALL CHATROOMS FOR SPECIFIC USER */

router.get("/chats", async (req, res) => {
  try {
    const currentUsername = req.session.user.username;
    const currentUserId = req.session.user.id;

    const allChats = await Chatroom.find({ users: currentUserId }).populate(
      "users"
    );

    // TODO: IMPLEMENT AS MONGODB QUERY
    const outputChats = allChats.map((chat) => {
      const chatId = chat._id;
      const usernames = chat.users
        .map((user) => user.username)
        .filter((username) => username !== currentUsername);
      return { chatId, usernames };
    });

    res.json({ outputChats });
  } catch (error) {
    res.status(500).json({ errorMessage: "Internal server error" });
  }
});

/** GET CHATROOM MESSAGES */
router.get("/chats/:id", async (req, res) => {
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

    // req.body.chatroomMessagesFromSender = chatroomMessagesFromSender;
    // req.body.chatroomMessagesToOthers = chatroomMessagesToOthers;
    // req.body.chatroomAttendees = chatroomAttendees;

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
