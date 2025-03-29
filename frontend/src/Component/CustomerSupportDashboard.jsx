import React, { useState, useEffect } from "react";
import axios from "axios";
import "./CustomerSupportDashboard.css";
import Navbar from "./Navbar/Navbar";

const CustomerSupportDashboard = () => {
  const [messages, setMessages] = useState([]);
  const [reply, setReply] = useState("");

  useEffect(() => {
    const fetchMessages = async () => {
      const response = await axios.get("http://localhost:5000/api/support/messages");
      setMessages(response.data);
    };

    fetchMessages();
  }, []);

  const handleReply = async (messageId) => {
    try {
      const response = await axios.post("http://localhost:5000/api/support/reply", {
        messageId,
        reply,
      });

      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === messageId ? { ...msg, reply: response.data.data.reply, replied_at: response.data.data.replied_at } : msg
        )
      );
      setReply("");
    } catch (error) {
      console.error("Error replying to message:", error);
    }
  };

  return (
    <div>
      <Navbar/>
    <div className="dashboard-container">
      <h1>Customer Support Dashboard</h1>
      <ul className="message-list">
        {messages.map((msg) => (
          <li key={msg.id} className="message-item">
            <p><strong>User:</strong> {msg.user_name}</p>
            <p><strong>Message:</strong> {msg.message}</p>
            <p><strong>Reply:</strong> {msg.reply || "No reply yet"}</p>
            {msg.reply ? (
              <p><strong>Replied At:</strong> {new Date(msg.replied_at).toLocaleString()}</p>
            ) : (
              <div className="reply-container">
                <input
                  type="text"
                  placeholder="Type your reply..."
                  value={reply}
                  onChange={(e) => setReply(e.target.value)}
                />
                <button onClick={() => handleReply(msg.id)}>Reply</button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
    </div>
  );
};

export default CustomerSupportDashboard;