import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";
import Cookies from "js-cookie";

const Navbar = () => {
  const navigate = useNavigate();

  // Get the user's role from the cookie
  const userRole = Cookies.get("userRole");

  const handleLogout = () => {
    Cookies.remove("userId"); // Clear user session cookie
    Cookies.remove("userRole"); // Clear user role cookie
    navigate("/"); // Redirect to login page
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-logo">
          <Link to="/home">Your Shop</Link>
        </div>

        <ul className="navbar-links">
          {/* Links accessible to all roles */}
          <li>
            <Link to="/home">Home</Link>
          </li>
          <li>
            <Link to="/profile">Profile</Link>
          </li>

          {/* Links for customer and admin */}
          {(userRole === "customer" || userRole === "admin") && (
            <>
              <li>
                <Link to="/search-items">Search</Link>
              </li>
              <li>
                <Link to="/my-cart">My Cart</Link>
              </li>
              <li>
                <Link to="/orders-history">Orders</Link>
              </li>
            </>
          )}

          {/* Links for customer_support and admin */}
          {(userRole === "customer_support" || userRole === "admin") && (
            <li>
              <Link to="/customer-support-dashboard">Customer Support Dashboard</Link>
            </li>
          )}

          {/* Links for admin only */}
          {userRole === "admin" && (
            <>

            <li>
              <Link to="/admin-dashboard">Admin Dashboard</Link>
            </li>


            <li>
              <Link to="/sell">Sell</Link>
            </li>

            </>
 

          )}


          {/* Logout button */}
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