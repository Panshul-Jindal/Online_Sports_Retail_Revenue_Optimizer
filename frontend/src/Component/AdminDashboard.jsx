import React, { useState, useEffect } from "react";
import axios from "axios";
import "./AdminDashboard.css";
import Navbar from "./Navbar/Navbar";
import StockStrategies from "./StockStrategies";
import PricingStrategies from "./PricingStrategies";
import ProductStockSearch from "./ProductStockSearch";


const AdminDashboard = () => {
  const [currentMonthSales, setCurrentMonthSales] = useState(0);
  const [yearlySales, setYearlySales] = useState(0);
  const [inventorySummary, setInventorySummary] = useState({});
  const [orderStatus, setOrderStatus] = useState([]);
  const [bestSellingProducts, setBestSellingProducts] = useState([]);
  const [leastSellingProducts, setLeastSellingProducts] = useState([]);
  const [lowStockProducts, setLowStockProducts] = useState([]);
  const [highStockProducts, setHighStockProducts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const currentMonthResponse = await axios.get("http://localhost:5000/api/admin/current-month-sales");
        setCurrentMonthSales(currentMonthResponse.data.total_sales_revenue);

        const yearlySalesResponse = await axios.get("http://localhost:5000/api/admin/yearly-sales");
        setYearlySales(yearlySalesResponse.data.total_sales_revenue_year);

        const inventorySummaryResponse = await axios.get("http://localhost:5000/api/admin/inventory-summary");
        setInventorySummary(inventorySummaryResponse.data);

        const orderStatusResponse = await axios.get("http://localhost:5000/api/admin/order-status");
        setOrderStatus(orderStatusResponse.data);

        const bestSellingResponse = await axios.get("http://localhost:5000/api/admin/best-selling-products-view");
        setBestSellingProducts(bestSellingResponse.data);

        const leastSellingResponse = await axios.get("http://localhost:5000/api/admin/least-selling-products-view");
        setLeastSellingProducts(leastSellingResponse.data);

        const lowStockResponse = await axios.get("http://localhost:5000/api/admin/low-stock-products-view");
        setLowStockProducts(lowStockResponse.data);

        const highStockResponse = await axios.get("http://localhost:5000/api/admin/high-stock-products-view");
        setHighStockProducts(highStockResponse.data);
      } catch (error) {
        console.error("Error fetching admin data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <Navbar />
      <div className="admin-dashboard">
        <h1>Admin Dashboard</h1>

        <div className="dashboard-stats">
          <div className="stat-card">
            <h3>Current Month Sales</h3>
            <p>₹{currentMonthSales}</p>
          </div>
          <div className="stat-card">
            <h3>Yearly Sales</h3>
            <p>₹{yearlySales}</p>
          </div>
          <div className="stat-card">
            <h3>Total Products</h3>
            <p>{inventorySummary.total_products}</p>
          </div>
          <div className="stat-card">
            <h3>Total Brands</h3>
            <p>{inventorySummary.total_brands}</p>
          </div>
          <div className="stat-card">
            <h3>Total Categories</h3>
            <p>{inventorySummary.total_categories}</p>
          </div>
          <div className="stat-card">
            <h3>Total Suppliers</h3>
            <p>{inventorySummary.total_suppliers}</p>
          </div>
        </div>

        <div className="dashboard-section">
          <h2>Order Status</h2>
          <ul>
            {orderStatus.map((status, index) => (
              <li key={index}>
                {status.status}: {status.total_orders}
              </li>
            ))}
          </ul>
        </div>

        <div className="dashboard-section">
          <h2>Best-Selling Products</h2>
          <ul>
            {bestSellingProducts.map((product, index) => (
              <li key={index}>
                {product.name} - {product.total_sold} sold
              </li>
            ))}
          </ul>
        </div>

        <div className="dashboard-section">
          <h2>Least-Selling Products</h2>
          <ul>
            {leastSellingProducts.map((product, index) => (
              <li key={index}>
                {product.name} - {product.total_sold} sold
              </li>
            ))}
          </ul>
        </div>

        
        <PricingStrategies/>
        
        <ProductStockSearch />
        <StockStrategies/>

       
      </div>
    </>
  );
};

export default AdminDashboard;