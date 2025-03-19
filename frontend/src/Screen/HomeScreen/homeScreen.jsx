import React from "react";
import { useNavigate } from "react-router-dom";
import "./homeScreen.css";
import Navbar from "../../Component/Navbar/Navbar";
import Footer from "../../Component/Footer/footer";
const HomeScreen = () => {
  const navigate = useNavigate();

  return (
    <>
    {/* <Navbar /> */}
    <div className="home-container">
      <header className="home-header">
        <h1>Welcome to Buy-Sell-Rent</h1>
        <p>Your one-stop solution for buying, selling, and renting items within the IIIT Community!</p>
      </header>

      <section className="home-description">
        <h2>About Us</h2>
        <p>Our platform connects the IIIT community members, allowing you to:</p>
        <ul>
          <li>Buy essential items at reasonable prices.</li>
          <li>Sell your used items to others in need.</li>
          <li>Rent items for short-term usage without hassle.</li>
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
