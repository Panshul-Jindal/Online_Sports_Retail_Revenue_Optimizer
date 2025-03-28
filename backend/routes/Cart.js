const express = require("express");
const router = express.Router();
// const Product = require("../models/Product"); // Import your product model
// const User = require("../models/User"); // Import your user model
const Cookies = require('cookies'); // Import cookies package

// Add item to cart
router.post("/add", async (req, res) => {
  const { userId, productId } = req.body;

  try {
    const user = await User.findById(userId);
    const product = await Product.findById(productId);

    if (!user || !product) {
      return res.status(400).json({ message: "User or product not found" });
    }
    // Check if the buyer is the same as the seller
    if (userId === product.sellerId.toString()) {
      return res.status(400).json({ message: "You cannot buy your own product" });
    }
    // Check if the product is already in the cart
    if (user.cart.includes(productId)) {
      return res.status(400).json({ message: "Item already in cart" });
    }

    // Add product to user's cart
    user.cart.push(productId);
    await user.save();

    res.status(200).json({ message: "Item added to cart", cart: user.cart });
  } catch (error) {
    console.error("Error adding to cart:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Get user's cart
router.get("/mycart", async (req, res) => {
  const cookies = new Cookies(req, res);  // Initialize cookies from request and response
  const userId = cookies.get('userId');  // Get userId from cookie
  
   console.log(userId);
  if (!userId) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  try {
    const user = await User.findById(userId).populate("cart");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (!user.cart || user.cart.length === 0) {
      return res.status(200).json({ cart: [] }); // Empty cart case
    }

    res.status(200).json({ cart: user.cart });
  } catch (error) {
    console.error("Error retrieving cart:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});


router.delete("/remove", async (req, res) => {
  const cookies = new Cookies(req, res);  // Initialize cookies from request and response
  const userId = cookies.get('userId');  // Get userId from cookie
  const { productId } = req.body;  // Destructure productId from the request body

  console.log("UserId:", userId); 
  console.log("ProductId:", productId);

  if (!userId || !productId) {
    return res.status(400).json({ message: "User ID and Product ID are required" });
  }

  try {
    // Find the user from the database
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the product exists in the user's cart
    if (!user.cart.includes(productId)) {
      return res.status(404).json({ message: "Item not found in cart" });
    }

    // Remove product from user's cart
    user.cart = user.cart.filter((item) => item.toString() !== productId);
    await user.save(); // Save updated user

    // Return the updated cart
    res.status(200).json({ message: "Item removed from cart", cart: user.cart });
  } catch (error) {
    console.error("Error removing from cart:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});


module.exports = router;
