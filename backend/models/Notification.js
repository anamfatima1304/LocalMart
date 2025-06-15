// models/Notification.js
const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    message: { type: String, required: true },
    type: { type: String, enum: ["order", "promotion", "system"], default: "order" },
    isRead: { type: Boolean, default: false },
    icon: { type: String, default: "fa-bell" },
    iconColor: { type: String, default: "#3b82f6" },
    actionButton: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Notification", notificationSchema);
