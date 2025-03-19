import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import Navbar from "./Navbar/Navbar";
import "./Orderhistory.css"
const OrdersHistory = () => {
  const [orders, setOrders] = useState([]);
  const userId = Cookies.get("userId");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/orders/${userId}`);
        const otps = JSON.parse(localStorage.getItem("otps")) || {}; // Retrieve OTPs from localStorage

        const fetchedOrders = response.data.orders.map((order) => ({
          ...order,
          otp: otps[order._id] || "Not available", // Attach the OTP if it exists
        }));
        setOrders(fetchedOrders);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchOrders();
  }, [userId]); // Only include stable dependencies

  return (
    <>
      <Navbar />
      <div className="orders-container">
        <h1>Orders History</h1>
        {orders.length > 0 ? (
          orders.map((order) => (
            <div key={order._id} className="order-item">
              <p>Product: {order.productId.name}</p>
              <p>Seller: {order.sellerId.firstName} {order.sellerId.lastName}</p>
              <p>Amount: ₹{order.amount}</p>
              <p>Status: {order.status}</p>
              <p>OTP: {order.otp}</p>
            </div>
          ))
        ) : (
          <p>No orders found.</p>
        )}
      </div>
    </>
  );
};

export default OrdersHistory;
