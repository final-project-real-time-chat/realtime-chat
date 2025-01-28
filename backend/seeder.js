import mongoose, { Types } from "mongoose";
import bcrypt from "bcrypt"
import dotenv from "dotenv";
import User from "./models/userSchema.js";
import Chatroom from "./models/chatroomSchema.js";
import Message from "./models/messageSchema.js";

dotenv.config();

mongoose.connect(process.env.MONGODB_URI);

const seedDatabase = async () => {
  await mongoose.connection.dropDatabase();

  const hashedPassword = await bcrypt.hash("password", 12)

  const user1 = new User({
    email: "user1@mail.com",
    username: "user1",
    password: hashedPassword,
  });

  const user2 = new User({
    email: "user2@mail.com",
    username: "user2",
    password: hashedPassword,
  });

  await user1.save();
  await user2.save();

  const chatroom = new Chatroom({
    users: [user1._id, user2._id],
  });

  await chatroom.save();

  const message = new Message({
    sender: user1._id,
    content: "Hello from user1 to user2!",
    chatroom: chatroom._id,
  });

  await message.save();

  console.log("Database seeded!");
  mongoose.connection.close();
};

seedDatabase().catch((err) => {
  console.error(err);
  mongoose.connection.close();
});
