const express = require("express");
const router = express.Router();
// const Chat = require("../models/Chat");
const axios = require("axios");
const { v4: uuidv4 } = require("uuid");

// Start a new session
router.post("/start", async (req, res) => {
  try {
    const sessionId = uuidv4();
    res.json({ sessionId });
  } catch (error) {
    console.error("Error starting session:", error);
    res.status(500).json({ error: "Failed to start session" });
  }
});

// Handle chatbot messages
router.post("/message", async (req, res) => {
    console.log ("Message received");
  const { sessionId, message } = req.body;

  if (!sessionId || !message) {
    return res.status(400).json({ error: "Session ID and message are required" });
  }

  // Call external AI model API (OpenAI GPT example)
  try {
    const aiResponse = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4",
        messages: [{ role: "user", content: message }],
      },
      {
        headers: {
          Authorization: `Bearer YOUR_API_KEY`, // Replace YOUR_API_KEY with the actual API key
        },
      }
    );

    const botMessage = aiResponse.data.choices[0].message.content;

    // Save to database (optional)
    const chatSession = await Chat.findOneAndUpdate(
      { sessionId },
      {
        $push: {
          messages: [
            { sender: "user", message },
            { sender: "bot", message: botMessage },
          ],
        },
      },
      { upsert: true, new: true }
    );

    res.json({ message: botMessage });
  } catch (error) {
    console.error("Error communicating with AI model:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to process message" });
  }
});

module.exports = router;
