import React from "react";
import { useState, useEffect } from "react";
import "@fortawesome/fontawesome-free/css/all.min.css"; // Import Font Awesome
import TimePicker from "react-time-picker";
import "react-time-picker/dist/TimePicker.css";
import "react-clock/dist/Clock.css";
import "./buyer.css";
import ExploreShopsContent from "./buyer-dashboard/ExploreShopsContent";
import MyCartContent from "./buyer-dashboard/MyCartContent";
import NotificationsComponent from "./buyer-dashboard/NotificationsComponent";
import BuyerSettings from "./buyer-dashboard/BuyerSettings";
import FavoriteSection from "./buyer-dashboard/FavoriteSection";
import DashboardContent from "./buyer-dashboard/DashboardContent";
import authService from "../../services/authService"; // Add this import

// Sidebar Component
function Sidebar({ activeMenu, setActiveMenu, userName }) {
  const menuItems = [
    { name: "Dashboard", icon: "fa-tachometer-alt" },
    { name: "Explore Shops", icon: "fa-store" },
    { name: "My Cart", icon: "fa-shopping-cart" },
    { name: "Favorites", icon: "fa-heart" },
    { name: "Notifications", icon: "fa-bell" },
    { name: "Settings", icon: "fa-cog" },
  ];

  return (
    <aside className="buyer-sidebar">
      <div
        className="buyer-sidebar-brand"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "50px",
          fontWeight: "bold",
          marginBottom: "10px",
          fontSize: "23px", // font size increased by 5px
          textRendering: "optimizeLegibility",
          WebkitFontSmoothing: "antialiased",
          MozOsxFontSmoothing: "grayscale",
          letterSpacing: "0.5px",
          color: "#FAA500", // updated font color
        }}
      >
        <i
          className="fas fa-store"
          style={{
            marginRight: "6px",
            fontSize: "23px",
            color: "#FAA500",
          }}
        ></i>
        <span style={{ fontSize: "23px", color: "#FAA500" }}>LocalMart</span>
      </div>
      <ul className="buyer-sidebar-menu">
        {menuItems.map((item, index) => (
          <li key={index}>
            <a
              href="#"
              className={`buyer-sidebar-link ${
                item.name === activeMenu ? "active" : ""
              }`}
              onClick={(e) => {
                e.preventDefault();
                setActiveMenu(item.name);
              }}
            >
              <i className={`fa-solid ${item.icon}`}></i>
              <span>{item.name}</span>
            </a>
          </li>
        ))}
      </ul>
      <div className="buyer-sidebar-footer">
        <a
          href="#"
          className="buyer-logout-button"
          onClick={(e) => {
            e.preventDefault();
            if (window.confirm("Are you sure you want to logout?")) {
              authService.logout(); // Use authService logout method
              window.location.href = "/";
            }
          }}
        >
          <i className="fa-solid fa-sign-out-alt"></i>
          <span>Logout</span>
        </a>
      </div>
    </aside>
  );
}

// Special Offers Component
function SpecialOffers() {
  return (
    <div className="buyer-special-offers">
      <h2 className="buyer-offer-title">Special Offers:</h2>
      <p className="buyer-offer-description">
        20% off all food items this weekend!
      </p>
      <img
        src="https://via.placeholder.com/600x150"
        alt="Special Offer"
        className="buyer-offer-image"
      />
    </div>
  );
}

// Footer Component
function Footer() {
  return (
    <footer className="buyer-footer">
      <div className="buyer-footer-content">
        <span className="buyer-footer-logo">L</span>
        <span className="buyer-footer-text">
          LOCALMART - YOUR LOCAL MARKETPLACE
        </span>
      </div>
    </footer>
  );
}

function BuyerDashboard() {
  const [activeMenu, setActiveMenu] = useState("Dashboard");
  const [userName, setUserName] = useState(""); // Add state for username
  const [loading, setLoading] = useState(true); // Add loading state

  // Get username from database on component mount
  useEffect(() => {
    const fetchUserName = async () => {
      try {
        setLoading(true);
        const currentUser = await authService.getCurrentUser();
        if (currentUser && currentUser.name) {
          setUserName(currentUser.name);
        }
      } catch (error) {
        console.error("Error fetching user name:", error);
        // Fallback to localStorage if API call fails
        const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
        if (storedUser && storedUser.name) {
          setUserName(storedUser.name);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserName();
  }, []);

  const renderContent = () => {
    switch (activeMenu) {
      case "Explore Shops":
        return <ExploreShopsContent />;
      case "My Cart":
        return <MyCartContent />;
      case "Notifications":
        return <NotificationsComponent />;
      case "Settings":
        return <BuyerSettings />;
      case "Favorites":
        return <FavoriteSection />;
      case "Dashboard":
      default:
        return <DashboardContent userName={userName} />; // Pass userName to DashboardContent
    }
  };

  // Show loading screen while fetching user data
  if (loading) {
    return (
      <div className="buyer-app-container">
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
            fontSize: "18px",
            color: "#666",
          }}
        >
          Loading...
        </div>
      </div>
    );
  }

  return (
    <div className="buyer-app-container">
      <div className="buyer-main-container">
        <Sidebar
          activeMenu={activeMenu}
          setActiveMenu={setActiveMenu}
          userName={userName} // Pass username to Sidebar
        />
        <div className="buyer-content-area">{renderContent()}</div>
      </div>
    </div>
  );
}

export default BuyerDashboard;
