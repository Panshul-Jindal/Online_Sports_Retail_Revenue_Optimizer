import React, { useState } from "react";
import "./Chatbot.css";
import axios from "axios";
import Navbar from "./Navbar/Navbar";
const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [userMessage, setUserMessage] = useState("");
  const [sessionId, setSessionId] = useState("");

  const startSession = async () => {
    if (!sessionId) {
      const response = await axios.post("http://localhost:5000/chatbot/start");
      setSessionId(response.data.sessionId);
    }
  };

  const handleSendMessage = async () => {
    if (!userMessage.trim()) return;

    const userMessageObject = { sender: "user", message: userMessage };
    setMessages((prev) => [...prev, userMessageObject]);

    try {
      const response = await axios.post("http://localhost:5000/chatbot/message", {
        sessionId,
        message: userMessage,
      });

      const botMessageObject = { sender: "bot", message: response.data.message };
      setMessages((prev) => [...prev, botMessageObject]);
    } catch (error) {
      console.error("Error communicating with chatbot:", error);
    }

    setUserMessage("");
  };

  return (
    <>
    <Navbar />
    <div className="chatbot-container" onLoad={startSession}>
      <div className="chat-header">Chat with IIIT Helper</div>
      <ul className="chat-messages">
        {messages.map((msg, index) => (
          <li
            key={index}
            className={`chat-message ${msg.sender === "user" ? "user" : "bot"}`}
          >
            <div className="message-content">{msg.message}</div>
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

export default Chatbot;
