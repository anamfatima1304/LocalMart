import React, { useState } from "react";
import './Messages.css';

function Messages() {

    return (
      <div id="messages">
      <div className="header">
        <h1>Customer Messages</h1>
        <p>Stay in touch with your customers</p>
      </div>

      {[
        {
          id: 1,
          name: "Fatima Khan",
          initials: "FK",
          time: "Today, 14:30",
          message:
            "Hello! I just wanted to check if my order #1025 will be delivered on time? I have a meeting at 3 PM.",
        },
        {
          id: 2,
          name: "Ali Imran",
          initials: "AI",
          time: "Yesterday, 19:45",
          message:
            "The food was delicious! Will definitely order again. Do you offer any discounts for regular customers?",
        },
        {
          id: 3,
          name: "Zainab Ahmed",
          initials: "ZA",
          time: "Apr 28, 2025",
          message:
            "Can you customize the spice level in your Chicken Karahi? My family prefers mild spices.",
        },
      ].map((msg) => (
        <div key={msg.id} className="message-card">
          <div className="message-avatar">{msg.initials}</div>
          <div className="message-content">
            <div className="message-header">
              <div className="message-name">{msg.name}</div>
              <div className="message-time">{msg.time}</div>
            </div>
            <div className="message-text">{msg.message}</div>
            <button className="btn" style={{ marginTop: "10px" }}>
              Reply
            </button>
          </div>
        </div>
      ))}
    </div>
    );
}

export default Messages;