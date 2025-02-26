// import mongoose, { Types } from "mongoose";
// import bcrypt from "bcrypt";
// import dotenv from "dotenv";
// import User from "./models/userSchema.js";
// import Chatroom from "./models/chatroomSchema.js";
// import Message from "./models/messageSchema.js";
// import { connectDB } from "./db.js";

// dotenv.config();

// connectDB();

// const seedDatabase = async () => {
//   await mongoose.connection.dropDatabase();

//   const hashedPassword = await bcrypt.hash("123456", 12);

//   const user1 = new User({
//     email: "user1@mail.com",
//     username: "user1",
//     password: hashedPassword,
//   });

//   const user2 = new User({
//     email: "user2@mail.com",
//     username: "user2",
//     password: hashedPassword,
//   });

//   const user3 = new User({
//     email: "user3@mail.com",
//     username: "user3",
//     password: hashedPassword,
//   });

//   await user1.save();
//   await user2.save();
//   await user3.save();

//   const chatroom1 = new Chatroom({
//     users: [user1._id, user2._id],
//     lastSeen: new Map([
//       [user1._id.toString(), new Date(0)],
//       [user2._id.toString(), new Date(0)],
//     ]),
//   });

//   const chatroom2 = new Chatroom({
//     users: [user1._id, user3._id],
//     lastSeen: new Map([
//       [user1._id.toString(), new Date(0)],
//       [user3._id.toString(), new Date(0)],
//     ]),
//   });

//   await chatroom1.save();
//   await chatroom2.save();

//   const message1 = new Message({
//     sender: user1._id,
//     content: "send from user1 to user2!",
//     chatroom: chatroom1._id,
//   });

//   const message2 = new Message({
//     sender: user1._id,
//     content: "send from user1 to user3!",
//     chatroom: chatroom2._id,
//   });

//   await message1.save();
//   await message2.save();

//   console.log("Database seeded!");
//   mongoose.connection.close();
// };

// seedDatabase().catch((err) => {
//   console.error(err);
//   mongoose.connection.close();
// });

import mongoose, { Types } from "mongoose";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import User from "./models/userSchema.js";
import Chatroom from "./models/chatroomSchema.js";
import Message from "./models/messageSchema.js";
import { connectDB } from "./db.js";

dotenv.config();

connectDB();

const seedDatabase = async () => {
  await mongoose.connection.dropDatabase();

  const hashedPassword = await bcrypt.hash("123456", 12);

  const users = [];
  for (let i = 1; i <= 100; i++) {
    const user = new User({
      email: `user${i}@mail.com`,
      username: `user${i}`,
      password: hashedPassword,
    });
    users.push(user);
  }

  await User.insertMany(users);

  const chatrooms = [];
  for (let i = 0; i < users.length; i++) {
    for (let j = i + 1; j < users.length && j < i + 20; j++) {
      const chatroom = new Chatroom({
        users: [users[i]._id, users[j]._id],
        lastSeen: new Map([
          [users[i]._id.toString(), new Date(0)],
          [users[j]._id.toString(), new Date(0)],
        ]),
      });
      chatrooms.push(chatroom);
    }
  }

  await Chatroom.insertMany(chatrooms);

  const messages = [];
  for (let i = 0; i < users.length; i++) {
    const userChatrooms = chatrooms.filter((room) =>
      room.users.includes(users[i]._id)
    );

    for (let j = 0; j < 500; j++) {
      const chatroom =
        userChatrooms[Math.floor(Math.random() * userChatrooms.length)];
      const receiver = chatroom.users.find(
        (userId) => !userId.equals(users[i]._id)
      );

      const message = new Message({
        sender: users[i]._id,
        content: `Message ${j + 1} from user${i + 1} to user${
          users.findIndex((user) => user._id.equals(receiver)) + 1
        }!`,
        chatroom: chatroom._id,
      });
      messages.push(message);
    }
  }

  await Message.insertMany(messages);

  console.log("Database seeded!");
  mongoose.connection.close();
};

seedDatabase().catch((err) => {
  console.error(err);
  mongoose.connection.close();
});
