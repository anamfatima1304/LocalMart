import React, { useState } from "react";
import "./Menu.css";

function Menu() {
  const [menuForm, setMenuForm] = useState({
    itemName: "",
    price: "",
    category: "",
    description: "",
    availability: true,
  });
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

  const handleMenuFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setMenuForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const saveMenuItem = (e) => {
    e.preventDefault();
    setLoading({ type: "saveMenu", id: null });

    setTimeout(() => {
      setLoading({ type: "", id: null });
      setMenuForm({
        itemName: "",
        price: "",
        category: "",
        description: "",
        availability: true,
      });
      showNotification(`Menu item "${menuForm.itemName}" saved successfully!`);
    }, 1000);
  };

  const editMenuItem = (id) => {
    let itemData;

    if (id === 1) {
      itemData = {
        itemName: "Chicken Biryani",
        price: "350",
        category: "main",
        description:
          "Fragrant basmati rice cooked with tender chicken pieces and aromatic spices.",
        availability: true,
      };
    } else if (id === 2) {
      itemData = {
        itemName: "Beef Burger",
        price: "300",
        category: "main",
        description:
          "Juicy beef patty with fresh vegetables and our special sauce.",
        availability: true,
      };
    } else {
      itemData = {
        itemName: "Gulab Jamun",
        price: "150",
        category: "dessert",
        description:
          "Sweet milk solids balls soaked in rose flavored sugar syrup.",
        availability: false,
      };
    }

    setMenuForm(itemData);
    showNotification(`Editing "${itemData.itemName}"`);
  };

  const deleteMenuItem = (id) => {
    if (
      window.confirm(
        "Are you sure you want to remove this item from your menu?"
      )
    ) {
      setLoading({ type: "delete", id });

      setTimeout(() => {
        setLoading({ type: "", id: null });
        showNotification("Menu item removed successfully!");
      }, 800);
    }
  };

  return (
    <div id="updateMenu">
      <div className="header">
        <h1>Menu Management</h1>
        <p>Add, edit, or remove items from your menu.</p>
      </div>

      <form className="settings-card" onSubmit={saveMenuItem}>
        <h3>Add/Edit Menu Item</h3>
        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="itemName">Item Name:</label>
            <input
              type="text"
              id="itemName"
              name="itemName"
              value={menuForm.itemName}
              onChange={handleMenuFormChange}
              required
              placeholder="e.g. Chicken Biryani"
            />
          </div>
          <div className="form-group">
            <label htmlFor="price">Price (Rs):</label>
            <input
              type="number"
              id="price"
              name="price"
              value={menuForm.price}
              onChange={handleMenuFormChange}
              required
              placeholder="e.g. 350"
            />
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="category">Category:</label>
          <select
            id="category"
            name="category"
            value={menuForm.category}
            onChange={handleMenuFormChange}
            required
          >
            <option value="">Select a category</option>
            <option value="main">Main Course</option>
            <option value="appetizer">Appetizers</option>
            <option value="dessert">Desserts</option>
            <option value="drinks">Drinks</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="description">Description:</label>
          <textarea
            id="description"
            name="description"
            value={menuForm.description}
            onChange={handleMenuFormChange}
            rows="3"
            placeholder="Describe your item here..."
          ></textarea>
        </div>
        <div className="form-group">
          <label htmlFor="availability">Availability:</label>
          <div style={{ display: "flex", alignItems: "center" }}>
            <label className="toggle-switch">
              <input
                type="checkbox"
                id="availability"
                name="availability"
                checked={menuForm.availability}
                onChange={handleMenuFormChange}
              />
              <span className="toggle-slider"></span>
            </label>
            <span style={{ marginLeft: "10px", color: "var(--gray)" }}>
              Item is available
            </span>
          </div>
        </div>
        <button
          type="submit"
          className="btn"
          disabled={loading.type === "saveMenu"}
        >
          {loading.type === "saveMenu" ? (
            <>
              <div className="loading-spinner"></div> Saving...
            </>
          ) : (
            "Save Menu Item"
          )}
        </button>
      </form>

      <div className="menu-items">
        <table className="menu-table">
          <thead>
            <tr>
              <th>Item Name</th>
              <th>Price</th>
              <th>Category</th>
              <th>Availability</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {[
              {
                id: 1,
                name: "Chicken Biryani",
                price: "Rs. 350",
                category: "Main Course",
                available: true,
              },
              {
                id: 2,
                name: "Beef Burger",
                price: "Rs. 300",
                category: "Main Course",
                available: true,
              },
              {
                id: 3,
                name: "Gulab Jamun",
                price: "Rs. 150",
                category: "Desserts",
                available: false,
              },
            ].map((item) => (
              <tr key={item.id}>
                <td>{item.name}</td>
                <td>{item.price}</td>
                <td>{item.category}</td>
                <td>
                  <span
                    style={{
                      color: item.available
                        ? "var(--success)"
                        : "var(--danger)",
                    }}
                  >
                    {item.available ? "Available" : "Not Available"}
                  </span>
                </td>
                <td>
                  <button
                    className="btn btn-outline"
                    style={{ padding: "4px 8px", marginRight: "5px" }}
                    onClick={() => editMenuItem(item.id)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-danger"
                    style={{ padding: "4px 8px" }}
                    onClick={() => deleteMenuItem(item.id)}
                    disabled={
                      loading.type === "delete" && loading.id === item.id
                    }
                  >
                    {loading.type === "delete" && loading.id === item.id ? (
                      <div className="loading-spinner"></div>
                    ) : (
                      "Remove"
                    )}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Menu;
