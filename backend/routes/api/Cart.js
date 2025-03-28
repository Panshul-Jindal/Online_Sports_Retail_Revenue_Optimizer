const express = require("express");

// const Product = require("../models/Product"); // Import your product model
// const User = require("../models/User"); // Import your user model

const Cookies = require('cookies'); // Import cookies package

// Add item to cart

module.exports=(pool) => {
  const router = express.Router();
  router.post("/add", async (req, res) => {
    console.log(req.body);
    const { userId, productId } = req.body;
  
    try {
      // Check if the user exists
      const userQuery = "SELECT * FROM users WHERE user_id = $1";
      const userResult = await pool.query(userQuery, [userId]);
  
      if (userResult.rows.length === 0) {
        return res.status(400).json({ message: "User not found" });
      }
  
      // Check if the product exists
      const productQuery = "SELECT * FROM products WHERE product_id = $1";
      const productResult = await pool.query(productQuery, [productId]);
  
      if (productResult.rows.length === 0) {
        return res.status(400).json({ message: "Product not found" });
      }
  
   
  
     
      // Check if the product is already in the wishlist
      const wishlistQuery =
        "SELECT * FROM wishlist WHERE user_id = $1 AND product_id = $2";
      const wishlistResult = await pool.query(wishlistQuery, [userId, productId]);
  
      if (wishlistResult.rows.length > 0) {
        return res.status(400).json({ message: "Item already in wishlist" });
      }
  
      // Add product to the wishlist
      const insertWishlistQuery =
        "INSERT INTO wishlist (user_id, product_id) VALUES ($1, $2)";
      await pool.query(insertWishlistQuery, [userId, productId]);
  
      res.status(200).json({ message: "Item added to wishlist" });
    } catch (error) {
      console.error("Error adding to wishlist:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // Get user's cart
  router.get("/mycart", async (req, res) => {
    const cookies = new Cookies(req, res); // Initialize cookies from request and response
    const userId = cookies.get("userId"); // Get userId from cookie
  
    console.log("UserId:", userId);
  
    if (!userId) {
      return res.status(401).json({ message: "Not authenticated" });
    }
  
    try {
      // Query the wishlist table to get all product IDs for the user
      const wishlistQuery = `
        SELECT product_id
        FROM wishlist
        WHERE user_id = $1
      `;
      const wishlistResult = await pool.query(wishlistQuery, [userId]);
  
      if (wishlistResult.rows.length === 0) {
        return res.status(200).json({ cart: [] }); // Empty cart case
      }
  
      // Extract product IDs from the query result
      const productIds = wishlistResult.rows.map((row) => row.product_id);
  
      // Query the products table to get details of the products in the cart
      const productsQuery = `
        SELECT *
        FROM products
        WHERE product_id = ANY($1)
      `;
      const productsResult = await pool.query(productsQuery, [productIds]);
  
      res.status(200).json({ cart: productsResult.rows });
    } catch (error) {
      console.error("Error retrieving cart:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  
  router.delete("/remove", async (req, res) => {
    const cookies = new Cookies(req, res); // Initialize cookies from request and response
    const userId = cookies.get("userId"); // Get userId from cookie
    const { productId } = req.body; // Destructure productId from the request body
  
    console.log("UserId:", userId);
    console.log("ProductId:", productId);
  
    if (!userId || !productId) {
      return res.status(400).json({ message: "User ID and Product ID are required" });
    }
  
    try {
      // Check if the user exists
      const userQuery = "SELECT * FROM users WHERE user_id = $1";
      const userResult = await pool.query(userQuery, [userId]);
  
      if (userResult.rows.length === 0) {
        return res.status(404).json({ message: "User not found" });
      }
  
      // Check if the product exists in the user's wishlist
      const wishlistQuery = `
        SELECT * 
        FROM wishlist 
        WHERE user_id = $1 AND product_id = $2
      `;
      const wishlistResult = await pool.query(wishlistQuery, [userId, productId]);
  
      if (wishlistResult.rows.length === 0) {
        return res.status(404).json({ message: "Item not found in wishlist" });
      }
  
      // Remove the product from the wishlist
      const deleteQuery = `
        DELETE FROM wishlist 
        WHERE user_id = $1 AND product_id = $2
      `;
      await pool.query(deleteQuery, [userId, productId]);
  
      // Return the updated wishlist
      const updatedWishlistQuery = `
        SELECT product_id 
        FROM wishlist 
        WHERE user_id = $1
      `;
      const updatedWishlistResult = await pool.query(updatedWishlistQuery, [userId]);
  
      const updatedCart = updatedWishlistResult.rows.map((row) => row.product_id);
  
      res.status(200).json({ message: "Item removed from wishlist", cart: updatedCart });
    } catch (error) {
      console.error("Error removing from wishlist:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  return router;
}




