const express = require("express");
const crypto = require("crypto");
const User = require("../models/User");
const Product = require("../models/Product");
const Order = require("../models/Order");

const router = express.Router();

router.post("/", async (req, res) => {
    const { userId, cartItems } = req.body;
  
    try {
      const user = await User.findById(userId).populate("cart");
  
      if (!user || user.cart.length === 0) {
        return res.status(400).json({ message: "Cart is empty or user not found." });
      }
  
      const orders = [];
      const otps = {}; // Store original OTPs for the response 
  
      for (const productId of cartItems) {
        const product = user.cart.find((item) => item._id.toString() === productId);
        if (!product) continue;
  
        const otp = generateOTP(); // Generate a random OTP
        const hashedOTP = crypto.createHash("sha256").update(otp).digest("hex");
  
        const order = new Order({
          transactionId: crypto.randomUUID(),
          buyerId: userId,
          sellerId: product.sellerId,
          productId: product._id,
          amount: product.price,
          hashedOTP,
        });
  
        await order.save();
        orders.push(order);
        otps[order._id] = otp; // Map order ID to original OTP
      }
  
      // Clear user's cart
      user.cart = [];
      await user.save();
  
      res.status(200).json({
        message: "Order placed successfully",
        orders,
        otps, // Include OTPs in the response
      });
    } catch (error) {
      console.error("Error placing order:", error);
      res.status(500).json({ message: "Error placing order" });
    }
  });
  
  // Utility function to generate OTP
  function generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
  }
  
router.get("/:userId", async (req, res) => {
    const { userId } = req.params;
  
    try {
      const orders = await Order.find({ buyerId: userId }).populate("productId sellerId");
      res.status(200).json({ orders });
    } catch (error) {
      console.error("Error fetching orders:", error);
      res.status(500).json({ message: "Error fetching orders" });
    }
  });
  
  router.get("/deliveries/:sellerId", async (req, res) => {
    const { sellerId } = req.params;
  
    try {
      const deliveries = await Order.find({ sellerId }).populate("productId buyerId");
      res.status(200).json({ deliveries });
    } catch (error) {
      console.error("Error fetching deliveries:", error);
      res.status(500).json({ message: "Error fetching deliveries" });
    }
  });
  

// Utility function to generate OTP
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
}

module.exports = router;
