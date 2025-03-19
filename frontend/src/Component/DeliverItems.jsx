import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "./Navbar/Navbar";
import Cookies from "js-cookie"; // Import the Cookies library
import "./Deliveritems.css"
const DeliverItems = () => {
  const [deliveries, setDeliveries] = useState([]);
  const sellerId = Cookies.get("userId");

  useEffect(() => {
    const fetchDeliveries = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/orders/deliveries/${sellerId}`);
        setDeliveries(response.data.deliveries);
      } catch (error) {
        console.error("Error fetching deliveries:", error);
      }
    };

    fetchDeliveries();
  }, [sellerId]);

  return (
    <>
      <Navbar />
      <div className="deliveries-container">
        <h1>Deliver Items</h1>
        {deliveries.map((delivery) => (
          <div key={delivery._id} className="delivery-item">
            <p>Product: {delivery.productId.name}</p>
            <p>Buyer: {delivery.buyerId.firstName} {delivery.buyerId.lastName}</p>
            <p>Amount: ₹{delivery.amount}</p>
            <p>Status: {delivery.status}</p>
          </div>
        ))}
      </div>
    </>
  );
};

export default DeliverItems;
