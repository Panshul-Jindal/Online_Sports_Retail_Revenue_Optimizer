const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");
// const User = require("../models/User");
module.exports = (pool) => {
  const router = express.Router();

  /// Register Route
  router.post(
    "/register",
    [
      body("name").notEmpty().withMessage("Name is required."),
      body("email").isEmail().withMessage("Invalid email format."),
      body("password")
        .isLength({ min: 4 })
        .withMessage("Password must be at least 4 characters long."),
    ],
    async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { name, email, password, role } = req.body;

      try {
        // Check if the user already exists
        const existingUserQuery = "SELECT * FROM users WHERE email = $1";
        const existingUserResult = await pool.query(existingUserQuery, [email]);

        if (existingUserResult.rows.length > 0) {
          return res.status(400).json({ message: "User already exists." });
        }

        // Hash the password before saving
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert the new user into the database
        const insertUserQuery = `
          INSERT INTO users (name, email, password_hash, role)
          VALUES ($1, $2, $3, $4)
          RETURNING user_id;
        `;
        const insertUserValues = [name, email, hashedPassword, role];

        const newUserResult = await pool.query(insertUserQuery, insertUserValues);
        const newUserId = newUserResult.rows[0].user_id;

        console.log("User registered successfully");

        // Store the user ID in the session
        req.session.userId = newUserId; // Store the user ID in the session

        // Respond with a success message and user ID
        return res.status(201).json({
          message: "User registered successfully",
          userId: newUserId,
        });
      } catch (error) {
        console.error("Error registering user:", error);
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
        // Check if the user exists in the database
        const userQuery = "SELECT * FROM users WHERE email = $1";
        const userResult = await pool.query(userQuery, [email]);
  
        if (userResult.rows.length === 0) {
          return res.status(400).json({ message: "User does not exist." });
        }
  
        const user = userResult.rows[0];
  
        // Compare the provided password with the hashed password in the database
        const isPasswordValid = await bcrypt.compare(password, user.password_hash);
        if (!isPasswordValid) {
          return res.status(400).json({ message: "Invalid password." });
        }
  
        // Save user ID in session
        req.session.userId = user.user_id;
  
        res.status(200).json({
          message: "Login successful",
          userId: user.user_id,
          name: user.name,
          role: user.role,
        });
      } catch (error) {
        console.error("Error during login:", error);
        res.status(500).json({ message: "Internal server error." });
      }
    }
  );

  // Logout Route
  router.post("/logout", (req, res) => {
    res.clearCookie("token");
    res.status(200).json({ message: "Logout successful." });
  });

  // Protected Route Example
  router.get("/user/:userId", async (req, res) => {
    console.log("Request session:", req.session); // Debug: Check session data
    console.log("Requested userId:", req.params.userId);

    const { userId } = req.params;

    try {
      // Query the users table to fetch the user by ID
      const userQuery = "SELECT * FROM users WHERE user_id = $1";
      const userResult = await pool.query(userQuery, [userId]);

      if (userResult.rows.length === 0) {
        return res.status(404).json({ message: "User not found" });
      }

      // Respond with user data
      const user = userResult.rows[0];
      res.json({
        userId: user.user_id,
        name: user.name,
        email: user.email,
        role: user.role,
      });
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
      // Query the users table to fetch the user by session userId
      const userQuery = "SELECT * FROM users WHERE user_id = $1";
      const userResult = await pool.query(userQuery, [req.session.userId]);

      if (userResult.rows.length === 0) {
        return res.status(404).json({ message: "User not found" });
      }

      // Respond with user data
      const user = userResult.rows[0];
      res.json({
        userId: user.user_id,
        name: user.name,
        email: user.email,
        role: user.role,
      });
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Error fetching user data" });
    }
  });

  // PUT route to update user details
  router.put("/user/:userId", async (req, res) => {
    const { userId } = req.params;
    const { name } = req.body;
  
    try {
      // Check if the user exists
      const userQuery = "SELECT * FROM users WHERE user_id = $1";
      const userResult = await pool.query(userQuery, [userId]);
  
      if (userResult.rows.length === 0) {
        return res.status(404).json({ message: "User not found" });
      }
  
      // Update the user's details
      const updateUserQuery = `
        UPDATE users
        SET name = $1
        WHERE user_id = $2
        RETURNING user_id, name, email, role;
      `;
      const updatedUserResult = await pool.query(updateUserQuery, [
        name || userResult.rows[0].name, // Use the provided name or keep the existing one
        userId,
      ]);
  
      const updatedUser = updatedUserResult.rows[0];
  
      res.status(200).json({
        message: "User updated successfully",
        user: {
          userId: updatedUser.user_id,
          name: updatedUser.name,
          email: updatedUser.email,
          role: updatedUser.role,
        },
      });
    } catch (error) {
      console.error("Error updating user:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  return router;
};

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
