import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "./Navbar/Navbar";
import "./ItemPage.css";
import Cookies from "js-cookie";

const ItemPage = () => {
  const { productId } = useParams(); // Get the productId from the URL
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(""); // To store any error message
  const navigate = useNavigate(); // To navigate to another page

  useEffect(() => {
    console.log("Received productId from useParams:", productId);
    if (!productId) {
      console.error(
        "Product ID is undefined. Ensure the URL contains the productId."
      );
      setLoading(false);
      return;
    }

    const fetchProduct = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/products/${productId}`
        );
        setProduct(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching product details:", error);
        setLoading(false);
        setErrorMessage("Failed to fetch product details.");
      }
    };

    fetchProduct();
  }, [productId]);

  const handleAddToCart = async () => {
    try {
      const userId = Cookies.get("userId"); // Retrieve userId from cookies
      if (!userId) {
        setErrorMessage("Please log in to add items to your cart.");
        return;
      }

      // Sending the productId and userId to add to the cart
      const response = await axios.post(
        "http://localhost:5000/api/cart/add",
        { userId, productId },
        { withCredentials: true } // Important to include the session cookie
      );

      if (response.status === 200) {
        alert("Item added to cart!");
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      if (error.response && error.response.data.message) {
        setErrorMessage(error.response.data.message); // Show the backend error message
      } else {
        setErrorMessage("An unexpected error occurred. Please try again.");
      }
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!product) {
    return <p>Product not found!</p>;
  }

  return (
    <>
      <Navbar />
      <div className="item-container">
        <h1>{product.name}</h1>
        <p>Price: ₹{product.selling_price}</p>
     
      

    <p className="price">₹{product.selling_price}</p>
    <p className="rating">⭐ {product.average_rating}</p>
        <button onClick={handleAddToCart}>Add to Cart</button>

        {/* Display any error message */}
        {errorMessage && <div className="error-message">{errorMessage}</div>}
      </div>
    </>
  );
};

export default ItemPage;
