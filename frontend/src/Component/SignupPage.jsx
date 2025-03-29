import React, { useState } from "react";
import "./loginSignup.css";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie"; // To manage cookies

const SignupPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",

    password: "",
    role: "",
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e) => {
    console.log(formData);
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
        credentials: "include", // Ensure cookies are sent/stored
      });

      const data = await response.json();
      if (response.status === 201) {
        // On successful signup, store userId in cookies

        Cookies.set("userId", data.userId);
        Cookies.set("userRole", data.role); // Store the user role in cookies
        console.log("Cookies set to ", data.role);
        if (data.userId && data.role) {
          console.log("Navigating to /profile");

          navigate("/profile"); // Redirect to profile page
        }
      } else {
        alert(data.message || "Signup failed");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Signup failed");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1 className="auth-title">Join Us!</h1>
        <p className="auth-subtitle">Create your account</p>
        <form className="auth-form" onSubmit={handleSignup}>
          <label>Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter name"
            required
          />
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
            required
          />

          <label>Password:</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Create a password"
            required
          />
          <label>Role:</label>
          <input
            type="text"
            name="role"
            value={formData.role}
            onChange={handleChange}
            placeholder="Enter role"
            required
          />
          <br></br>
          <button className="auth-button">Sign Up</button>
        </form>
        <p className="auth-footer">
          Already have an account? <a href="/login">Log In</a>
        </p>
      </div>
    </div>
  );
};

export default SignupPage;
