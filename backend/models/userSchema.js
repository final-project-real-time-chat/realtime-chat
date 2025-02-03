import { Schema, model } from "mongoose";

const userSchema = new Schema(
  {
    email: { type: String, required: true, unique: true },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    // status: {
    //   type: String,
    //   required: true,
    //   enum: ["Online", "Offline"],
    //   default: "Offline",
    // },
  },
  { timestamps: true }
);

const User = model("User", userSchema);
export default User;
