import React, { useState } from "react";
import "./seller-dasbboard.css";
import NotificationsComponent from "./Seller-Dashboard-Components/Notifications";
import Reviews from "./Seller-Dashboard-Components/Reviews";
import Messages from "./Seller-Dashboard-Components/Messages";
import Settings from "./Seller-Dashboard-Components/Settings";
import Menu from "./Seller-Dashboard-Components/Menu";
import Order from "./Seller-Dashboard-Components/Order";

const SellerDashboard = () => {
  const [activeSection, setActiveSection] = useState("dashboard");
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    isSuccess: true,
  });

  const [loading, setLoading] = useState({ type: "", id: null });

  const navItems = [
    { id: "dashboard", icon: "fas fa-home", label: "Dashboard" },
    { id: "orders", icon: "fas fa-shopping-bag", label: "Orders" },
    { id: "updateMenu", icon: "fas fa-utensils", label: "Menu Items" },
    { id: "review", icon: "fas fa-star", label: "Reviews" },
    { id: "messages", icon: "fas fa-comments", label: "Messages" },
    { id: "notifications", icon: "fas fa-bell", label: "Notifications" },
    { id: "settings", icon: "fas fa-cog", label: "Settings" },
  ];

  const showSection = (section) => {
    setActiveSection(section);
  };

  const showNotification = (message, isSuccess = true) => {
    setNotification({ show: true, message, isSuccess });
    setTimeout(() => {
      setNotification((prev) => ({ ...prev, show: false }));
    }, 3000);
  };

  const updateOrderStatus = (orderId, status) => {
    setLoading({ type: "order", id: orderId });

    setTimeout(() => {
      setLoading({ type: "", id: null });

      let message;
      if (status === "processing") {
        message = `Order #${orderId} accepted and being prepared!`;
      } else if (status === "delivered") {
        message = `Order #${orderId} marked as delivered!`;
      }

      showNotification(message);
    }, 1000);
  };

  const viewOrderDetails = (orderId) => {
    showNotification(`Viewing details for Order #${orderId}`);
  };

  const renderDashboard = () => (
    <div id="dashboard">
      <div className="header">
        <h1>Welcome, Green Garden Restaurant!</h1>
        <p>Here's an overview of your business performance</p>
      </div>

      <div className="stats-container">
        <div className="stat-card">
          <h3>Total Orders</h3>
          <div className="value">245</div>
        </div>
        <div className="stat-card">
          <h3>Today's Sales</h3>
          <div className="value">Rs. 12,450</div>
        </div>
        <div className="stat-card">
          <h3>New Customers</h3>
          <div className="value">8</div>
        </div>
        <div className="stat-card">
          <h3>Rating</h3>
          <div className="value">
            4.8{" "}
            <i
              className="fas fa-star"
              style={{ color: "#FFC107", fontSize: "20px" }}
            ></i>
          </div>
        </div>
      </div>

      <div className="header">
        <h1>Recent Orders</h1>
        <p>Your latest orders requiring attention</p>
      </div>

      <div className="orders">
        <div className="order-card">
          <h3>
            Order #1028
            <span className="order-status">New</span>
          </h3>
          <div className="order-info">
            <p>
              <strong>Customer:</strong> Aisha Khan
            </p>
            <p>
              <strong>Address:</strong> Street 12, F-10, Islamabad
            </p>
            <p>
              <strong>Mobile:</strong> +92 300 1234567
            </p>
            <p>
              <strong>Items:</strong> Vegetable Biryani x1, Raita x1
            </p>
            <p>
              <strong>Total:</strong> Rs. 450
            </p>
            <div className="action-buttons">
              <button
                className="btn"
                onClick={() => updateOrderStatus(1028, "processing")}
                disabled={loading.type === "order" && loading.id === 1028}
              >
                {loading.type === "order" && loading.id === 1028 ? (
                  <>
                    <div className="loading-spinner"></div> Updating...
                  </>
                ) : (
                  "Accept Order"
                )}
              </button>
              <button
                className="btn btn-outline"
                onClick={() => viewOrderDetails(1028)}
              >
                View Details
              </button>
            </div>
          </div>
        </div>

        <div className="order-card">
          <h3>
            Order #1027
            <span className="order-status">Processing</span>
          </h3>
          <div className="order-info">
            <p>
              <strong>Customer:</strong> Muhammad Usman
            </p>
            <p>
              <strong>Address:</strong> Block C, Bahria Town, Lahore
            </p>
            <p>
              <strong>Mobile:</strong> +92 333 4567890
            </p>
            <p>
              <strong>Items:</strong> Chicken Karahi x1, Naan x3
            </p>
            <p>
              <strong>Total:</strong> Rs. 850
            </p>
            <div className="action-buttons">
              <button
                className="btn"
                onClick={() => updateOrderStatus(1027, "delivered")}
                disabled={loading.type === "order" && loading.id === 1027}
              >
                {loading.type === "order" && loading.id === 1027 ? (
                  <>
                    <div className="loading-spinner"></div> Updating...
                  </>
                ) : (
                  "Mark as Delivered"
                )}
              </button>
              <button
                className="btn btn-outline"
                onClick={() => viewOrderDetails(1027)}
              >
                View Details
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderOrders = () => (
    <div id="orders">
      <Order />
    </div>
  );

  const renderUpdateMenu = () => (
    <div id="updateMenu">
      <Menu />
    </div>
  );

  const renderReview = () => (
    <div id="reviews">
      <Reviews />
    </div>
  );

  const renderMessages = () => (
    <div id="messages">
      <Messages />
    </div>
  );

  const renderNotifications = () => (
    <div id="notifications">
      <NotificationsComponent />
    </div>
  );

  const renderSettings = () => (
    <div id="settings">
      <Settings />
    </div>
  );

  const renderCurrentSection = () => {
    switch (activeSection) {
      case "dashboard":
        return renderDashboard();
      case "orders":
        return renderOrders();
      case "updateMenu":
        return renderUpdateMenu();
      case "messages":
        return renderMessages();
      case "settings":
        return renderSettings();
      case "review":
        return renderReview();
      case "notifications":
        return renderNotifications();
      default:
        return renderDashboard();
    }
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
          <a
            key={item.id}
            href="#"
            className={`nav-link ${activeSection === item.id ? "active" : ""}`}
            onClick={(e) => {
              e.preventDefault();
              showSection(item.id);
            }}
          >
            <i className={item.icon}></i>
            <span>{item.label}</span>
          </a>
        ))}

        <a
          href="#"
          className="nav-link"
          onClick={(e) => {
            e.preventDefault();
            if (window.confirm("Are you sure you want to logout?")) {
              localStorage.clear();
              sessionStorage.clear();
              window.location.href = "/login";
            }
          }}
        >
          <i className="fas fa-sign-out-alt"></i>
          <span>Logout</span>
        </a>
      </div>

      <div className="main">{renderCurrentSection()}</div>

      <div
        className={`notification ${notification.show ? "show" : ""}`}
        style={{
          backgroundColor: notification.isSuccess
            ? "var(--success)"
            : "var(--danger)",
        }}
      >
        <span>{notification.message}</span>
      </div>
    </div>
  );
};

export default SellerDashboard;
