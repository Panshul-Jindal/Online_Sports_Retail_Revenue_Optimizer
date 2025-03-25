const mongoose = require("mongoose");
const crypto = require("crypto");

const orderSchema = new mongoose.Schema({
  transactionId: { type: String, required: true },
  buyerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  sellerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
  amount: { type: Number, required: true },
  hashedOTP: { type: String, required: true },
  status: { type: String, enum: ["Pending", "Delivered"], default: "Pending" },
});

module.exports = mongoose.model("Order", orderSchema);
