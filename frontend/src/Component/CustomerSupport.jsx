import React, { useState, useEffect } from "react";
import "./CustomerSupport.css";
import axios from "axios";
import Navbar from "./Navbar/Navbar";
import Cookies from "js-cookie";

const CustomerSupport = () => {
  const [messages, setMessages] = useState([]);
  const [userMessage, setUserMessage] = useState("");

  useEffect(() => {
    const fetchMessages = async () => {
      const userId = Cookies.get("userId"); // Assumes userId is stored in cookies
      if (!userId) {
        console.error("User ID not found in cookies");
        return;
      }
      try {
        const response = await axios.get("http://localhost:5000/api/support/messages", {
          params: { userId },
        });
        setMessages(response.data);
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    fetchMessages();
  }, []);

  const handleSendMessage = async () => {
    if (!userMessage.trim()) return;

    const userId = Cookies.get("userId"); // Assumes userId is stored in cookies
    if (!userId) {
      console.error("User ID not found in cookies");
      return;
    }
    try {
      const response = await axios.post("http://localhost:5000/api/support/submit", {
        userId,
        message: userMessage,
      });

      setMessages((prev) => [...prev, response.data.data]);
      setUserMessage("");
    } catch (error) {
      console.error("Error submitting message:", error);
    }
  };

  return (
    <>
      <Navbar />
      <div className="chatbot-container">
        <div className="chat-header">Customer Support</div>
        <ul className="chat-messages">
          {messages.map((msg, index) => (
            <li key={index} className="chat-message">
              <div className="message-content user-message">
                <strong>You:</strong> {msg.message}
              </div>
              {msg.reply && (
                <div className="message-content support-reply">
                  <strong>Support:</strong> {msg.reply}
                </div>
              )}
            </li>
          ))}
        </ul>
        <div className="chat-input-container">
          <input
            type="text"
            className="chat-input"
            placeholder="Type your message..."
            value={userMessage}
            onChange={(e) => setUserMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
          />
          <button className="chat-send-button" onClick={handleSendMessage}>
            Send
          </button>
        </div>
      </div>
    </>
  );
};

export default CustomerSupport;