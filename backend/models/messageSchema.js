import { Schema, model } from "mongoose";

const messageSchema = new Schema(
  {
    sender: { type: Schema.Types.ObjectId, ref: "User", required: true },
    chatroom: { type: Schema.Types.ObjectId, ref: "Chatroom", required: true },
    content: { type: String, required: true },
    image: String,
  },
  { timestamp: true }
);

const Message = model("Message", messageSchema);
export default Message;
