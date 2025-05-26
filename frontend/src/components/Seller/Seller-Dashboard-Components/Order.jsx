import React, { useState } from "react";
import "./Order.css";
import "./seller.css";

function Order() {
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    isSuccess: true,
  });

  const [loading, setLoading] = useState({ type: "", id: null });

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

  return (
    <div id="orders">
      <div className="header">
        <h1>All Orders</h1>
        <p>Manage and track all your customer orders here.</p>
      </div>

      <div className="orders">
        {[
          {
            id: 1028,
            customer: "Aisha Khan",
            address: "Street 12, F-10, Islamabad",
            mobile: "+92 300 1234567",
            items: "Vegetable Biryani x1, Raita x1",
            total: "Rs. 450",
            status: "New",
          },
          {
            id: 1027,
            customer: "Muhammad Usman",
            address: "Block C, Bahria Town, Lahore",
            mobile: "+92 333 4567890",
            items: "Chicken Karahi x1, Naan x3",
            total: "Rs. 850",
            status: "Processing",
          },
          {
            id: 1023,
            customer: "Sarah Khan",
            address: "Street 12, G-11, Islamabad",
            mobile: "+92 300 1234567",
            items: "Chicken Biryani x2, Drink x1",
            total: "Rs. 750",
            status: "Delivered",
          },
          {
            id: 1024,
            customer: "Ahmed Ali",
            address: "House #45, Model Town, Lahore",
            mobile: "+92 301 2345678",
            items: "Burger x1, Fries x1",
            total: "Rs. 450",
            status: "Delivered",
          },
        ].map((order) => (
          <div key={order.id} className="order-card">
            <h3>
              Order #{order.id}
              <span className="order-status">{order.status}</span>
            </h3>
            <div className="order-info">
              <p>
                <strong>Customer:</strong> {order.customer}
              </p>
              <p>
                <strong>Address:</strong> {order.address}
              </p>
              <p>
                <strong>Mobile:</strong> {order.mobile}
              </p>
              <p>
                <strong>Items:</strong> {order.items}
              </p>
              <p>
                <strong>Total:</strong> {order.total}
              </p>
              <div className="action-buttons">
                {order.status === "New" && (
                  <button
                    className="btn"
                    onClick={() => updateOrderStatus(order.id, "processing")}
                    disabled={
                      loading.type === "order" && loading.id === order.id
                    }
                  >
                    {loading.type === "order" && loading.id === order.id ? (
                      <>
                        <div className="loading-spinner"></div> Updating...
                      </>
                    ) : (
                      "Accept Order"
                    )}
                  </button>
                )}
                {order.status === "Processing" && (
                  <button
                    className="btn"
                    onClick={() => updateOrderStatus(order.id, "delivered")}
                    disabled={
                      loading.type === "order" && loading.id === order.id
                    }
                  >
                    {loading.type === "order" && loading.id === order.id ? (
                      <>
                        <div className="loading-spinner"></div> Updating...
                      </>
                    ) : (
                      "Mark as Delivered"
                    )}
                  </button>
                )}
                <button
                  className="btn btn-outline"
                  onClick={() => viewOrderDetails(order.id)}
                >
                  View Details
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Order;
