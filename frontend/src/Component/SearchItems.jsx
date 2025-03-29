import React, { useState, useEffect } from "react";
import axios from "axios";
import "./SearchItems.css";
import Navbar from "./Navbar/Navbar";
import { useNavigate } from "react-router-dom";



const SearchItems = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  // const [search, setSearch] = useState("");
  const navigate = useNavigate();


  useEffect(() => {
    // Fetch categories in a hierarchical structure
    const fetchCategories = async () => {
      const response = await axios.get("http://localhost:5000/api/products/categories/hierarchy");
      setCategories(response.data);
    };

    // Fetch available brands
    const fetchBrands = async () => {
      const response = await axios.get("http://localhost:5000/api/products/brands");
      setBrands(response.data);
    };

    fetchCategories();
    fetchBrands();
  }, []);

  useEffect(() => {
    // Fetch products based on filters
    const fetchProducts = async () => {
      const response = await axios.get("http://localhost:5000/api/products/search", {
        params: {
          query: searchQuery,
          categories: selectedCategories.join(","),
          brands: selectedBrands.join(","),
        },
      });
      setProducts(response.data);
    };

    fetchProducts();
  }, [searchQuery, selectedCategories, selectedBrands]);

  const toggleCategory = (categoryId) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId) ? prev.filter((id) => id !== categoryId) : [...prev, categoryId]
    );
  };

  const toggleBrand = (brandId) => {
    setSelectedBrands((prev) =>
      prev.includes(brandId) ? prev.filter((id) => id !== brandId) : [...prev, brandId]
    );
  };

  const renderCategories = (categories) => {
    return categories.map((category) => (
      <div key={category.category_id} className="category-item">
        <label>
          <input
            type="checkbox"
            checked={selectedCategories.includes(category.category_id)}
            onChange={() => toggleCategory(category.category_id)}
          />
          {category.name}
        </label>
        {category.children.length > 0 && (
          <div className="subcategory-list">{renderCategories(category.children)}</div>
        )}
      </div>
    ));
  };


  const handleViewDetails = (productId) => {
    console.log(productId);
    if (!productId) {
      console.error("Product ID is undefined");
      return;
    }
    console.log("Navigating to product with id",productId)
    navigate(`/products/${productId}`);
  };


  return (
    <div>
      <Navbar />
      <h1>Search Items</h1>
        <input
          type="text"
          placeholder="Search for items"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      <div className="search-items-container">
        <div className="filters">
          <h3>Categories</h3>
          <div className="category-list">{renderCategories(categories)}</div>

          <h3>Brands</h3>
          <div className="brand-list">
            {brands.map((brand) => (
              <label key={brand.brand_id} className="brand-item">
                <input
                  type="checkbox"
                  checked={selectedBrands.includes(brand.brand_id)}
                  onChange={() => toggleBrand(brand.brand_id)}
                />
                <span>{brand.name}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="products">
          <h2>Products</h2>
          <div className="product-list">
            {products.map((product) => (
              <div key={product.product_id} className="product-card">
                <h3>{product.name}</h3>
                <p>Price: ₹{product.selling_price}</p>
                <p>MRP: ₹{product.mrp}</p>
                <p>Brand: {product.brand_id}</p>
                <p>Category: {product.category_id}</p>
                <p>Rating: {product.average_rating}</p>
                <button onClick={() => handleViewDetails(product.product_id)}>
                View Details
              </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchItems;