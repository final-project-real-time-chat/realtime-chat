import express from "express";
import Message from "../models/messageSchema.js";
import Chatroom from "../models/chatroomSchema.js";

const router = express.Router();

/** SEND A MESSAGE */
router.post("/send", async (req, res) => {
  try {
    const { sender, content, chatroom } = req.body;
    if(!chatroom) {
      await Chatroom.create({
        
      })
    }
    const newMessage = new Message({ sender, content, chatroom });
    await newMessage.save();

    res.status(201).json({ message: "Message sent successfully", newMessage });
  } catch (error) {
    res.status(500).json({ errorMessage: "Internal server error" });
  }
});

/** RECEIVE MESSAGES */
router.get("/receive/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const messages = await Message.find({ receiverIds: userId }).populate(
      "senderId",
      "name"
    );
    if (!messages) {
      return res.send({ message: "No messages found" });
    }
    res.send(messages);
  } catch (error) {
    res.status(500).json({ errorMessage: "Internal server error" });
  }
});

/** USER UPDATE */
router.patch("/update/:id", async (req, res) => {
  const { id } = req.params;
  const { username, password } = req.body;

  try {
    const foundUser = await User.findById(id);
    if (!foundUser) {
      return res.status(404).json({ errorMessage: "User not found" });
    }

    if (req.session.user.role === "user") {
      res
        .status(403)
        .json({ message: "authentification failed.only admins can edit" });
      return;
    }

    if (username) {
      foundUser.username = username;
    }

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 12);
      foundUser.password = hashedPassword;
    }

    await foundUser.save();

    res.json({ message: "User updated successfully" });
  } catch (error) {
    res.status(500).json({ errorMessage: "Internal server error" });
  }
});

/** USER DELETE */
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const foundUser = await User.findById(id);
    if (!foundUser) {
      return res.status(404).json({ errorMessage: "User not found" });
    }

    await User.findByIdAndDelete(id);
    req.session.destroy((err) => {
      if (err) {
        return res
          .status(500)
          .json({ errorMessage: "Failed to delete user session" });
      }
      res.json({ message: "User deleted successfully" });
    });
  } catch (error) {
    res.status(500).json({ errorMessage: "Internal server error" });
  }
});

export default router;
