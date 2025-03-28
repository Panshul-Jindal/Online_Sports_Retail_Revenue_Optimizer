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
      const { name, price, description, category, sellerId } = req.body;

      const query = `
        INSERT INTO Products (name, selling_price, description, category, seller_id)
        VALUES ($1, $2, $3, $4, $5) RETURNING *;
      `;
      const values = [name, price, description, category, sellerId];

      const result = await pool.query(query, values);
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
      values.push(`%${query}%`);
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








  return router;
};