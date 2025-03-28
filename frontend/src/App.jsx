// import React, { useEffect } from "react";
// import {
//   BrowserRouter as Router,
//   Routes,
//   Route,
//   Navigate,
//   useNavigate,
// } from "react-router-dom";
// import Cookies from "js-cookie";
// import axios from "axios";

// import "./App.css";
// import HomeScreen from "./Screen/HomeScreen/homeScreen";
// import LoginPage from "./Component/LoginPage";
// import SignupPage from "./Component/SignupPage";
// import ProfilePage from "./Component/ProfilePage";
// import Home from "./Component/Homepage";
// import Products from "./Component/product";
// import SearchItems from "./Component/SearchItems";
// import ItemDetailsPage from "./Component/Items"; // Import the item details page
// import SellPage from "./Component/Sell"; // Import the sell page
// import OrdersHistory from "./Component/OrdersHistory";
// import DeliverItems from "./Component/DeliverItems";
// import MyCart from "./Component/MyCart";
// import ItemPage from "./Component/Items";
// import Chatbot from "./Component/Chatbot";
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
// // Protected Route using session (cookies)
// const ProtectedRoute = ({ children }) => {
//   const isAuthenticated = !!Cookies.get("userId"); // Check if the userId is set in cookies

//   return isAuthenticated ? children : <Navigate to="/login" />;
// };
// function App() {
//   const navigate = useNavigate();

//   useEffect(() => {
//     const checkSession = async () => {
//       const userId = Cookies.get("userId"); // Retrieve user session from cookies
//       const currentPath = window.location.pathname; // Get current URL path

//       if (
//         userId &&
//         (currentPath === "/" ||
//           currentPath === "/login" ||
//           currentPath === "/signup")
//       ) {
//         navigate("/profile"); // Redirect to home if session exists and user is on unauthenticated routes
//       }
//     };

//     checkSession();
//   }, [navigate]);
//   return (
//     <div className="App">
//       <Routes>
//         {/* Public Routes */}
//         <Route path="/" element={<HomeScreen />} />
//         <Route path="/login" element={<LoginPage />} />
//         <Route path="/signup" element={<SignupPage />} />

//         {/* Protected Routes */}
//         <Route
//           path="/home"
//           element={
//             <ProtectedRoute>
//               <Home />
//             </ProtectedRoute>
//           }
//         />
//         <Route
//           path="/profile"
//           element={
//             <ProtectedRoute>
//               <ProfilePage />
//             </ProtectedRoute>
//           }
//         />
//         <Route
//           path="/products"
//           element={
//             <ProtectedRoute>
//               <Products />
//             </ProtectedRoute>
//           }
//         />
//         <Route
//           path="/search-items"
//           element={
//             <ProtectedRoute>
//               <SearchItems />
//             </ProtectedRoute>
//           }
//         />
//         <Route
//           path="/products/:productId"
//           element={
//             <ProtectedRoute>
//               <ItemDetailsPage />
//             </ProtectedRoute>
//           }
//         />
//         <Route
//           path="/sell"
//           element={
//             <ProtectedRoute>
//               <SellPage />
//             </ProtectedRoute>
//           }
//         />
//         <Route
//           path="/orders-history"
//           element={
//             <ProtectedRoute>
//               <OrdersHistory />
//             </ProtectedRoute>
//           }
//         />
//         <Route
//           path="/deliver-items"
//           element={
//             <ProtectedRoute>
//               <DeliverItems />
//             </ProtectedRoute>
//           }next js tutorial
//         />
//         <Route
//           path="/my-cart"
//           element={
//             <ProtectedRoute>
//               <MyCart />
//             </ProtectedRoute>
//           }
//         />
//         <Route
//           path="/ai"
//           element={
//             <ProtectedRoute>
//               <Chatbot />
//             </ProtectedRoute>
//           }
//         />
       
//       </Routes>
//     </div>
//   );
// }

// export default App;

import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import axios from "axios";

import "./App.css";
import HomeScreen from "./Screen/HomeScreen/homeScreen";
import LoginPage from "./Component/LoginPage";
import SignupPage from "./Component/SignupPage";
import ProfilePage from "./Component/ProfilePage";
import Home from "./Component/Home";
import Products from "./Component/Product";
import SearchItems from "./Component/SearchItems";
import ItemDetailsPage from "./Component/Items";
import SellPage from "./Component/Sell";
import OrdersHistory from "./Component/OrdersHistory";
import DeliverItems from "./Component/DeliverItems";
import MyCart from "./Component/MyCart";
import Chatbot from "./Component/Chatbot";




function App() {
  return (
    <div className="App">
      <Routes>
        {/* Public Routes (No Authentication Required) */}
        <Route path="/" element={<HomeScreen />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/home" element={<Home />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/products" element={<Products />} />
        <Route path="/search-items" element={<SearchItems />} />
        <Route path="/products/:productId" element={<ItemDetailsPage />} />
        <Route path="/sell" element={<SellPage />} />
        <Route path="/orders-history" element={<OrdersHistory />} />
        <Route path="/deliver-items" element={<DeliverItems />} />
        <Route path="/my-cart" element={<MyCart />} />
        <Route path="/ai" element={<Chatbot />} />
      </Routes>
    </div>
  );
}

export default App;
