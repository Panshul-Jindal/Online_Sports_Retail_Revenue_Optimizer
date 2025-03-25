const express = require("express");
const Product = require("../models/Product");
const router = express.Router();

// Route to add a product
router.post("/add", async (req, res) => {
  try {
    const { name, price, description, category, sellerId } = req.body;

    const newProduct = new Product({ name, price, description, category, sellerId });
    await newProduct.save();

    res.status(201).json({ message: "Product added successfully!", product: newProduct });
  } catch (error) {
    console.error("Error adding product:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Route to fetch all products with optional search and category filter
router.get("/search", async (req, res) => {
    const { query, categories } = req.query;
    const filters = {};
  
    if (query) {
      filters.name = { $regex: query, $options: "i" }; // Case-insensitive search
    }
    if (categories) {
      filters.category = { $in: categories.split(",") };
    }
  
    try {
      const products = await Product.find(filters).populate("sellerId");
      res.status(200).json(products);
    } catch (error) {
      res.status(500).json({ message: "Error fetching products" });
    }
  });
  
router.get("/categories", async (req, res) => {
    try {
      const categories = await Product.distinct("category");
      res.status(200).json(categories);
    } catch (error) {
      res.status(500).json({ message: "Error fetching categories" });
    }
  });
  
// Route to fetch product by ID
router.get("/:productId", async (req, res) => {
  const { productId } = req.params;
  if (!productId) {
    return res.status(400).json({ message: "Product ID is required" });
  }
  try {
    const product = await Product.findById(productId).populate("sellerId");
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: "Error fetching product details" });
  }
});

module.exports = router;
