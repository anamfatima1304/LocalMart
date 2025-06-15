import React, { useEffect, useState } from "react";
import "./Order.css";
import "./seller.css";

// Get seller ID from localStorage
const getCurrentUserId = () => {
  const user = localStorage.getItem("user");
  if (user) {
    const userData = JSON.parse(user);
    return userData.id || userData._id || userData.userId;
  }
  return localStorage.getItem("userId");
};

// Map status to colors
const statusColors = {
  pending: "red",
  confirmed: "#4caf50",
  delivered: "#ffc107",
};

function Order() {
  const [orders, setOrders] = useState([]);
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    isSuccess: true,
  });
  const [loading, setLoading] = useState({ type: "", id: null });

  const sellerId = getCurrentUserId();

  // Show notification helper
  const showNotification = (message, isSuccess = true) => {
    setNotification({ show: true, message, isSuccess });
    setTimeout(() => {
      setNotification((prev) => ({ ...prev, show: false }));
    }, 3000);
  };

  // Fetch orders for the seller with token header
  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:5000/api/orders/seller`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const json = await response.json();

      if (!response.ok) throw new Error(json.message || "Failed to fetch orders");

      setOrders(json.data);
    } catch (error) {
      showNotification(error.message, false);
    }
  };

  useEffect(() => {
    if (sellerId) {
      fetchOrders();
    }
  }, [sellerId]);

  // Update order status API call with PATCH and token header
  const updateOrderStatus = async (orderId, newStatus) => {
    setLoading({ type: "order", id: orderId });
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:5000/api/orders/${orderId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || "Failed to update order status");
      }

      await fetchOrders();

      let message = "";
      if (newStatus === "confirmed") {
        message = `Order #${orderId} accepted and being prepared!`;
      } else if (newStatus === "delivered") {
        message = `Order #${orderId} marked as delivered!`;
      }
      showNotification(message);
    } catch (error) {
      showNotification(error.message, false);
    } finally {
      setLoading({ type: "", id: null });
    }
  };

  // Complete order handler
  const completeOrder = (orderId) => {
    const order = orders.find((o) => o._id === orderId);
    if (!order) return;

    if (order.status === "confirmed") {
      updateOrderStatus(orderId, "delivered");
    } else {
      showNotification("Cannot complete order unless it is confirmed.", false);
    }
  };

  // Group orders by status
  const pendingOrders = Array.isArray(orders) ? orders.filter(order => order.status === "pending") : [];
  const confirmedOrders = Array.isArray(orders) ? orders.filter(order => order.status === "confirmed") : [];
  const deliveredOrders = Array.isArray(orders) ? orders.filter(order => order.status === "delivered") : [];

  // Render order card (same as before)
  const renderOrderCard = (order) => (
    <div key={order._id} className="order-card">
      <h3>
        Order #{order.orderNumber}
        <span
          className="order-status"
          style={{
            backgroundColor: statusColors[order.status] || "grey",
            color: "white",
            padding: "0.25em 0.8em",
            borderRadius: "20px",
            marginLeft: "10px",
            fontSize: "0.75em",
            fontWeight: "600",
            minWidth: "60px",
            textAlign: "center",
            display: "inline-block",
          }}
        >
          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
        </span>
      </h3>
      <div className="order-info">
        <p><strong>Customer:</strong> {order.buyer.name || order.buyer.email}</p>
        <p><strong>Address:</strong> {order.deliveryAddress}</p>
        <p><strong>Mobile:</strong> {order.phoneNumber}</p>
        <p><strong>Items:</strong> {order.items.map((item) => `${item.itemName} x${item.quantity}`).join(", ")}</p>
        <p><strong>Total:</strong> Rs. {order.totalAmount}</p>
        <div className="action-buttons" style={{ display: "flex", gap: "10px" }}>
          {order.status === "pending" && (
            <button
              className="btn"
              onClick={() => updateOrderStatus(order._id, "confirmed")}
              disabled={loading.type === "order" && loading.id === order._id}
            >
              {loading.type === "order" && loading.id === order._id ? (
                <>
                  <div className="loading-spinner"></div> Updating...
                </>
              ) : (
                "Accept Order"
              )}
            </button>
          )}

          {(order.status === "confirmed" || order.status === "pending") && (
            <button
              className="btn btn-outline"
              onClick={() => completeOrder(order._id)}
              disabled={loading.type === "order" && loading.id === order._id}
            >
              {loading.type === "order" && loading.id === order._id ? (
                <>
                  <div className="loading-spinner"></div> Updating...
                </>
              ) : (
                "Complete Order"
              )}
            </button>
          )}

          {order.status === "delivered" && (
            <button
              className="btn btn-outline"
              style={{ backgroundColor: "#faa500", color: "white", cursor: "not-allowed" }}
              disabled
            >
              Completed
            </button>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div id="orders">
      <div className="header">
        <h1>All Orders</h1>
        <p>Manage and track all your customer orders here.</p>
      </div>

      {/* Pending Orders Section */}
      <div className="order-section" style={{ marginBottom: "40px" }}>
        <h2 style={{ color: "red", borderBottom: "2px solid red", paddingBottom: "10px" }}>
          Pending Orders ({pendingOrders.length})
        </h2>
        <div className="orders">
          {pendingOrders.length === 0 ? (
            <p>No pending orders.</p>
          ) : (
            pendingOrders.map(renderOrderCard)
          )}
        </div>
      </div>

      {/* Confirmed Orders Section */}
      <div className="order-section" style={{ marginBottom: "40px" }}>
        <h2 style={{ color: "#4caf50", borderBottom: "2px solid #4caf50", paddingBottom: "10px" }}>
          Confirmed Orders ({confirmedOrders.length})
        </h2>
        <div className="orders">
          {confirmedOrders.length === 0 ? (
            <p>No confirmed orders.</p>
          ) : (
            confirmedOrders.map(renderOrderCard)
          )}
        </div>
      </div>

      {/* Delivered Orders Section */}
      <div className="order-section" style={{ marginBottom: "40px" }}>
        <h2 style={{ color: "#ffc107", borderBottom: "2px solid #ffc107", paddingBottom: "10px" }}>
          Delivered Orders ({deliveredOrders.length})
        </h2>
        <div className="orders">
          {deliveredOrders.length === 0 ? (
            <p>No delivered orders.</p>
          ) : (
            deliveredOrders.map(renderOrderCard)
          )}
        </div>
      </div>

      {notification.show && (
        <div className={`notification ${notification.isSuccess ? "success" : "error"}`}>
          {notification.message}
        </div>
      )}
    </div>
  );
}

export default Order;
