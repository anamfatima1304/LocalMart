// Updated SellerDashboard to show name on dashboard top like BuyerDashboard
import React, { useState, useEffect } from "react";
import "./seller-dasbboard.css";
import NotificationsComponent from "./Seller-Dashboard-Components/Notifications";
import Reviews from "./Seller-Dashboard-Components/Reviews";
import Messages from "./Seller-Dashboard-Components/Messages";
import Settings from "./Seller-Dashboard-Components/Settings";
import Menu from "./Seller-Dashboard-Components/Menu";
import Order from "./Seller-Dashboard-Components/Order";
import authService from "../../services/authService";

const SellerDashboard = () => {
  const [activeSection, setActiveSection] = useState("dashboard");
  const [notification, setNotification] = useState({ show: false, message: "", isSuccess: true });
  const [userName, setUserName] = useState("");
  const [loading, setLoading] = useState({ type: "", id: null });
  const [userLoading, setUserLoading] = useState(true);

  useEffect(() => {
    const fetchUserName = async () => {
      try {
        setUserLoading(true);
        const currentUser = await authService.getCurrentUser();
        if (currentUser && currentUser.name) {
          setUserName(currentUser.name);
        }
      } catch (error) {
        console.error('Error fetching user name:', error);
        const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
        if (storedUser && storedUser.name) {
          setUserName(storedUser.name);
        }
      } finally {
        setUserLoading(false);
      }
    };
    fetchUserName();
  }, []);

  const navItems = [
    { id: "dashboard", icon: "fas fa-home", label: "Dashboard" },
    { id: "orders", icon: "fas fa-shopping-bag", label: "Orders" },
    { id: "updateMenu", icon: "fas fa-utensils", label: "Menu Items" },
    { id: "review", icon: "fas fa-star", label: "Reviews" },
    { id: "messages", icon: "fas fa-comments", label: "Messages" },
    { id: "notifications", icon: "fas fa-bell", label: "Notifications" },
    { id: "settings", icon: "fas fa-cog", label: "Settings" },
  ];

  const showSection = (section) => setActiveSection(section);

  const showNotification = (message, isSuccess = true) => {
    setNotification({ show: true, message, isSuccess });
    setTimeout(() => setNotification((prev) => ({ ...prev, show: false })), 3000);
  };

  const updateOrderStatus = (orderId, status) => {
    setLoading({ type: "order", id: orderId });
    setTimeout(() => {
      setLoading({ type: "", id: null });
      const msg = status === "processing"
        ? `Order #${orderId} accepted and being prepared!`
        : `Order #${orderId} marked as delivered!`;
      showNotification(msg);
    }, 1000);
  };

  const viewOrderDetails = (orderId) => showNotification(`Viewing details for Order #${orderId}`);

  const renderDashboard = () => (
    <div id="dashboard">
      <div className="header">
        <h1>Welcome, {userLoading ? 'Loading...' : (userName || 'Seller')}!</h1>
        <p>Here's an overview of your business performance</p>
      </div>
      <div className="stats-container">
        <div className="stat-card"><h3>Total Orders</h3><div className="value">245</div></div>
        <div className="stat-card"><h3>Today's Sales</h3><div className="value">Rs. 12,450</div></div>
        <div className="stat-card"><h3>New Customers</h3><div className="value">8</div></div>
        <div className="stat-card"><h3>Rating</h3><div className="value">4.8 <i className="fas fa-star" style={{ color: "#FFC107", fontSize: "20px" }}></i></div></div>
      </div>
      <div className="header">
        <h1>Recent Orders</h1>
        <p>Your latest orders requiring attention</p>
      </div>
      <div className="orders">
        {/* Example Order Card */}
        {/* You can dynamically render orders here */}
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
          <div className="logo">
            <i className="fas fa-store"></i>
            <span> LocalMart</span>
          </div>
        </div>
        {navItems.map((item) => (
          <a key={item.id} href="#" className={`nav-link ${activeSection === item.id ? "active" : ""}`} onClick={(e) => { e.preventDefault(); showSection(item.id); }}>
            <i className={item.icon}></i><span>{item.label}</span>
          </a>
        ))}
        <a href="#" className="nav-link" onClick={(e) => {
          e.preventDefault();
          if (window.confirm("Are you sure you want to logout?")) {
            authService.logout();
          }
        }}>
          <i className="fas fa-sign-out-alt"></i>
          <span>Logout</span>
        </a>
      </div>
      <div className="main">{renderSection[activeSection]()}</div>
      <div className={`notification ${notification.show ? "show" : ""}`} style={{ backgroundColor: notification.isSuccess ? "var(--success)" : "var(--danger)" }}>
        <span>{notification.message}</span>
      </div>
    </div>
  );
};

export default SellerDashboard;
