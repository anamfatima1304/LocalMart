import React, { useEffect, useState } from 'react';
import { Heart } from 'lucide-react';
import '@fortawesome/fontawesome-free/css/all.min.css';
import "../buyer.css";

// Get buyer ID
const getCurrentUserId = () => {
  const user = localStorage.getItem('user');
  if (user) {
    const userData = JSON.parse(user);
    return userData.id || userData._id || userData.userId;
  }
  return localStorage.getItem('userId');
};

// Load favorite shops
const getFavorites = () => {
  const userId = getCurrentUserId();
  if (!userId) return [];
  const favoritesKey = `favoriteShops_${userId}`;
  const favorites = localStorage.getItem(favoritesKey);
  return favorites ? JSON.parse(favorites) : [];
};

// Status tag colors
const statusColors = {
  pending: "red",
  confirmed: "#4caf50",
  delivered: "#ffc107",
};

function DashboardContent() {
  const [orders, setOrders] = useState([]);
  const [favoriteShops, setFavoriteShops] = useState([]);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    // Fetch buyer name
    const user = localStorage.getItem("user");
    if (user) {
      const parsed = JSON.parse(user);
      setUserName(parsed.name || parsed.username || "User");
    }

    // Fetch orders
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:5000/api/orders/buyer", {
          headers: { Authorization: `Bearer ${token}` }
        });
        const json = await res.json();
        if (res.ok) {
          setOrders(json.data || []);
        } else {
          console.error("Order fetch failed:", json.message);
        }
      } catch (err) {
        console.error("Fetch error:", err.message);
      }
    };

    fetchOrders();

    // Load favorites
    const favs = getFavorites();
    setFavoriteShops(favs);
  }, []);

  const pendingOrders = orders.filter(o => o.status === "pending");
  const confirmedOrders = orders.filter(o => o.status === "confirmed");
  const deliveredOrders = orders.filter(o => o.status === "delivered");

  const renderOrderCard = (order) => (
    <div key={order._id} className="order-card">
      <h3>
        Order #{order.orderNumber || order._id.slice(-6)}
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
        <p><strong>Date:</strong> {new Date(order.createdAt).toLocaleDateString()}</p>
        <p><strong>Items:</strong> {order.items?.map(item => `${item.itemName} x${item.quantity}`).join(", ")}</p>
        <p><strong>Total:</strong> Rs. {order.totalAmount}</p>
        <p><strong>Delivery Address:</strong> {order.deliveryAddress}</p>
      </div>
    </div>
  );

  return (
    <div className="buyer-dashboard-content">
      {/* Header */}
      <div className="buyer-welcome-section">
        <div>
          <h1 className="buyer-dashboard-title">Welcome back, {userName}!</h1>
          <p className="buyer-dashboard-subtitle">Here's your current order activity.</p>
        </div>
      </div>

      {/* Top Stats */}
      <div className="buyer-stats-grid">
        <div className="buyer-stat-card total-orders">
          <i className="fa-solid fa-shopping-bag buyer-stat-icon"></i>
          <div>
            <h3 className="buyer-stat-value">{orders.length}</h3>
            <p className="buyer-stat-label">Total Orders</p>
          </div>
        </div>
        <div className="buyer-stat-card pending-orders">
          <i className="fa-solid fa-clock buyer-stat-icon"></i>
          <div>
            <h3 className="buyer-stat-value">{pendingOrders.length}</h3>
            <p className="buyer-stat-label">Pending Orders</p>
          </div>
        </div>
        <div className="buyer-stat-card confirmed-orders">
          <i className="fa-solid fa-check buyer-stat-icon"></i>
          <div>
            <h3 className="buyer-stat-value">{confirmedOrders.length}</h3>
            <p className="buyer-stat-label">Confirmed Orders</p>
          </div>
        </div>
        <div className="buyer-stat-card favorites">
          <i className="fa-solid fa-heart buyer-stat-icon"></i>
          <div>
            <h3 className="buyer-stat-value">{favoriteShops.length}</h3>
            <p className="buyer-stat-label">Favorite Shops</p>
          </div>
        </div>
      </div>

      {/* Orders Grouped */}
      <div className="buyer-orders-section" style={{ marginTop: "2rem" }}>
        {/* Beautified Title Card */}
        <div style={{
          backgroundColor: "#fff",
          padding: "24px",
          borderRadius: "12px",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
          marginBottom: "2rem",
          borderLeft: "6px solid #4caf50"
        }}>
          <h2 style={{
            margin: 0,
            fontSize: "1.8rem",
            color: "#4caf50",
            fontWeight: "700"
          }}>
            Your Orders
          </h2>
          <p style={{
            color: "#000",
            marginTop: "10px",
            fontSize: "1.05rem",
            fontWeight: "500"
          }}>
            Here's a summary of all your recent orders categorized by their status.
          </p>
        </div>

        {/* Pending Orders */}
        <div className="order-section" style={{ marginBottom: "40px" }}>
          <h2 style={{ color: "red", borderBottom: "2px solid red", paddingBottom: "10px" }}>
            Pending Orders ({pendingOrders.length})
          </h2>
          <div className="orders">
            {pendingOrders.length === 0 ? (
              <p style={{ color: "#999", fontStyle: "italic" }}>No pending orders.</p>
            ) : (
              pendingOrders.map(renderOrderCard)
            )}
          </div>
        </div>

        {/* Confirmed Orders */}
        <div className="order-section" style={{ marginBottom: "40px" }}>
          <h2 style={{ color: "#4caf50", borderBottom: "2px solid #4caf50", paddingBottom: "10px" }}>
            Confirmed Orders ({confirmedOrders.length})
          </h2>
          <div className="orders">
            {confirmedOrders.length === 0 ? (
              <p style={{ color: "#999", fontStyle: "italic" }}>No confirmed orders.</p>
            ) : (
              confirmedOrders.map(renderOrderCard)
            )}
          </div>
        </div>

        {/* Delivered Orders */}
        <div className="order-section" style={{ marginBottom: "40px" }}>
          <h2 style={{ color: "#ffc107", borderBottom: "2px solid #ffc107", paddingBottom: "10px" }}>
            Delivered Orders ({deliveredOrders.length})
          </h2>
          <div className="orders">
            {deliveredOrders.length === 0 ? (
              <p style={{ color: "#999", fontStyle: "italic" }}>No delivered orders.</p>
            ) : (
              deliveredOrders.map(renderOrderCard)
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardContent;
