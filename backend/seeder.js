import mongoose, { Types } from "mongoose";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import User from "./models/userSchema.js";
import Chatroom from "./models/chatroomSchema.js";
import Message from "./models/messageSchema.js";

dotenv.config();

mongoose.connect(process.env.MONGODB_URI);

const seedDatabase = async () => {
  await mongoose.connection.dropDatabase();

  const hashedPassword = await bcrypt.hash("123", 12);

  const user1 = new User({
    email: "1@m.de",
    username: "1",
    password: hashedPassword,
  });

  const user2 = new User({
    email: "2@m.de",
    username: "2",
    password: hashedPassword,
  });

  const user3 = new User({
    email: "3@m.de",
    username: "3",
    password: hashedPassword,
  });

  const user4 = new User({
    email: "4@m.de",
    username: "4",
    password: hashedPassword,
  });

  await user1.save();
  await user2.save();
  await user3.save();
  await user4.save();

  const chatroom1 = new Chatroom({
    users: [user1._id, user2._id],
  });

  const chatroom2 = new Chatroom({
    users: [user1._id, user3._id],
  });

  // const chatroom3 = new Chatroom({
  //   users: [user2._id, user1._id],
  // });

  const chatroom4 = new Chatroom({
    users: [user3._id, user4._id],
  });

  await chatroom1.save();
  await chatroom2.save();
  // await chatroom3.save();
  await chatroom4.save();

  const message1 = new Message({
    sender: user1._id,
    content: "Hello from user1 to user2!",
    chatroom: chatroom1._id,
  });

  const message2 = new Message({
    sender: user1._id,
    content: "Hello from user1 to user3!",
    chatroom: chatroom2._id,
  });

  const message3 = new Message({
    sender: user2._id,
    content: "Hello from user2 to user1!",
    chatroom: chatroom1._id,
  });

  const message4 = new Message({
    sender: user3._id,
    content: "Hello from user3 to user4!",
    chatroom: chatroom4._id,
  });

  await message1.save();
  await message2.save();
  await message3.save();
  await message4.save();

  console.log("Database seeded!");
  mongoose.connection.close();
};

seedDatabase().catch((err) => {
  console.error(err);
  mongoose.connection.close();
});
