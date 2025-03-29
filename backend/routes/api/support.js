const express = require("express");


// Route to submit a customer support message

module.exports = (pool) =>{
  const router = express.Router();
  router.post("/submit", async (req, res) => {
    console.log(req.body);
    const { userId, message } = req.body;
  
    if (!userId || !message) {
      return res.status(400).json({ error: "User ID and message are required" });
    }
  
    try {
      const query = `
        INSERT INTO customer_support (user_id, message)
        VALUES ($1, $2)
        RETURNING *;
      `;
      const values = [userId, message];
      const result = await pool.query(query, values);
  
      res.status(201).json({ message: "Message submitted successfully", data: result.rows[0] });
    } catch (error) {
      console.error("Error submitting message:", error);
      res.status(500).json({ error: "Failed to submit message" });
    }
  });
  
  // Route to fetch all customer support messages
// Route to fetch all customer support messages or messages for a specific user
router.get("/messages", async (req, res) => {
  const { userId } = req.query; // Optional query parameter to filter by user ID

  try {
    let query = `
      SELECT cs.id, cs.user_id, u.name AS user_name, cs.message, cs.reply, cs.created_at, cs.replied_at
      FROM customer_support cs
      INNER JOIN users u ON cs.user_id = u.user_id
    `;
    const values = [];

    // If userId is provided, filter messages by user ID
    if (userId) {
      query += ` WHERE cs.user_id = $1`;
      values.push(userId);
    }

    query += ` ORDER BY cs.created_at DESC;`;

    const result = await pool.query(query, values);

    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({ error: "Failed to fetch messages" });
  }
});
  
  // Route to reply to a customer support message
  router.post("/reply", async (req, res) => {
    const { messageId, reply } = req.body;
  
    if (!messageId || !reply) {
      return res.status(400).json({ error: "Message ID and reply are required" });
    }
  
    try {
      const query = `
        UPDATE customer_support
        SET reply = $1, replied_at = CURRENT_TIMESTAMP
        WHERE id = $2
        RETURNING *;
      `;
      const values = [reply, messageId];
      const result = await pool.query(query, values);
  
      if (result.rows.length === 0) {
        return res.status(404).json({ error: "Message not found" });
      }
  
      res.status(200).json({ message: "Reply submitted successfully", data: result.rows[0] });
    } catch (error) {
      console.error("Error replying to message:", error);
      res.status(500).json({ error: "Failed to submit reply" });
    }
  });
  
  return router;
}

