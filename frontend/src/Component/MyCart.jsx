import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "./Navbar/Navbar";
import "./MyCart.css";
import Cookies from "js-cookie"; // Import the Cookies library

const MyCart = () => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalCost, setTotalCost] = useState(0);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        // Get userId from cookie
        const userId = Cookies.get("userId");
        if (!userId) {
          alert("Please log in to view your cart.");
          return;
        }

        // Sending the userId along with the request
        const response = await axios.get("http://localhost:5000/cart/mycart", {
          withCredentials: true, // Ensure cookies are sent
        });

        // Filter out items where the buyer and seller are the same ( need to fix that while filling in the data dont add with the same user id)
        const filteredCart = response.data.cart.filter(
          (item) => item.sellerId !== userId
        );

        // Calculate the total cost of all items
        const total = filteredCart.reduce((sum, item) => sum + item.price, 0);
        setTotalCost(total);

        setCart(filteredCart);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching cart:", error);
        setLoading(false);
      }
    };

    fetchCart();
  }, []);

  const handleRemove = async (productId) => {
    try {
      const userId = Cookies.get("userId");
      if (!userId) {
        alert("Please log in to remove items from your cart.");
        return;
      }

      // Send request to remove the item from the cart
      const response = await axios.delete("http://localhost:5000/cart/remove", {
        data: { productId },
        withCredentials: true, // Ensure cookies are sent
      });

      // Directly update the cart and total cost after removing the item
      const updatedCart = response.data.cart.filter(
        (item) => item.sellerId !== userId
      ); // Reapply the filter for seller != buyer
      setCart(updatedCart); // Update cart with the removed item
      // Update the total cost after removal
      const updatedTotalCost = updatedCart.reduce(
        (sum, item) => sum + item.price,
        0
      );
      setTotalCost(updatedTotalCost);
    } catch (error) {
      console.error("Error removing from cart:", error);
    }
  };
  const handleOrder = async () => {
    try {
      const userId = Cookies.get("userId");
      if (!userId) {
        alert("Please log in to place an order.");
        return;
      }
  
      const response = await axios.post(
        "http://localhost:5000/orders",
        {
          userId,
          cartItems: cart.map((item) => item._id),
        },
        { withCredentials: true }
      );
  
      if (response.status === 200) {
        alert("Order placed successfully! Check your Orders History page.");
        const { orders, otps } = response.data;
  
        // You can store OTPs in localStorage, session storage, or state for use in the Orders History page.
        localStorage.setItem("otps", JSON.stringify(otps));
  
        setCart([]); // Clear the cart locally
        setTotalCost(0);
      } else {
        alert("Failed to place order.");
      }
    } catch (error) {
      console.error("Error placing order:", error);
      alert("Failed to place order.");
    }
  };
  
  

  if (loading) {
    return <p>Loading...</p>;
  }

  // if (cart.length === 0) {
  //   return <p>Your cart is empty!</p>;
  // }

  return (
    <>
      <Navbar />
      <div className="cart-container">
        <h1>Your Cart</h1>
        {cart.map((item) => (
          <div key={item._id} className="cart-item">
            <div className="cart-item-details">
              <h2>{item.name}</h2>
              <p>Price: ₹{item.price}</p>
              <p>Category: {item.category}</p>
              <p>Description: {item.description}</p>
              <button onClick={() => handleRemove(item._id)}>
                Remove from Cart
              </button>
            </div>
          </div>
        ))}
        <h3>Total Cost: ₹{totalCost}</h3>
        <button onClick={handleOrder}>Final Order</button>
      </div>
    </>
  );
};

export default MyCart;
