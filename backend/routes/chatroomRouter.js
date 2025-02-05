import express from "express";
import Chatroom from "../models/chatroomSchema.js";
import Message from "../models/messageSchema.js";
import User from "../models/userSchema.js";

const router = express.Router();

/** CREATE NEW CHATROOM */
router.post("/exist", async (req, res) => {
  try {
    const currentUserId = req.session.user.id;
    const { username } = req.body;

    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({ errorMessage: "User not found" });
    }

    const chatroomExists = await Chatroom.find({
      users: { $all: [user._id, currentUserId] },
    });

    if (chatroomExists) {
      return res.json({ chatroom: chatroomExists[0]._id });
    }

    /**
     const newChatroom = new Chatroom({
       users: [currentUserId, user._id],
       });

       await newChatroom.save();
*/

    res.json({ chatroom: "new-chatroom" });
  } catch (error) {
    res.status(500).json({ errorMessage: "Internal server error" });
  }
});

/** INVITE USER TO CHATROOM */
// router.post("/:id/invite", async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { email } = req.body;
//     const user = await User.findOne({ email });

//     if (!user) {
//       return res.status(404).json({ errorMessage: "User not found" });
//     }

//     const chatroom = await Chatroom.findById(id);
//     if (!chatroom) {
//       return res.status(404).json({ errorMessage: "Chatroom not found" });
//     }

//     if (!chatroom.invitedUsers.includes(user._id)) {
//       chatroom.invitedUsers.push(user._id);
//       await chatroom.save();
//     }

//     res.status(200).json({ message: "User invited successfully" });
//   } catch (error) {
//     res.status(500).json({ errorMessage: "Internal server error" });
//   }
// });

router.get("/chats", async (req, res) => {
  try {
    const currentUsername = req.session.user.username;
    const currentUserId = req.session.user.id;

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

        const timestamps = await Message.find({ chatroom: chatId })
          .sort({ createdAt: -1 })
          .select("createdAt");

        const formattedTimestamps = timestamps.map((msg) => msg.createdAt);

        return {
          chatId,
          usernames,
          lastMessage,
          timestamps: formattedTimestamps,
        };
      })
    );

    res.json({ outputChats });
  } catch (error) {
    res.status(500).json({ errorMessage: "Internal server error" });
  }
});

/** GET CHATROOM MESSAGES */
router.get("/chats/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const currentUsername = req.session.user.username;

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

    res.json({ chatroomMessages, currentUsername });
  } catch (error) {
    res.status(500).json({ errorMessage: "Internal server error" });
  }
});

export default router;
