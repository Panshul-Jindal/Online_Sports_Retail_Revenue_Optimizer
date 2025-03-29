import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Navbar from "./Navbar/Navbar";
import "./ItemPage.css";
import Cookies from "js-cookie";

const ItemPage = () => {
  const { productId } = useParams(); // Get the productId from the URL
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(""); // To store any error message
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [newReview, setNewReview] = useState({ rating: "", review_text: "" }); // State for new review


  useEffect(() => {
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

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/products/${productId}/reviews?page=${currentPage}&limit=5`
        );
        setReviews(response.data.reviews);
        setTotalPages(response.data.totalPages);
      } catch (error) {
        console.error("Error fetching reviews:", error);
        setErrorMessage("Failed to fetch reviews.");
      }
    };

    fetchReviews();
  }, [productId, currentPage]);

  const handleAddToCart = async () => {
    try {
      const userId = Cookies.get("userId"); // Retrieve userId from cookies
      if (!userId) {
        setErrorMessage("Please log in to add items to your cart.");
        return;
      }

      const response = await axios.post(
        "http://localhost:5000/api/cart/add",
        { userId, productId },
        { withCredentials: true }
      );

      if (response.status === 200) {
        alert("Item added to cart!");
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      if (error.response && error.response.data.message) {
        setErrorMessage(error.response.data.message);
      } else {
        setErrorMessage("An unexpected error occurred. Please try again.");
      }
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };


  const handleAddReview = async (e) => {
    e.preventDefault();
    try {
      const userId = Cookies.get("userId"); // Retrieve userId from cookies
      if (!userId) {
        setErrorMessage("Please log in to add a review.");
        return;
      }

      const response = await axios.post(
        `http://localhost:5000/api/products/${productId}/reviews`,
        { userId, rating: newReview.rating, review_text: newReview.review_text },
        { withCredentials: true }
      );

      if (response.status === 201) {
        alert("Review added successfully!");
        setNewReview({ rating: "", review_text: "" }); // Reset the form
        setReviews((prevReviews) => [response.data.review, ...prevReviews]); // Add the new review to the list
      }
    } catch (error) {
      console.error("Error adding review:", error);
      if (error.response && error.response.data.message) {
        setErrorMessage(error.response.data.message);
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
        <p className="rating">⭐ {product.average_rating}</p>
        <button onClick={handleAddToCart}>Add to Cart</button>

        {/* Display any error message */}
        {errorMessage && <div className="error-message">{errorMessage}</div>}

        <div className="reviews-container">
          <h2>Reviews</h2>
          {reviews.length > 0 ? (
            reviews.map((review) => (
              <div key={review.review_date} className="review-item">
                <p><strong>{review.user_name}</strong> ⭐ {review.rating}</p>
                <p>{review.review_text}</p>
                <p className="review-date">{new Date(review.review_date).toLocaleDateString()}</p>
              </div>
            ))
          ) : (
            <p>No reviews yet.</p>
          )}

          {/* Pagination Controls */}
          <div className="pagination-controls">
            <button onClick={handlePreviousPage} disabled={currentPage === 1}>
              Previous
            </button>
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <button onClick={handleNextPage} disabled={currentPage === totalPages}>
              Next
            </button>
          </div>
        </div>
        <div className="add-review-container">
        <h2>Add a Review</h2>
        <form onSubmit={handleAddReview}>
            <label>
              Rating (1-5):
              <input
                type="number"
                name="rating"
                value={newReview.rating}
                onChange={(e) => setNewReview({ ...newReview, rating: e.target.value })}
                min="1"
                max="5"
                required
              />
            </label>
            <label>
              Review:
              <textarea
                name="review_text"
                value={newReview.review_text}
                onChange={(e) => setNewReview({ ...newReview, review_text: e.target.value })}
                required
              />
            </label>
            <button type="submit">Submit Review</button>
          </form>
        </div>
        
      </div>
    </>
  );
};

export default ItemPage;