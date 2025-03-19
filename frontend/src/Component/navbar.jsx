import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";
import Cookies from "js-cookie";

const Navbar = () => {
//   const navigate = useNavigate();

//   const handleLogout = () => {
//       Cookies.remove("userId"); // Clear user session cookie
//       navigate("/"); // Redirect to login page
//     };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-logo">
          <Link to="/home">IIIT Buy Sell Rent</Link>
        </div>
        <ul className="navbar-links">
          <li>
            <Link to="/home">Home</Link>
          </li>
          <li>
            <Link to="/ai">Chatbot</Link>
          </li>
          <li>
            <Link to="/sell">Sell</Link>
          </li>
          <li>
            <Link to="/search-items">Search</Link>
          </li>
          <li>
            <Link to="/my-cart">My Cart</Link>
          </li>
          <li>
            <Link to="/orders-history">Orders</Link>
          </li>
          <li>
            <Link to="/deliver-items">Delivery</Link>
          </li>
          <li>
            <Link to="/profile">Profile</Link>
          </li>
          <li>
            <button onClick={handleLogout} className="logout-button">
              Logout
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
