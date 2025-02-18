import express from "express";
import Chatroom from "../models/chatroomSchema.js";
import Message from "../models/messageSchema.js";
import User from "../models/userSchema.js";

const router = express.Router();

/** CREATE NEW CHATROOM */
export default (io) => {
  router.post("/exist", async (req, res) => {
    try {
      const currentUserId = req.session.user.id;
      const { username } = req.body;

      const user = await User.findOne({ username });

      if (!user) {
        return res.status(404).json({ errorMessage: "User not found" });
      }

      const chatroomExists = await Chatroom.findOne({
        users: { $all: [user._id, currentUserId] },
      });

      if (chatroomExists) {
        return res.json({ chatroom: chatroomExists._id });
      }

      res.json({
        chatroom: "new-chatroom",
        partnerName: user.username,
        partnerId: user._id,
      });
    } catch (error) {
      res.status(500).json({ errorMessage: "Internal server error" });
    }
  });

  router.post("/create", async (req, res) => {
    try {
      const { partnerName, content } = req.body;
      const currentUserId = req.session.user.id;
      const partner = await User.findOne({ username: partnerName });
      const newChatroom = await Chatroom.create({
        users: [partner._id, currentUserId],
        lastSeen: new Map([
          [partner._id.toString(), new Date(0)],
          [currentUserId.toString(), new Date(0)],
        ]),
      });

      const newMessage = await Message.create({
        content,
        chatroom: newChatroom._id,
        sender: currentUserId,
      });

      newChatroom.lastSeen.set(currentUserId.toString(), newMessage.createdAt);
      await newChatroom.save();
      // io.emit("chatroom", { chatroom: newChatroom, message: newMessage });
      io.emit("message", newMessage);

      console.log(newChatroom);

      res.status(201).json({ chatroomId: newChatroom._id });
    } catch (error) {
      res.status(500).json({ errorMessage: "Internal server error" });
    }
  });

  router.get("/chats", async (req, res) => {
    try {
      const currentUsername = req.session.user.username;
      const currentUserId = req.session.user.id;

      // const avatar = await User.findOne({ avatar });

      const allChats = await Chatroom.find({ users: currentUserId }).populate(
        "users"
      );

      // TODO: IMPLEMENT AS MONGODB QUERY
      const outputChats = await Promise.all(
        allChats.map(async (chat) => {
          const chatId = chat._id;
          const usernames = chat.users
            .map((user) => user.username)
            .filter((username) => username !== currentUsername);

          const lastMessage = await Message.findOne({ chatroom: chatId }).sort({
            createdAt: -1,
          });

          // const unreadMessagesCount = await Message.countDocuments({
          //   chatroom: chatId,
          //   readBy: { $ne: currentUserId },
          // });

          const timestamps = await Message.find({ chatroom: chatId })
            .sort({ createdAt: -1 })
            .select("createdAt");

          const formattedTimestamps = timestamps.map((msg) => msg.createdAt);

          return {
            chatId,
            usernames,
            lastMessage,
            timestamps: formattedTimestamps,
            // unreadMessagesCount,
          };
        })
      );

      const sortedChatrooms = outputChats.sort((a, b) => {
        if (!a.lastMessage || !b.lastMessage) return 0;
        return b.lastMessage.createdAt - a.lastMessage.createdAt;
      });

      res.json({ chatrooms: sortedChatrooms });
    } catch (error) {
      res.status(500).json({ errorMessage: "Internal server error" });
    }
  });
  router.post("/chats/:id/mark-as-read", async (req, res) => {
    const currentUsername = req.session.user.username;
    const currentUserId = req.session.user.id;

    const { id } = req.params;
  });
  /** GET CHATROOM MESSAGES */
  router.get("/chats/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const currentUsername = req.session.user.username;
      const currentUserId = req.session.user.id;

      const chatroomMessages = await Message.find({ chatroom: id }).populate(
        "sender"
      );

      if (!chatroomMessages) {
        return res.status(404).json({ errorMessage: "Chatroom not found" });
      }

      const timestamps = await Message.find({ chatroom: id })
        .sort({ createdAt: -1 })
        .select("createdAt");

      const formattedTimestamps = timestamps.map((msg) => msg.createdAt);

      const chatroom = await Chatroom.findOne({ _id: id });

      const partnerId = chatroom.users.find(
        (userId) => userId.toString() !== currentUserId.toString()
      );

      const partner = await User.findById(partnerId);
      const partnerName = partner.username;

      res.json({
        chatroomMessages,
        currentUsername,
        partnerName,
      });
    } catch (error) {
      res.status(500).json({ errorMessage: "Internal server error" });
    }
  });

  return router;
};
