const express = require("express");
const crypto = require("crypto");
const { request } = require("http");

module.exports = (pool) => {
  const router = express.Router();

  router.post("/", async (req, res) => {
    const { userId, cartItems } = req.body;

    console.log("Recieved Request", req.body);
    console.log("Recieved Request", req.body);

    try {
      // Check if the user exists
      const userQuery = "SELECT * FROM users WHERE user_id = $1";
      const userResult = await pool.query(userQuery, [userId]);

      if (userResult.rows.length === 0) {
        return res.status(404).json({ message: "User not found." });
      }

      if (cartItems.length == 0) {
        return res.status(404).json({ message: "Cart is Empty" });
      }

      // Calculate the total amount for the order
      const totalAmount = cartItems.reduce(
        (sum, item) => sum + Number(item.selling_price),
        0
      );
      const date = new Date().toISOString();

      // Insert a new order into the Orders table
      const insertOrderQuery = `
        INSERT INTO orders (user_id, order_date,total_amount, status)
        VALUES ($1, $2, $3, 'Completed')
        RETURNING order_id
      `;
      const orderResult = await pool.query(insertOrderQuery, [userId, date, totalAmount]);
      console.log(orderResult);

      const orderId = orderResult.rows[0].order_id;

      // Insert each product into the Order_Items table
      const insertOrderItemsQuery = `
        INSERT INTO order_items (order_id, product_id, quantity, selling_price)
        VALUES ($1, $2, $3, $4)
      `;
      for (const item of cartItems) {
        await pool.query(insertOrderItemsQuery, [
          orderId,
          item.product_id,
          1, // Assuming quantity is 1 for each product
          item.selling_price,
        ]);
      }

      // Clear the user's wishlist
      const clearWishlistQuery = "DELETE FROM wishlist WHERE user_id = $1";
      await pool.query(clearWishlistQuery, [userId]);

      res.status(200).json({
        message: "Order placed successfully",
        orderId,
        totalAmount,
      });
    } catch (error) {
      console.error("Error placing order:", error);
      res.status(500).json({ message: "Error placing order" });
    }
  });

  router.get("/:userId", async (req, res) => {
    const { userId } = req.params;

    try {
      const ordersQuery = `
        SELECT o.order_id, o.total_amount, o.status, oi.product_id, oi.quantity, oi.selling_price
        FROM orders o
        INNER JOIN order_items oi ON o.order_id = oi.order_id
        WHERE o.user_id = $1
      `;
      const ordersResult = await pool.query(ordersQuery, [userId]);

      res.status(200).json({ orders: ordersResult.rows });
    } catch (error) {
      console.error("Error fetching orders:", error);
      res.status(500).json({ message: "Error fetching orders" });
    }
  });

  router.get("/deliveries/:sellerId", async (req, res) => {
    const { sellerId } = req.params;

    try {
      const deliveriesQuery = `
        SELECT o.order_id, o.total_amount, o.status, oi.product_id, oi.quantity, oi.selling_price, u.user_id, u.name AS buyer_name
        FROM orders o
        INNER JOIN order_items oi ON o.order_id = oi.order_id
        INNER JOIN users u ON o.user_id = u.user_id
        WHERE oi.seller_id = $1
      `;
      const deliveriesResult = await pool.query(deliveriesQuery, [sellerId]);

      res.status(200).json({ deliveries: deliveriesResult.rows });
    } catch (error) {
      console.error("Error fetching deliveries:", error);
      res.status(500).json({ message: "Error fetching deliveries" });
    }
  });

  return router;
};
