import express from "express";
import User from "../models/userSchema.js";
import bcrypt from "bcrypt";

const router = express.Router();

/** USER REGISTER AUTH */
router.post("/auth-register", async (req, res) => {
  const { email } = req.body;
  const existingEmail = await User.findOne({ email });
  if (existingEmail) {
    return res.status(409).json({ errorMessage: "Email already taken" });
  }
  // TODO => SEND EMAIL with a link to "/register" (included user email)

  res.status(200).json({ message: "Email is available" });
});

/** USER REGISTER */
router.post("/register", async (req, res) => {
  try {
    const { email, username, password } = req.body;
    const existingUser = await User.findOne({ username });

    if (existingUser) {
      return res.status(409).json({ errorMessage: "Username already taken" });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const newUser = new User({ email, username, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: "User registered successfully", newUser });
  } catch (error) {
    res.status(500).json({ errorMessage: "Internal server error" });
  }
});

/** USER LOGIN */
router.post("/login", async (req, res) => {
  try {
    // TODO => LOGIN: using username and password
    const { email, username, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ errorMessage: "Invalid username or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ errorMessage: "Invalid username or password" });
    }

    req.session.user = { id: user._id, username: user.username };
    res.json({ message: "User logged in successfully", user: req.session.user });
  } catch (error) {
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
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const foundUser = await User.findById(id);
    if (!foundUser) {
      return res.status(404).json({ errorMessage: "User not found" });
    }

    await User.findByIdAndDelete(id);
    req.session.destroy((err) => {
      if (err) {
        return res
          .status(500)
          .json({ errorMessage: "Failed to delete user session" });
      }
      res.json({ message: "User deleted successfully" });
    });
  } catch (error) {
    res.status(500).json({ errorMessage: "Internal server error" });
  }
});

export default router;
