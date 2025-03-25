const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  age: { type: Number, required: true },
  contactNumber: { type: String, required: true },
  password: { type: String, required: true },
  cart: { type: [mongoose.Schema.Types.ObjectId], ref: 'Product', default: [] },  // Assuming 'Product' is another model
  sellerReviews: { type: [String], default: [] },  // Array of reviews
});

module.exports = mongoose.model("User", userSchema);
