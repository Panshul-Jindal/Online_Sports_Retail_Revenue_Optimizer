import React, { useState } from "react";
import axios from "axios";
import Navbar from "./Navbar/Navbar";
import Cookies from "js-cookie"; // Import js-cookie for cookie handling
import "./Sell.css";

const SellPage = () => {
  const [form, setForm] = useState({
    name: "",
    brand: "",
    category: "",
    cost_price: "",
    selling_price: "",
    mrp: "",
    supplier_id: "",
    // description: "",
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

      // Validate that MRP >= Selling Price
      if (parseFloat(form.mrp) < parseFloat(form.selling_price)) {
        alert("MRP must be greater than or equal to the Selling Price.");
        return;
      }

      await axios.post("http://localhost:5000/api/products/add", {
        ...form,
        sellerId,
      });
      alert("Product added successfully!");
      setForm({
        name: "",
        brand: "",
        category: "",
        cost_price: "",
        selling_price: "",
        mrp: "",
        supplier_id: "",
        // description: "",
      });
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
            name="brand"
            value={form.brand}
            onChange={handleChange}
            placeholder="Brand Name"
            required
          />
          <input
            name="category"
            value={form.category}
            onChange={handleChange}
            placeholder="Category Name"
            required
          />
          <input
            name="cost_price"
            value={form.cost_price}
            onChange={handleChange}
            placeholder="Cost Price"
            type="number"
            step="0.01"
            required
          />
          <input
            name="selling_price"
            value={form.selling_price}
            onChange={handleChange}
            placeholder="Selling Price"
            type="number"
            step="0.01"
            required
          />
          <input
            name="mrp"
            value={form.mrp}
            onChange={handleChange}
            placeholder="MRP"
            type="number"
            step="0.01"
            required
          />
          <input
            name="supplier_id"
            value={form.supplier_id}
            onChange={handleChange}
            placeholder="Supplier ID"
            type="number"
            required
          />
          {/* <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Description"
            required
          /> */}
          <button type="submit">Sell</button>
        </form>
      </div>
    </>
  );
};

export default SellPage;