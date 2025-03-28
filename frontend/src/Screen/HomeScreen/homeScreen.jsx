import React from "react";
import { useNavigate } from "react-router-dom";
import "./homeScreen.css";
import Navbar from "../../Component/Navbar/Navbar";
import Footer from "../../Component/Footer/Footer";
const HomeScreen = () => {
  const navigate = useNavigate();

  return (
    <>
    {/* <Navbar /> */}
    <div className="home-container">
      <header className="home-header">
        <h1>Welcome to your Online Shop</h1>
        <p>By Panshul Shreeja Yashasvi Sreenandan</p>
      </header>

      <section className="home-description">
        <h2>About Us</h2>
        <p>Our platform allows to transfrom a offline sports retail business to online with dynamically adjusting prices</p>
        <ul>
          <li>Sell all your items</li>
          <li>Get valuable insights about your revenue</li>
          <li>Get data driven Insights for optimzing your revenue and stock</li>
        </ul>
      </section>

      <section className="home-actions">
        <button className="login-button" onClick={() => navigate("/login")}>
          Log In
        </button>
        <button className="signup-button" onClick={() => navigate("/signup")}>
          Sign Up
        </button>
      </section>
    </div>
    {/* <Footer /> */}
    </>
  );
};

export default HomeScreen;
