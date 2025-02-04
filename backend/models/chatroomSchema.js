import { Schema, model } from "mongoose";

const chatroomSchema = new Schema(
  {
    users: [{ type: Schema.Types.ObjectId, ref: "User" }],
    invitedUsers: [{ type: Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

const Chatroom = model("Chatroom", chatroomSchema);
export default Chatroom;
