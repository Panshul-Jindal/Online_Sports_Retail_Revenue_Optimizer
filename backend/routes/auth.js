const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");
// const User = require("../models/User");

const router = express.Router();
// const JWT_SECRET = "Paarth14#"; // Replace with a secure key

// // Middleware to protect routes
// const authenticateToken = (req, res, next) => {
//   const token = req.cookies.token;
//   if (!token)
//     return res.status(401).json({ message: "Access denied. Login required." });

//   try {
//     const verified = jwt.verify(token, JWT_SECRET);
//     req.user = verified;
//     next();
//   } catch (err) {
//     res.status(400).json({ message: "Invalid token." });
//   }
// };

/// Register Route
router.post(
  "/register",
  [
    body("firstName").notEmpty().withMessage("First name is required."),
    body("lastName").notEmpty().withMessage("Last name is required."),
    body("email")
      .isEmail()
      .withMessage("Invalid email format.")
      .matches(/@iiit.ac.in$/)
      .withMessage("Email must be from IIIT domain."),
    body("password")
      .isLength({ min: 4 })
      .withMessage("Password must be at least 4 characters long."),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { firstName, lastName, email, age, contactNumber, password } =
      req.body;

    try {
      // Check if the user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: "User already exists." });
      }

      // Hash the password before saving
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create a new user
      const newUser = new User({
        firstName,
        lastName,
        email,
        age,
        contactNumber,
        password: hashedPassword,
      });

      // Save the new user to the database
      await newUser.save();
      console.log("User registered successfully");

      // Store the user ID in the session
      req.session.userId = newUser._id; // Store the user ID in the session

      // Respond with a success message and user ID
      return res.status(201).json({
        message: "User registered successfully",
        userId: newUser._id,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error." });
    }
  }
);
// Login route
// Login Route
router.post(
  "/login",
  [body("email").isEmail(), body("password").notEmpty()],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ message: "User does not exist." });
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(400).json({ message: "Invalid password." });
      }

      // Save user ID in session (persisted even after restart if using a session store like MongoDB or Redis)
      req.session.userId = user._id;

      res.status(200).json({
        message: "Login successful",
        userId: user._id,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error." });
    }
  }
);
// Login Route
// router.post("/login", async (req, res) => {
//   const { email, password } = req.body;

//   try {
//     const user = await User.findOne({ email });
//     if (!user) return res.status(400).json({ message: "User does not exist." });

//     const isPasswordValid = await bcrypt.compare(password, user.password);
//     if (!isPasswordValid)
//       return res.status(401).json({ message: "Invalid credentials." });

//     const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
//       expiresIn: "7d",
//     });
//     res.cookie("token", token, {
//       httpOnly: true,
//       secure: true,
//       maxAge: 7 * 24 * 60 * 60 * 1000,
//     }); // 7 days
//     res.status(200).json({ message: "Login successful." });
//   } catch (error) {
//     res.status(500).json({ message: "Internal server error." });
//   }
// });

// Logout Route
router.post("/logout", (req, res) => {
  res.clearCookie("token");
  res.status(200).json({ message: "Logout successful." });
});

// Protected Route Example
router.get("/user/:userId", async (req, res) => {
  console.log("Request session:", req.session); // Debug: Check session data
  console.log("Requested userId:", req.params.userId);

  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user); // Respond with user data
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: "Error fetching user data" });
  }
});

router.get("/user/session", async (req, res) => {
  if (!req.session.userId) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  try {
    const user = await User.findById(req.session.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user); // Send the user data
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: "Error fetching user data" });
  }
});

// PUT route to update user details
router.put("/user/:userId", async (req, res) => {
  const { userId } = req.params;
  const { firstName, lastName, email, age, contactNumber } = req.body;

  try {
    // Find the user by ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update the user's details
    user.firstName = firstName || user.firstName;
    user.lastName = lastName || user.lastName;
    user.email = email || user.email; // Make sure to validate this if changing
    user.age = age || user.age;
    user.contactNumber = contactNumber || user.contactNumber;

    // Save the updated user data
    await user.save();

    res.status(200).json({ message: "User updated successfully", user: user });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
