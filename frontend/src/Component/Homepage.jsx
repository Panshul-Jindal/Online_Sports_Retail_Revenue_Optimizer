import React from "react";
import { Link, useNavigate } from "react-router-dom";
// import Cookies from "js-cookie";
import "./Home.css"; // Optional: Add custom styling for the navbar
import Navbar from "./Navbar/Navbar";
const Home = () => {
  const navigate = useNavigate();

  // // Handle logout functionality
  // const handleLogout = () => {
  //   Cookies.remove("userId"); // Clear user session cookie
  //   navigate("/"); // Redirect to login page
  // };

  return (
    <div>
     

      <Navbar />
      <div className="home-content">
        <h1>Welcome to the IIIT Buy-Sell-Rent Portal!</h1>
        <p>Explore the features from the navigation bar above.</p>
      </div>
    </div>
  );
};

export default Home;
