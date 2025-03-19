import React, { useState } from "react";
import axios from "axios";
import Navbar from "./Navbar/Navbar";
import Cookies from "js-cookie"; // Import js-cookie for cookie handling
import "./Sell.css";

const SellPage = () => {
  const [form, setForm] = useState({
    name: "",
    price: "",
    description: "",
    category: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const sellerId = Cookies.get("userId"); // Fetch the user ID from cookies
      if (!sellerId) {
        alert("Seller ID not found. Please log in again.");
        return;
      }

      await axios.post("http://localhost:5000/products/add", {
        ...form,
        sellerId,
      });
      alert("Product added successfully!");
      setForm({ name: "", price: "", description: "", category: "" });
    } catch (error) {
      console.error("Error adding product:", error);
      alert("Failed to add product");
    }
  };

  return (
    <>
      <Navbar />
      <div className="sell-container">
        <h1>Sell a Product</h1>
        <form onSubmit={handleSubmit}>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Product Name"
            required
          />
          <input
            name="price"
            value={form.price}
            onChange={handleChange}
            placeholder="Price"
            type="number"
            required
          />
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Description"
            required
          />
          <input
            name="category"
            value={form.category}
            onChange={handleChange}
            placeholder="Category"
            required
          />
          <button type="submit">Sell</button>
        </form>
      </div>
    </>
  );
};

export default SellPage;
