const User = require("../models/User");
const Gym = require("../models/GymSchema");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.register = async (req, res) => {
  try {
    const { name, email, password, role, gymDetails, gymId } = req.body;

    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: "User already exists. Please login.",
      });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new user object
    const user = new User({
      name,
      email,
      password: hashedPassword,
      role,
    });

    let gym = null;

    // If the role is gymOwner, create a gym and assign the gymId
    if (role === "gymOwner" && gymDetails) {
      gym = await Gym.create({
        ...gymDetails,
        owner: user._id,
      });

      user.gymId = gym._id; // Assign the created gym's ID to the user
    }

    // If gymId is provided (e.g., member joining an existing gym), assign it
    if (role === "member" && gymId) {
      const existingGym = await Gym.findById(gymId);
      if (!existingGym) {
        return res.status(404).json({
          success: false,
          error: "Gym not found. Please provide a valid gym ID.",
        });
      }
      user.gymId = gymId; // Assign the gymId to the user
    }

    // Save the user to the database
    await user.save();

    res.status(201).json({
      success: true,
      data: {
        user,
        ...(gym && { gym }), // Include gym details if it was created
      },
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({
      success: false,
      error: "Server error: " + error.message,
    });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find the user by email
    const user = await User.findOne({ email: email }).lean();
    if (!user) {
      return res.status(400).json({ message: "User does not exist" });
    }

    // Verify the password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Incorrect password" });
    }

    // Fetch the latest gymId in case it was updated
    const updatedUser = await User.findById(user._id).select("gymId");

    // Generate JWT token
    const token = jwt.sign(
      {
        userId: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        gymId: updatedUser.gymId || null, // Include gymId in the token
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        gymId: updatedUser.gymId || null, // Include gymId in the response
      },
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Error during login" });
  }
};

exports.verifyToken = async (req, res) => {
  try {
    // Find the user by ID
    const user = await User.findById(req.user.userId).select("name email role gymId");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      gymId: user.gymId, // Include gymId in the response
    });
  } catch (error) {
    console.error("Verification error:", error);
    res.status(500).json({ message: "Error while verifying token" });
  }
};
