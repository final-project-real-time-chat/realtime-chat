import express from "express";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import nodemailer from "nodemailer";

import User from "../models/userSchema.js";

dotenv.config();

const router = express.Router();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendVerificationEmail = async (userEmail, verificationKey) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: userEmail,
    subject: "Email Verification",
    text: `Please verify your email by using the following key: ${verificationKey}`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Verification email sent successfully");
  } catch (error) {
    console.error("Error sending verification email:", error);
  }
};

/** USER REGISTER */
router.post("/register", async (req, res) => {
  try {
    const { email, username, password } = req.body;
    const existingUser = await User.findOne({ username });

    if (existingUser) {
      return res.status(409).json({ errorMessage: "Username already taken" });
    }

    const existingEmail = await User.findOne({ email });

    if (existingEmail) {
      return res.status(409).json({ errorMessage: "Email already taken" });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const newUser = new User({
      email,
      username,
      password: hashedPassword,
    });
    await newUser.save();

    const user = await User.findOne({ email });

    const verificationKey = user.verificationKey;

    await sendVerificationEmail(email, verificationKey);

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ errorMessage: "Internal server error" });
  }
});

/** USER REGISTER-VERIFICATION */
router.post("/register/verify", async (req, res) => {
  try {
    const { email, key } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(409).json({ errorMessage: "Email does not exist" });
    }

    if (user.isVerified) {
      return res
        .status(400)
        .json({ message: "Your email is already verified" });
    }

    if (user.verificationKey !== key) {
      return res.status(409).json({
        message: "Verification failed",
        isVerified: user.isVerified,
      });
    }

    await User.updateOne(
      { email },
      { $set: { isVerified: true }, $unset: { verificationKey: "" } }
    );

    const updatedUser = await User.findOne({ email });

    res.json({
      message: "User verified successfully",
      isVerified: updatedUser.isVerified,
    });
  } catch (error) {
    res.status(500).json({ errorMessage: "Internal server error" });
  }
});

/** USER LOGIN */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ errorMessage: "Invalid email or password" });
    }

    if (!user.isVerified) {
      return res.json({
        message: "Your email is not verified",
        isVerified: user.isVerified,
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ errorMessage: "Invalid email or password" });
    }

    req.session.user = { id: user._id, username: user.username };
    res.json({
      message: "User logged in successfully",
      user: req.session.user,
      isVerified: user.isVerified,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ errorMessage: "Internal server error" });
  }
});

/** GET CURRENT USER */
router.get("/current", async (req, res) => {
  try {
    if (!req.session.user) {
      return res.status(401).json({ errorMessage: "Not authenticated" });
    }

    const user = await User.findById(req.session.user.id);
    if (!user) {
      return res.status(404).json({ errorMessage: "User not found" });
    }

    res.json({ user });
  } catch (error) {
    console.error("Error fetching current user:", error);
    res.status(500).json({ errorMessage: "Internal server error" });
  }
});

/** USER LOGOUT */
router.get("/logout", async (req, res) => {
  try {
    req.session.destroy((err) => {
      if (err) {
        console.error("Error destroying session:", err);
        return res.status(500).json({ errorMessage: "Internal server error" });
      }
      res.clearCookie("connect.sid");
      res.json({ message: "Logout successful" });
    });
  } catch (error) {
    console.error("Error during logout:", error);
    res.status(500).json({ errorMessage: "Internal server error" });
  }
});

/** GET ALL USERS */
router.get("/", async (req, res) => {
  try {
    const users = await User.find({});
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
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
router.delete("/delete", async (req, res) => {
  const userId = req.session.user.id;

  try {
    const deletedUser = await User.findByIdAndDelete(userId);

    if (!deletedUser) {
      return res.status(404).json({ errorMessage: `user not found` });
    }

    res.json({ message: `user has been deleted successfully` });
  } catch (error) {
    res.status(500).json({ errorMessage: "Internal server error" });
  }
});

export default router;
