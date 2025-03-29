import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom";
import Cookies from "js-cookie";
import axios from "axios";
import "./App.css";
import HomeScreen from "./Screen/HomeScreen/homeScreen";
import LoginPage from "./Component/LoginPage";
import SignupPage from "./Component/SignupPage";
import ProfilePage from "./Component/ProfilePage";
import Home from "./Component/Home";
import Products from "./Component/Product";
import SearchItems from "./Component/SearchItems";
import ItemPage from "./Component/ItemPage";
import SellPage from "./Component/Sell";
import OrdersHistory from "./Component/OrdersHistory";

import MyCart from "./Component/MyCart";
import CustomerSupport from "./Component/CustomerSupport";
import CustomerSupportDashboard from "./Component/CustomerSupportDashboard";
import AdminDashboard from "./Component/AdminDashboard";


// const API = axios.create({
//   baseURL: "http://localhost:5000", // Base URL of your backend
// });

// // Example: Fetch products
// export const fetchProducts = async () => {
//   try {
//     console.log("Sending request to /products");
//     const response = await API.get("/products"); // Check if API is properly set up
//     console.log("Received raw response:", response);
//     const data = await response.data; // Adjust for Axios (no need for `.json()`)
//     console.log("Parsed data:", data);
//     return data;
//   } catch (error) {
//     console.error("Error fetching products:", error);
//     throw error;
//   }
// };







// Protected Route using session (cookies)
const ProtectedRoute = ({ children, allowedRoles }) => {
  const isAuthenticated = !!Cookies.get("userId"); // Check if the user is authenticated
  const userRole = Cookies.get("userRole"); // Retrieve the user's role from cookies

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (!allowedRoles.includes(userRole)) {
    return <Navigate to="/" />; // Redirect to home if the user doesn't have access
  }

  return children;
};

function App() {
  const navigate = useNavigate();

  useEffect(() => {
    const checkSession = async () => {
      const userId = Cookies.get("userId"); // Retrieve user session from cookies
      const currentPath = window.location.pathname; // Get current URL path

      if (
        userId &&
        (currentPath === "/" ||
          currentPath === "/login" ||
          currentPath === "/signup")
      ) {
        navigate("/home"); // Redirect to home if session exists and user is on unauthenticated routes
      }
    };

    checkSession();
  }, [navigate]);

  return (
    <div className="App">
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomeScreen />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />

        {/* Protected Routes */}
        <Route
          path="/home"
          element={
            <ProtectedRoute allowedRoles={["customer", "customer_support", "admin"]}>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute allowedRoles={["customer", "customer_support", "admin"]}>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
       
        <Route
          path="/search-items"
          element={
            <ProtectedRoute allowedRoles={["customer", "admin"]}>
              <SearchItems />
            </ProtectedRoute>
          }
        />
        <Route
          path="/customer-support-dashboard"
          element={
            <ProtectedRoute allowedRoles={["customer_support", "admin"]}>
              <CustomerSupportDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/products/:productId"
          element={
            <ProtectedRoute allowedRoles={["customer", "customer_support", "admin"]}>
              <ItemPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/sell"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <SellPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/orders-history"
          element={
            <ProtectedRoute allowedRoles={["customer", "admin"]}>
              <OrdersHistory />
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-cart"
          element={
            <ProtectedRoute allowedRoles={["customer", "admin"]}>
              <MyCart />
            </ProtectedRoute>
          }
        />
        <Route
          path="/customer-support"
          element={
            <ProtectedRoute allowedRoles={["customer", "admin"]}>
              <CustomerSupport />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin-dashboard"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
}

export default App;