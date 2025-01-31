const User = require("../models/User");
const Gym = require("../models/GymSchema");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

require("dotenv").config();

exports.register = async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    const existingUser = await User.findOne({ email });

    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    if (typeof password !== 'string') {
      return res.status(400).json({ message: "Invalid password format" });
    }


    let gym = null;

    if(role === "gymOwner" && gymDetails){

      gym = new Gym({
        name:gymDetails.name,
        owner: null,
        address:{
          street: gymDetails.address.street,
          city: gymDetails.address.city,
          state: gymDetails.address.state,
          zipCode: gymDetails.address.zipCode
        },
        contact:{
          phone: gymDetails.contact.phone,
          email: gymDetails.contact.email
        },
        amenities: gymDetails.amenities || [],
        operatingHours:{
          openTime:gymDetails.operatingHours.openTime,
          closeTime:gymDetails.operatingHours.closeTime,
          daysOpen: gymDetails.operatingHours.daysOpen || []
        },
        memberShipPlans:gymDetails.memberShipPlans || []
      });

      await gym.save();

    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,
      password: hashedPassword,
      role,
      gym:gym ? gym._id : null
    });

    if(gym){
      gynm.owner = user._id;
      await gym.save();
    }

    await user.save();


    if(email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD){
      user.role = "admin";
      await user.save();
    }
    res.status(201).json({ 
      message: "User created successfully", 
      userId: user._id,
      gymId: gym ? gym._id : null
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error during registration" });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email: email });

    if (!user) {
      return res.status(400).json({ message: "User does not exist" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Incorrect password" });
    }

    const token = jwt.sign(
      {
        userId: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    res.json({
        token,
        user:{
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role
        },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error during login" });
  }
};


exports.verifyToken = async (req, res) => {
    try {
      const user = await User.findById(req.user.userId).select("name email role");
  
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      res.json({
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      });
    } catch (error) {
      console.error("Verification error:", error);
      res.status(500).json({ message: "Error while verifying token" });
    }
  };