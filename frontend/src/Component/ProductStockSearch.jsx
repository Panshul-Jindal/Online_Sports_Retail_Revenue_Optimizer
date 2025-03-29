import React, { useState } from "react";
import axios from "axios";

const ProductStockSearch = () => {
  const [productName, setProductName] = useState("");
  const [productStock, setProductStock] = useState(null);
  const [error, setError] = useState("");

  const handleSearch = async () => {
    if (!productName.trim()) {
      setError("Please enter a product name.");
      setProductStock(null);
      return;
    }

    try {
      const response = await axios.get("http://localhost:5000/api/admin/product-stock", {
        params: { productName },
      });
      setProductStock(response.data);
      setError("");
    } catch (err) {
      setProductStock(null);
      if (err.response && err.response.status === 404) {
        setError("Product not found.");
      } else {
        setError("Failed to fetch product stock.");
      }
    }
  };

  return (
    <div>
      <h2>Search Product Stock</h2>
      <div>
        <input
          type="text"
          placeholder="Enter product name"
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
        />
        <button onClick={handleSearch}>Search</button>
      </div>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {productStock && (
        <div>
          <h3>Product Stock Details</h3>
          <p>
            <strong>Product Name:</strong> {productStock.product_name}
          </p>
          <p>
            <strong>Current Stock:</strong> {productStock.current_stock}
          </p>
          <p>
            <strong>Low Stock Threshold:</strong> {productStock.low_stock_threshold}
          </p>
        </div>
      )}
    </div>
  );
};

export default ProductStockSearch;