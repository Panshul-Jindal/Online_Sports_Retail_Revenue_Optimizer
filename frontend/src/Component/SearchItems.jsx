import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "./Navbar/Navbar";
import "./Sell.css";
import { useNavigate } from "react-router-dom";

const SearchItems = () => {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch all products based on filters
    const fetchProducts = async () => {
      try {
        const queryParams = new URLSearchParams();
        if (search) queryParams.append("query", search);
        if (selectedCategories.length)
          queryParams.append("categories", selectedCategories.join(","));

        const response = await axios.get(
          `http://localhost:5000/api/products/search?${queryParams.toString()}`
        );
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, [search, selectedCategories]);

  useEffect(() => {
    // Fetch all unique categories for filtering
    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/products/categories"
        );
        console.log(response.data);
        setCategories(response.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  const toggleCategory = (categoryId) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleViewDetails = (productId) => {
    console.log(productId);
    if (!productId) {
      console.error("Product ID is undefined");
      return;
    }
    navigate(`/products/${productId}`);
  };

  return (
    <>
      <Navbar />

      <div className="search-container">
        <h1>Search Items</h1>
        <input
          type="text"
          placeholder="Search for items"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="categories">
          <h3>Filter by Categories</h3>
          {categories.map((cat) => (
            <label key={cat.category_id}>
              <input
                type="checkbox"
                value={cat.category_name}
                checked={selectedCategories.includes(cat.category_id)}
                onChange={() => toggleCategory(cat.category_id)}
              />
              {cat.category_name}
            </label>
          ))}
        </div>
        <div className="product-list">
          {products.map((product) => (
            <div key={product._id} className="product-card">
              <h2>{product.name}</h2>
              <p>Price: ₹{product.price}</p>
              <p>Category: {product.category}</p>
              <p>
                Seller: {product.sellerId.firstName} {product.sellerId.lastName}
              </p>
              <button onClick={() => handleViewDetails(product._id)}>
                View Details
              </button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default SearchItems;
