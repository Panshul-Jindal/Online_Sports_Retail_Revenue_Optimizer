
import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import Navbar from "./Navbar/Navbar";
import "./Orderhistory.css";

const OrdersHistory = () => {
  const [orders, setOrders] = useState([]);
  const userId = Cookies.get("userId");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/order/${userId}`);
        console.log(response);

        // Group orders by order_id and include corresponding products
        const groupedOrders = response.data.orders.reduce((acc, order) => {
          const { order_id, total_amount, status, product_id, quantity, selling_price } = order;

          if (!acc[order_id]) {
            acc[order_id] = {
              order_id,
              total_amount,
              status,
              products: [],
            };
          }

          acc[order_id].products.push({
            product_id,
            quantity,
            selling_price,
          });

          return acc;
        }, {});

        // Convert grouped orders object to an array
        const formattedOrders = Object.values(groupedOrders);
        setOrders(formattedOrders);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchOrders();
  }, [userId]);

  return (
    <>
      <Navbar />
      <div className="orders-container">
        <h1>Orders History</h1>
        {orders.length > 0 ? (
          orders.map((order) => (
            <div key={order.order_id} className="order-item">
              <p><strong>Order ID:</strong> {order.order_id}</p>
              <p><strong>Total Amount:</strong> ₹{order.total_amount}</p>
              <p><strong>Status:</strong> {order.status}</p>
              <h3>Products:</h3>
              <ul>
                {order.products.map((product) => (
                  <li key={product.product_id}>
                    <p><strong>Product ID:</strong> {product.product_id}</p>
                    <p><strong>Quantity:</strong> {product.quantity}</p>
                    <p><strong>Price:</strong> ₹{product.selling_price}</p>
                  </li>
                ))}
              </ul>
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


