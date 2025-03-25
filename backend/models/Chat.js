const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema({
  sessionId: { type: String, required: true },
  messages: [
    {
      sender: { type: String, enum: ["user", "bot"], required: true },
      message: { type: String, required: true },
      timestamp: { type: Date, default: Date.now },
    },
  ],
});

module.exports = mongoose.model("Chat", chatSchema);
