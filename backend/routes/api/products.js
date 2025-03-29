const express = require("express");

module.exports = (pool) => {
  const router = express.Router();

  // Route to fetch paginated products
  router.get("/", async (req, res) => {
    const { page = 1, limit = 20 } = req.query; // Default to page 1, 20 products per page
    const offset = (page - 1) * limit;

    try {
      const result = await pool.query(
        "SELECT * FROM Products ORDER BY product_id LIMIT $1 OFFSET $2",
        [limit, offset]
      );
      res.json(result.rows);
    } catch (error) {
      console.error("Error fetching products:", error);
      res.status(500).send("Error fetching products");
    }
  });

  // Route to add a product
  router.post("/add", async (req, res) => {
    try {
      const {
        name,
        brand,
        category,
        cost_price,
        selling_price,
        mrp,
        supplier_id,
   
      } = req.body;

      console.log(req.body)
  
      // Validate that MRP >= Selling Price
      if (parseFloat(mrp) < parseFloat(selling_price)) {
        return res.status(400).json({ message: "MRP must be greater than or equal to the Selling Price." });
      }
  
      // Fetch brand_id based on brand name
      const brandQuery = "SELECT brand_id FROM Brand WHERE name = $1";
      const brandResult = await pool.query(brandQuery, [brand]);
  
      if (brandResult.rows.length === 0) {
        console.log( "Brand not found");
        return res.status(400).json({ message: `Brand '${brand}' does not exist.` });
      }
      const brand_id = brandResult.rows[0].brand_id;
  
      // Fetch category_id based on category name
      const categoryQuery = "SELECT category_id FROM Categories WHERE name = $1";
      const categoryResult = await pool.query(categoryQuery, [category]);
  
      if (categoryResult.rows.length === 0) {
        console.log( "Category not found");
        return res.status(400).json({ message: `Category '${category}' does not exist.` });
      }
      const category_id = categoryResult.rows[0].category_id;
  
      // Check if supplier_id exists in the Suppliers table
      const supplierQuery = "SELECT supplier_id FROM Suppliers WHERE supplier_id = $1";
      const supplierResult = await pool.query(supplierQuery, [supplier_id]);
  
      if (supplierResult.rows.length === 0) {
        console.log("Supplier not found");
        return res.status(400).json({ message: `Supplier with ID '${supplier_id}' does not exist.` });
      }
  
      // Insert the product into the Products table
      const insertProductQuery = `
        INSERT INTO Products (
          name, brand_id, category_id, cost_price, selling_price, mrp, supplier_id
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING *;
      `;
      const values = [
        name,
        brand_id,
        category_id,
        cost_price,
        selling_price,
        mrp,
        supplier_id,

      ];
  
      const result = await pool.query(insertProductQuery, values);
      res.status(201).json({ message: "Product added successfully!", product: result.rows[0] });
    } catch (error) {
      console.error("Error adding product:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });


// To get categories

router.get("/categories", async (req, res) => {
  try {
    // Join products with categories to fetch category_id and category_name
    const query = `
        SELECT DISTINCT c.category_id, c.name
      FROM categories c  LIMIT 10
    `;
    const result = await pool.query(query);
    // console.log(result.rows);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ message: "Error fetching categories" });
  }
});

  // Route to fetch all products with optional search and category filter
  router.get("/search", async (req, res) => {
    const { query, categories } = req.query;
    let sqlQuery = `SELECT * FROM Products`;
    let conditions = [];
    let values = [];
    console.log("Query",query)
    console.log("Categories",categories)
    if (query) {
      conditions.push(`name ILIKE $${values.length + 1}`);
      values.push(`%${query.replace(/'/g, "")}%`);
    }
  
    if (categories) {
      const categoryArray = categories.split(",").map(Number);
      conditions.push(`category_id = ANY($${values.length + 1})`);
      values.push(categoryArray);
    }
  
    if (conditions.length) {
      sqlQuery += ` WHERE ` + conditions.join(" AND ");
    }
    
    console.log("Executed Query",sqlQuery)
    console.log("Values",values)
  //  console.log(pool.query("SELECT * FROM Products WHERE name ILIKE $1",[values]).rows)
    try {
      const { rows } = await pool.query(sqlQuery, values);
      res.status(200).json(rows);
    } catch (error) {
      console.error("Error fetching products:", error);
      res.status(500).json({ message: "Error fetching products" });
    }
  });



  // Route to fetch product by ID
  router.get("/:productId", async (req, res) => {
    const { productId } = req.params;
    if (!productId) {
      return res.status(400).json({ message: "Product ID is required" });
    }
    try {
      const query = "SELECT * FROM Products WHERE product_id = $1";
      const result = await pool.query(query, [productId]);

      if (result.rows.length === 0) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.status(200).json(result.rows[0]);
    } catch (error) {
      console.error("Error fetching product details:", error);
      res.status(500).json({ message: "Error fetching product details" });
    }
  });

  router.get("/:productId/reviews", async (req, res) => {
    const { productId } = req.params;
    const { page = 1, limit = 5 } = req.query; // Pagination parameters

    console.log("Searching for Reviews for Product ID:", productId);
  
    try {
      // Fetch reviews for the product with pagination
      const offset = (page - 1) * limit;
      const reviewsQuery = `
        SELECT r.user_id, r.rating, r.review_text, r.review_date, u.name AS user_name
        FROM customer_reviews r
        INNER JOIN users u ON r.user_id = u.user_id
        WHERE r.product_id = $1
        ORDER BY r.review_date DESC
        LIMIT $2 OFFSET $3
      `;
      const reviewsResult = await pool.query(reviewsQuery, [productId, limit, offset]);
  
      // Fetch the total number of reviews for the product
      const countQuery = "SELECT COUNT(*) FROM customer_reviews WHERE product_id = $1";
      const countResult = await pool.query(countQuery, [productId]);
      const totalReviews = parseInt(countResult.rows[0].count, 10);
  
      res.status(200).json({
        reviews: reviewsResult.rows,
        totalReviews,
        currentPage: parseInt(page, 10),
        totalPages: Math.ceil(totalReviews / limit),
      });
    } catch (error) {
      console.error("Error fetching reviews:", error);
      res.status(500).json({ message: "Error fetching reviews" });
    }
  });


// Route to add a review for a product
router.post("/:productId/reviews", async (req, res) => {
  const { productId } = req.params;
  const { userId, rating, review_text } = req.body;

  try {
    // Check if the user has already reviewed the product
    const existingReviewQuery = `
      SELECT * FROM Customer_Reviews WHERE user_id = $1 AND product_id = $2
    `;
    const existingReviewResult = await pool.query(existingReviewQuery, [userId, productId]);

    if (existingReviewResult.rows.length > 0) {
      return res.status(400).json({ message: "You have already reviewed this product." });
    }

    // Insert the new review into the Customer_Reviews table
    const insertReviewQuery = `
      INSERT INTO Customer_Reviews (user_id, product_id, rating, review_text)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    `;
    const reviewResult = await pool.query(insertReviewQuery, [userId, productId, rating, review_text]);

    res.status(201).json({ message: "Review added successfully!", review: reviewResult.rows[0] });
  } catch (error) {
    console.error("Error adding review:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});



  return router;
};