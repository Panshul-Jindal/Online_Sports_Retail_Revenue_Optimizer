import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie"; // To read cookies
import Navbar from "./Navbar/Navbar";
import "./ProfilePage.css";

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    const fetchUser = async () => {
      const userId = Cookies.get("userId"); // Get userId from cookies
      if (!userId) return;

      try {
        const response = await axios.get(`http://localhost:5000/auth/user/${userId}`, {
          withCredentials: true,
        });
        setUser(response.data);
        setFormData(response.data); // Initialize form data with user data
      } catch (error) {
        console.error("Failed to fetch user details:", error);
      }
    };

    fetchUser();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSave = async () => {
    const userId = Cookies.get("userId");
    try {
      await axios.put(`http://localhost:5000/auth/user/${userId}`, formData, {
        withCredentials: true,
      });
      setUser(formData); // Update the user data with the updated form data
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to update user details:", error);
    }
  };

  if (!user) return <p>Loading...</p>;

  return (
    <>
      <Navbar />
      <div className="profile-container">
        <h1 className="profile-title">Welcome, {user.firstName}!</h1>
        <div className="profile-card">
          {isEditing ? (
            <div className="profile-form">
              <label>First Name:</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
              />
              <label>Last Name:</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
              />
              <label>Email:</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                disabled
              />
              <label>Age:</label>
              <input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleInputChange}
              />
              <label>Contact Number:</label>
              <input
                type="text"
                name="contactNumber"
                value={formData.contactNumber}
                onChange={handleInputChange}
              />
              <div className="profile-buttons">
                <button onClick={handleSave} className="save-button">
                  Save
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="cancel-button"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="profile-details">
              <p>
                <strong>First Name:</strong> {user.firstName}
              </p>
              <p>
                <strong>Last Name:</strong> {user.lastName}
              </p>
              <p>
                <strong>Email:</strong> {user.email}
              </p>
              <p>
                <strong>Age:</strong> {user.age}
              </p>
              <p>
                <strong>Contact Number:</strong> {user.contactNumber}
              </p>
              <button
                onClick={() => setIsEditing(true)}
                className="edit-button"
              >
                Edit Profile
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ProfilePage;
