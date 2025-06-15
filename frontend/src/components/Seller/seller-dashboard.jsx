import React, { useState, useEffect } from "react";
import "./seller-dasbboard.css";
import NotificationsComponent from "./Seller-Dashboard-Components/Notifications";
import Reviews from "./Seller-Dashboard-Components/Reviews";
import Messages from "./Seller-Dashboard-Components/Messages";
import Settings from "./Seller-Dashboard-Components/Settings";
import Menu from "./Seller-Dashboard-Components/Menu";
import Order from "./Seller-Dashboard-Components/Order";
import authService from "../../services/authService";

const statusColors = {
  pending: "red",
  confirmed: "#4caf50",
  delivered: "#ffc107",
};

const SellerDashboard = () => {
  const [activeSection, setActiveSection] = useState("dashboard");
  const [notification, setNotification] = useState({ show: false, message: "", isSuccess: true });
  const [userName, setUserName] = useState("");
  const [userLoading, setUserLoading] = useState(true);
  const [loading, setLoading] = useState({ type: "", id: null });

  const [allOrders, setAllOrders] = useState([]);
  const [pendingOrders, setPendingOrders] = useState([]);

  const getToken = () => localStorage.getItem("token");

  useEffect(() => {
    const fetchUserName = async () => {
      try {
        setUserLoading(true);
        const currentUser = await authService.getCurrentUser();
        if (currentUser && currentUser.name) {
          setUserName(currentUser.name);
        }
      } catch (error) {
        const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
        if (storedUser?.name) setUserName(storedUser.name);
      } finally {
        setUserLoading(false);
      }
    };
    fetchUserName();
  }, []);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = getToken();
        const response = await fetch("http://localhost:5000/api/orders/seller", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const json = await response.json();
        if (!response.ok) throw new Error(json.message || "Failed to fetch orders");
        setAllOrders(json.data || []);
        setPendingOrders(json.data.filter((o) => o.status === "pending"));
      } catch (error) {
        showNotification(error.message, false);
      }
    };
    fetchOrders();
  }, []);

  const showNotification = (message, isSuccess = true) => {
    setNotification({ show: true, message, isSuccess });
    setTimeout(() => setNotification((prev) => ({ ...prev, show: false })), 3000);
  };

  const totalOrders = allOrders.length;
  const totalSales = allOrders.reduce((sum, order) => sum + order.totalAmount, 0);
  const totalCustomers = new Set(allOrders.map((o) => o.buyer._id)).size;
  const totalPending = pendingOrders.length;

  const updateOrderStatus = async (orderId, newStatus) => {
    setLoading({ type: "order", id: orderId });
    try {
      const token = getToken();
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

      const refreshed = await fetch("http://localhost:5000/api/orders/seller", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const refreshedJson = await refreshed.json();
      setAllOrders(refreshedJson.data || []);
      setPendingOrders(refreshedJson.data.filter((o) => o.status === "pending"));

      let message = newStatus === "confirmed"
        ? `Order #${orderId} accepted and being prepared!`
        : `Order #${orderId} marked as delivered!`;
      showNotification(message);
    } catch (error) {
      showNotification(error.message, false);
    } finally {
      setLoading({ type: "", id: null });
    }
  };

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
            <button className="btn" onClick={() => updateOrderStatus(order._id, "confirmed")}
              disabled={loading.type === "order" && loading.id === order._id}>
              {loading.type === "order" && loading.id === order._id ? (
                <><div className="loading-spinner"></div> Updating...</>
              ) : "Accept Order"}
            </button>
          )}
          {(order.status === "confirmed" || order.status === "pending") && (
            <button className="btn btn-outline" onClick={() => updateOrderStatus(order._id, "delivered")}
              disabled={loading.type === "order" && loading.id === order._id}>
              {loading.type === "order" && loading.id === order._id ? (
                <><div className="loading-spinner"></div> Updating...</>
              ) : "Complete Order"}
            </button>
          )}
          {order.status === "delivered" && (
            <button className="btn btn-outline" disabled>Completed</button>
          )}
        </div>
      </div>
    </div>
  );

  const navItems = [
    { id: "dashboard", icon: "fas fa-home", label: "Dashboard" },
    { id: "orders", icon: "fas fa-shopping-bag", label: "Orders" },
    { id: "updateMenu", icon: "fas fa-utensils", label: "Menu Items" },
    // { id: "review", icon: "fas fa-star", label: "Reviews" },
    // { id: "messages", icon: "fas fa-comments", label: "Messages" },
    // { id: "notifications", icon: "fas fa-bell", label: "Notifications" },
    { id: "settings", icon: "fas fa-cog", label: "Settings" },
  ];

  const renderDashboard = () => (
    <div id="dashboard">
      <div className="header">
        <h1>Welcome, {userLoading ? "Loading..." : userName || "Seller"}!</h1>
        <p>Here's an overview of your business performance</p>
      </div>
      <div className="stats-container">
        <div className="stat-card"><h3>Total Orders</h3><div className="value">{totalOrders}</div></div>
        <div className="stat-card"><h3>Sales</h3><div className="value">Rs. {totalSales.toLocaleString()}</div></div>
        <div className="stat-card"><h3>Customers</h3><div className="value">{totalCustomers}</div></div>
        <div className="stat-card"><h3>Pending Orders</h3><div className="value">{totalPending}</div></div>
      </div>

      <div className="header" style={{ marginTop: "2rem" }}>
        <h1>Pending Orders</h1>
        <p>Orders awaiting your confirmation</p>
      </div>
      <div className="orders">
        {pendingOrders.length === 0 && <p>No pending orders.</p>}
        {pendingOrders.map(renderOrderCard)}
      </div>
    </div>
  );

  const renderSection = {
    dashboard: renderDashboard,
    orders: () => <Order />,
    updateMenu: () => <Menu />,
    review: () => <Reviews />,
    messages: () => <Messages />,
    notifications: () => <NotificationsComponent />,
    settings: () => <Settings />,
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <div className="sidebar">
        <div className=".logo-container">
          <div className="logo"><i className="fas fa-store"></i><span> LocalMart</span></div>
        </div>
        {navItems.map((item) => (
          <a key={item.id} href="#" className={`nav-link ${activeSection === item.id ? "active" : ""}`}
            onClick={(e) => { e.preventDefault(); setActiveSection(item.id); }}>
            <i className={item.icon}></i><span>{item.label}</span>
          </a>
        ))}
        <a href="#" className="nav-link" onClick={(e) => {
          e.preventDefault();
          if (window.confirm("Are you sure you want to logout?")) authService.logout();
        }}>
          <i className="fas fa-sign-out-alt"></i><span>Logout</span>
        </a>
      </div>
      <div className="main">{renderSection[activeSection]()}</div>
      <div className={`notification ${notification.show ? "show" : ""}`}
        style={{ backgroundColor: notification.isSuccess ? "var(--success)" : "var(--danger)" }}>
        <span>{notification.message}</span>
      </div>
    </div>
  );
};

export default SellerDashboard;
