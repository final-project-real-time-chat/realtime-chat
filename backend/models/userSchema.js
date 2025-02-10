import { Schema, model } from "mongoose";

const userSchema = new Schema(
  {
    email: { type: String, required: true, unique: true },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isVerified: { type: Boolean, required: true, default: false },
    verificationKey: {
      type: String,
      default: () =>
        Math.floor(Math.random() * 1_000_000 + 1)
          .toString()
          .padStart(6, "0"),
    },
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
