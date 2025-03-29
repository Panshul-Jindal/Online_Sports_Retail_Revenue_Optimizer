const express = require("express");

module.exports = (pool) => {
  const router = express.Router();

  router.get("/", (req, res) => {  res.send("Admin API is working!"); });

  // Route to get best-selling products
  router.get("/best-selling-products", async (req, res) => {
    try {
      const query = `
        SELECT p.name, SUM(oi.quantity) AS total_quantity_sold
        FROM order_items oi
        INNER JOIN products p ON oi.product_id = p.product_id
        GROUP BY p.name
        ORDER BY total_quantity_sold DESC
        LIMIT 10;
      `;
      const result = await pool.query(query);
      res.status(200).json(result.rows);
    } catch (error) {
      console.error("Error fetching best-selling products:", error);
      res.status(500).json({ error: "Failed to fetch best-selling products" });
    }
  });

  // Route to get low-stock products
  router.get("/low-stock-products", async (req, res) => {
    try {
      const query = `
        SELECT name, stock
        FROM products
        WHERE stock < 10
        ORDER BY stock ASC;
      `;
      const result = await pool.query(query);
      res.status(200).json(result.rows);
    } catch (error) {
      console.error("Error fetching low-stock products:", error);
      res.status(500).json({ error: "Failed to fetch low-stock products" });
    }
  });

  // Route to get total revenue
  router.get("/total-revenue", async (req, res) => {
    try {
      const query = `
        SELECT SUM(total_amount) AS total_revenue
        FROM orders
        WHERE status = 'Completed';
      `;
      const result = await pool.query(query);
      res.status(200).json(result.rows[0]);
    } catch (error) {
      console.error("Error fetching total revenue:", error);
      res.status(500).json({ error: "Failed to fetch total revenue" });
    }
  });

  // Route to get total number of products
  router.get("/total-products", async (req, res) => {
    try {
      const query = `
        SELECT COUNT(*) AS total_products
        FROM products;
      `;
      const result = await pool.query(query);
      res.status(200).json(result.rows[0]);
    } catch (error) {
      console.error("Error fetching total products:", error);
      res.status(500).json({ error: "Failed to fetch total products" });
    }
  });

  // Route to get total number of orders
  router.get("/total-orders", async (req, res) => {
    try {
      const query = `
        SELECT COUNT(*) AS total_orders
        FROM orders;
      `;
      const result = await pool.query(query);
      res.status(200).json(result.rows[0]);
    } catch (error) {
      console.error("Error fetching total orders:", error);
      res.status(500).json({ error: "Failed to fetch total orders" });
    }
  });

  // Route to fetch current month's sales revenue
  router.get("/current-month-sales", async (req, res) => {
    try {
      const query = `SELECT * FROM Current_Month_Sales;`;
      const result = await pool.query(query);
      res.status(200).json(result.rows[0]);
    } catch (error) {
      console.error("Error fetching current month's sales:", error);
      res.status(500).json({ error: "Failed to fetch current month's sales" });
    }
  });

  // Route to fetch yearly sales revenue
  router.get("/yearly-sales", async (req, res) => {
    try {
      const query = `SELECT * FROM Yearly_Sales;`;
      const result = await pool.query(query);
      res.status(200).json(result.rows[0]);
    } catch (error) {
      console.error("Error fetching yearly sales:", error);
      res.status(500).json({ error: "Failed to fetch yearly sales" });
    }
  });

  // Route to fetch inventory summary
  router.get("/inventory-summary", async (req, res) => {
    try {
      const query = `SELECT * FROM Inventory_Summary;`;
      const result = await pool.query(query);
      res.status(200).json(result.rows[0]);
    } catch (error) {
      console.error("Error fetching inventory summary:", error);
      res.status(500).json({ error: "Failed to fetch inventory summary" });
    }
  });

  // Route to fetch order status counts
  router.get("/order-status", async (req, res) => {
    try {
      const query = `SELECT * FROM Orders_Status_Count;`;
      const result = await pool.query(query);
      res.status(200).json(result.rows);
    } catch (error) {
      console.error("Error fetching order status counts:", error);
      res.status(500).json({ error: "Failed to fetch order status counts" });
    }
  });

  // Route to fetch best-selling products
  router.get("/best-selling-products-view", async (req, res) => {
    try {
      const query = `SELECT * FROM Best_Selling_Products;`;
      const result = await pool.query(query);
      res.status(200).json(result.rows);
    } catch (error) {
      console.error("Error fetching best-selling products:", error);
      res.status(500).json({ error: "Failed to fetch best-selling products" });
    }
  });

  // Route to fetch least-selling products
  router.get("/least-selling-products-view", async (req, res) => {
    try {
      const query = `SELECT * FROM Least_Selling_Products;`;
      const result = await pool.query(query);
      res.status(200).json(result.rows);
    } catch (error) {
      console.error("Error fetching least-selling products:", error);
      res.status(500).json({ error: "Failed to fetch least-selling products" });
    }
  });

  // Route to fetch low-stock products
  router.get("/low-stock-products-view", async (req, res) => {
    try {
      const query = `SELECT * FROM Low_Stock_Products;`;
      const result = await pool.query(query);
      res.status(200).json(result.rows);
    } catch (error) {
      console.error("Error fetching low-stock products:", error);
      res.status(500).json({ error: "Failed to fetch low-stock products" });
    }
  });

  // Route to fetch high-stock products
  router.get("/high-stock-products-view", async (req, res) => {
    try {
      const query = `SELECT * FROM High_Stock_Products;`;
      const result = await pool.query(query);
      res.status(200).json(result.rows);
    } catch (error) {
      console.error("Error fetching high-stock products:", error);
      res.status(500).json({ error: "Failed to fetch high-stock products" });
    }
  });






  // Optimizing Strategies

  // Route to fetch stock strategy suggestions
  router.get("/stock-strategies", async (req, res) => {
    try {
      const query = `
        SELECT sss.suggestion_id, p.name AS product_name,sss.product_id, sss.stock_change_reason, 
               sss.suggested_percentage_change, sss.suggested_start_date, 
               sss.suggested_end_date, sss.admin_decision, sss.decision_date
        FROM Stock_Strategy_Suggestions sss
        INNER JOIN Products p ON sss.product_id = p.product_id
        ORDER BY sss.suggested_start_date DESC;
      `;
      const result = await pool.query(query);
      res.status(200).json(result.rows);
    } catch (error) {
      console.error("Error fetching stock strategies:", error);
      res.status(500).json({ error: "Failed to fetch stock strategies" });
    }
  });



  // Route to handle admin decisions on stock strategies
router.post("/stock-strategies/decision", async (req, res) => {
    const { suggestionId, decision, productId, suggestedPercentageChange } = req.body;

    console.log(req.body);

    if (!suggestionId || !decision) {
        return res.status(400).json({ error: "Suggestion ID and decision are required" });
    }

    try {
        // Start a transaction
        await pool.query("BEGIN");

        // Update the Stock_Strategy_Suggestions table with the admin decision
        const query = `
            UPDATE Stock_Strategy_Suggestions
            SET admin_decision = $1, decision_date = CURRENT_TIMESTAMP
            WHERE suggestion_id = $2 RETURNING *;
        `;
        const values = [decision, suggestionId];
        const result = await pool.query(query, values);

        if (result.rows.length === 0) {
            await pool.query("ROLLBACK");
            return res.status(404).json({ error: "Suggestion not found" });
        }

        // If the decision is "Accepted", update the inventory low_stock_threshold
        if (decision == 'Accepted') {
            console.log("Percentage Change:", suggestedPercentageChange);
            console.log("Product ID:", productId);

            const numericPercentageChange = parseFloat(suggestedPercentageChange);
            if (isNaN(numericPercentageChange)) {
                await pool.query("ROLLBACK");
                return res.status(400).json({ error: "Invalid percentage change value" });
            }
            

            const newThresholdQuery = `
                UPDATE Inventory
                SET low_stock_threshold = low_stock_threshold * (1 + $1 / 100)
                WHERE product_id = $2 RETURNING *;
            `;
            console.log("Executing query:", newThresholdQuery, [numericPercentageChange, productId]);
            const thresholdResult = await pool.query(newThresholdQuery, [numericPercentageChange, productId]);

            console.log(thresholdResult.rows);

            if (thresholdResult.rows.length === 0) {
                await pool.query("ROLLBACK");
                return res.status(404).json({ error: "Product inventory not found" });
            }
        }

        // Commit the transaction
        await pool.query("COMMIT");

        res.status(200).json({ message: "Decision updated successfully", data: result.rows[0] });
    } catch (error) {
        // Rollback the transaction in case of an error
        await pool.query("ROLLBACK");
        console.error("Error updating stock strategy decision:", error);
        res.status(500).json({ error: "Failed to update stock strategy decision" });
    }
});


  // Route to fetch pricing strategy suggestions
  router.get("/pricing-strategies", async (req, res) => {
    try {
      const query = `
        SELECT pcs.request_id, p.name AS product_name, pcs.reason, 
               pcs.suggested_percentage, pcs.suggested_time_period, 
               pcs.admin_action, pcs.original_price, pcs.created_at
        FROM Price_Change_Strategy pcs
        INNER JOIN Products p ON pcs.product_id = p.product_id
        ORDER BY pcs.created_at DESC;
      `;
      const result = await pool.query(query);
      res.status(200).json(result.rows);
    } catch (error) {
      console.error("Error fetching pricing strategies:", error);
      res.status(500).json({ error: "Failed to fetch pricing strategies" });
    }
  });

  // Route to handle admin decisions on pricing strategies
router.post("/pricing-strategies/decision", async (req, res) => {
    const { requestId, decision, approvedPercentage, approvedTimePeriod } = req.body;
    console.log("Request Recieved" ,req.body);

    if (!requestId || !decision) {
        return res.status(400).json({ error: "Request ID and decision are required" });
    }

    try {



        // Start a transaction
        await pool.query("BEGIN");
        console.log("Approved Percentage", typeof(approvedPercentage));

        // If the decision is "Rejected", set approvedPercentage and approvedTimePeriod to null
        var values;
        if (decision === "Rejected") {
            approvedPercentage = null;
            approvedTimePeriod = null;
            values = [decision, approvedPercentage, approvedTimePeriod, requestId];

        }
        else{
            const numericApprovedPercentage = parseFloat(approvedPercentage);
            values = [decision, numericApprovedPercentage, approvedTimePeriod, requestId];
        }

      

        // Update the Price_Change_Strategy table
        const query = `
            UPDATE Price_Change_Strategy
            SET admin_action = $1, admin_approved_percentage = $2, 
                admin_approved_time_period = $3, revert_at = NOW() + $3
            WHERE request_id = $4 RETURNING *;
        `;
       
        const result = await pool.query(query, values);

        if (result.rows.length === 0) {
            await pool.query("ROLLBACK");
            return res.status(404).json({ error: "Pricing strategy not found" });
        }

        // If the decision is "Approved", update the product's selling price
        if (decision === "Approved") {

            const productId = result.rows[0].product_id;
            const originalPrice = result.rows[0].original_price;
            const newPrice = originalPrice * (1 + approvedPercentage / 100);
            console.log("newPrice", newPrice);

            const costPriceQuery = `
                SELECT cost_price
                FROM Products
                WHERE product_id = $1;
            `;

            if (newPrice >= 100000000) {
                await pool.query("ROLLBACK");
                return res.status(400).json({ error: "Calculated selling price exceeds the allowed limit." });
            }

            
            const costPriceResult = await pool.query(costPriceQuery, [productId]);

            if (costPriceResult.rows.length === 0) {
                await pool.query("ROLLBACK");
                return res.status(404).json({ error: "Product not found" });
            }

            const costPrice = costPriceResult.rows[0].cost_price;
            console.log("costPrice", costPrice);

            const updateProductQuery = `
                UPDATE Products
                SET selling_price = $1
                WHERE product_id = $2;
            `;
            await pool.query(updateProductQuery, [newPrice, productId]);
        }

        // Commit the transaction
        await pool.query("COMMIT");

        res.status(200).json({ message: "Decision updated successfully", data: result.rows[0] });
    } catch (error) {
        // Rollback the transaction in case of an error
        await pool.query("ROLLBACK");
        console.error("Error updating pricing strategy decision:", error);
        res.status(500).json({ error: "Failed to update pricing strategy decision" });
    }
});


router.get("/product-stock", async (req, res) => {
    const { productName } = req.query;
    console.log(req.body)
  
    if (!productName) {
      return res.status(400).json({ error: "Product name is required" });
    }
  
    try {
      const query = `
        SELECT p.name AS product_name, i.current_stock ,i.low_stock_threshold
        FROM Products p
        INNER JOIN Inventory i ON p.product_id = i.product_id
        WHERE LOWER(p.name) = LOWER($1);
      `;
      const result = await pool.query(query, [productName]);
  
      if (result.rows.length === 0) {
        console.log("Product not found");

        return res.status(404).json({ error: "Product not found" });
      }
  
      res.status(200).json(result.rows[0]);
    } catch (error) {
      console.error("Error fetching product stock:", error);
      res.status(500).json({ error: "Failed to fetch product stock" });

    }
  });



  return router;
};