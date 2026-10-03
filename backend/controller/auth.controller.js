import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const registerUser = async (req, res) => {
  const { username, email, password } = req.body;
  if (!username) {
    return res
      .status(400)
      .json({ success: false, message: "Please Enter Username" });
  }
  if (!email) {
    return res
      .status(400)
      .json({ success: false, message: "Please Enter Valid Email" });
  }
  if (!password) {
    return res
      .status(400)
      .json({ success: false, message: "Please Enter Valid Password" });
  }
  try {
    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
      return res
        .status(409)
        .json({ success: false, message: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, email, password: hashedPassword });

    await newUser.save();
    res.status(201).json({
      success: true,
      user: {
        username: newUser.username,
        email: newUser.email,
        userId: newUser._id,
      },
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Failed to create your account" });
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "E-Mail doesn't exist" });
    }
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res
        .status(401)
        .json({ success: false, message: "Incorrect Password" });
    }
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    return res
      .status(200)
      .json({ success: true, message: "Logged in successfully", token: token });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};
