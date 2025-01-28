import { Schema, model } from "mongoose";

const chatroomSchema = new Schema(
  {
    users: [{ type: Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamp: true }
);

const Chatroom = model("Chatroom", chatroomSchema);
export default Chatroom;
