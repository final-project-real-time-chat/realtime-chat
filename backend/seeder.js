import mongoose, { Types } from "mongoose";
import dotenv from "dotenv";
import User from "./models/userSchema.js";
import Chatroom from "./models/chatroomSchema.js";
import Message from "./models/messageSchema.js";

dotenv.config();

mongoose.connect(process.env.MONGODB_URI);

const seedDatabase = async () => {
  await mongoose.connection.dropDatabase();

  const user1 = new User({
    email: "user1@mail.com",
    username: "user1",
    password: "password1",
  });
  const user2 = new User({
    email: "user2@mail.com",
    username: "user2",
    password: "password2",
  });
  const user3 = new User({
    email: "user3@mail.com",
    username: "user3",
    password: "password3",
  });
  const user4 = new User({
    email: "user4@mail.com",
    username: "user4",
    password: "password4",
  });
  const user5 = new User({
    email: "user5@mail.com",
    username: "user5",
    password: "password5",
  });

  await user1.save();
  await user2.save();
  await user3.save();
  await user4.save();
  await user5.save();

  console.log(`
    ${user1}
    ${user2}
    ${user3}
    ${user4}
    ${user5}
    `);

  const chatroom1 = new Chatroom({
    users: [user1._id, user2._id],
  });

  const chatroom2 = new Chatroom({
    users: [user3._id, user4._id, user5._id],
  });

  await chatroom1.save();
  await chatroom2.save();

  console.log(`
    ${chatroom1}
    ${chatroom2}
    `);

  const message1 = new Message({
    senderId: user1._id,
    receiverIds: [user2._id],
    content: "Hello from user1 to user2!",
    chatId: chatroom1._id,
  });
  const message2 = new Message({
    senderId: user2._id,
    receiverIds: [user1._id],
    content: "Hello from user2 to user1!",
    chatId: chatroom1._id,
  });
  const message3 = new Message({
    senderId: user3._id,
    receiverIds: [user4._id, user5._id],
    content: "Hello from user3 to user4 and user5!",
    chatId: chatroom2._id,
  });
  const message4 = new Message({
    senderId: user4._id,
    receiverIds: [user3._id, user5._id],
    content: "Hello from user4 to user3 and user5!",
    chatId: chatroom2._id,
  });

  const message5 = new Message({
    senderId: user5._id,
    receiverIds: [user3._id, user4._id],
    content: "Hello from user5 to user3 and user4!",
    chatId: chatroom2._id,
  });

  await message1.save();
  await message2.save();
  await message3.save();
  await message4.save();
  await message5.save();

  console.log(`
    ${message1}
    ${message2}
    ${message3}
    ${message4}
    ${message5}
    `);

  console.log("Database seeded!");
  mongoose.connection.close();
};

seedDatabase().catch((err) => {
  console.error(err);
  mongoose.connection.close();
});
