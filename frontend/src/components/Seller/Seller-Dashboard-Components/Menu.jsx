import React, { useState, useEffect } from "react";
import "./Menu.css"; // Import the external CSS file

function Menu() {
  const [menuForm, setMenuForm] = useState({
    itemName: "",
    price: "",
    category: "",
    description: "",
    availability: true,
  });
  const [menuItems, setMenuItems] = useState([]);
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    isSuccess: true,
  });
  const [loading, setLoading] = useState({ type: "", id: null });
  const [editingId, setEditingId] = useState(null);

  // Get API base URL
  const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

  // Get token from localStorage (adjust based on how you store auth token)
  const getAuthToken = () => {
    return localStorage.getItem('token') || sessionStorage.getItem('token');
  };

  // API headers with auth token
  const getHeaders = () => {
    const token = getAuthToken();
    return {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    };
  };

  const showNotification = (message, isSuccess = true) => {
    setNotification({ show: true, message, isSuccess });
    setTimeout(() => {
      setNotification((prev) => ({ ...prev, show: false }));
    }, 3000);
  };

  // Fetch menu items from database
  const fetchMenuItems = async () => {
    try {
      const response = await fetch(`${API_BASE}/menu`, {
        headers: getHeaders()
      });
      
      if (response.ok) {
        const result = await response.json();
        setMenuItems(result.data);
      } else {
        const error = await response.json();
        showNotification(error.message || 'Failed to fetch menu items', false);
      }
    } catch (error) {
      console.error('Error fetching menu items:', error);
      showNotification('Failed to connect to server', false);
    }
  };

  // Load menu items on component mount
  useEffect(() => {
    fetchMenuItems();
  }, []);

  const handleMenuFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setMenuForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const saveMenuItem = async (e) => {
    // Validate required fields
    if (!menuForm.itemName || !menuForm.price || !menuForm.category) {
      showNotification('Please fill in all required fields', false);
      return;
    }

    setLoading({ type: "saveMenu", id: null });

    try {
      const url = editingId 
        ? `${API_BASE}/menu/${editingId}` 
        : `${API_BASE}/menu`;
      
      const method = editingId ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: getHeaders(),
        body: JSON.stringify(menuForm)
      });

      const result = await response.json();

      if (response.ok) {
        // Reset form
        setMenuForm({
          itemName: "",
          price: "",
          category: "",
          description: "",
          availability: true,
        });
        setEditingId(null);
        
        // Refresh menu items
        await fetchMenuItems();
        
        const action = editingId ? 'updated' : 'added';
        showNotification(`Menu item "${menuForm.itemName}" ${action} successfully!`);
      } else {
        showNotification(result.message || 'Failed to save menu item', false);
      }
    } catch (error) {
      console.error('Error saving menu item:', error);
      showNotification('Failed to connect to server', false);
    } finally {
      setLoading({ type: "", id: null });
    }
  };

  const editMenuItem = (item) => {
    setMenuForm({
      itemName: item.itemName,
      price: item.price.toString(),
      category: item.category,
      description: item.description || "",
      availability: item.availability,
    });
    setEditingId(item._id);
    showNotification(`Editing "${item.itemName}"`);
  };

  const cancelEdit = () => {
    setMenuForm({
      itemName: "",
      price: "",
      category: "",
      description: "",
      availability: true,
    });
    setEditingId(null);
    showNotification("Edit cancelled");
  };

  const deleteMenuItem = async (id, itemName) => {
    if (window.confirm(`Are you sure you want to remove "${itemName}" from your menu?`)) {
      setLoading({ type: "delete", id });

      try {
        const response = await fetch(`${API_BASE}/menu/${id}`, {
          method: 'DELETE',
          headers: getHeaders()
        });

        const result = await response.json();

        if (response.ok) {
          // Refresh menu items
          await fetchMenuItems();
          showNotification("Menu item removed successfully!");
        } else {
          showNotification(result.message || 'Failed to delete menu item', false);
        }
      } catch (error) {
        console.error('Error deleting menu item:', error);
        showNotification('Failed to connect to server', false);
      } finally {
        setLoading({ type: "", id: null });
      }
    }
  };

  const getCategoryDisplay = (category) => {
    const categoryMap = {
      'main': 'Main Course',
      'appetizer': 'Appetizers',
      'dessert': 'Desserts',
      'drinks': 'Drinks'
    };
    return categoryMap[category] || category;
  };

  return (
    <div className="menu-container">
      {/* Notification */}
      {notification.show && (
        <div className={`notification ${notification.isSuccess ? 'success' : 'error'}`}>
          {notification.message}
        </div>
      )}

      <div className="menu-content">
        <div className="menu-header">
          <h1 className="menu-title">Menu Management</h1>
          <p className="menu-subtitle">Add, edit, or remove items from your menu.</p>
        </div>

        <div className="menu-form-section">
          <h3 className="form-title">
            {editingId ? 'Edit Menu Item' : 'Add New Menu Item'}
          </h3>
          
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="itemName" className="form-label">
                Item Name:
              </label>
              <input
                type="text"
                id="itemName"
                name="itemName"
                value={menuForm.itemName}
                onChange={handleMenuFormChange}
                required
                placeholder="e.g. Chicken Biryani"
                className="form-input"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="price" className="form-label">
                Price (Rs):
              </label>
              <input
                type="number"
                id="price"
                name="price"
                value={menuForm.price}
                onChange={handleMenuFormChange}
                required
                placeholder="e.g. 350"
                min="0"
                step="0.01"
                className="form-input"
              />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: '1rem' }}>
            <label htmlFor="category" className="form-label">
              Category:
            </label>
            <select
              id="category"
              name="category"
              value={menuForm.category}
              onChange={handleMenuFormChange}
              required
              className="form-select"
            >
              <option value="">Select a category</option>
              <option value="main">Main Course</option>
              <option value="appetizer">Appetizers</option>
              <option value="dessert">Desserts</option>
              <option value="drinks">Drinks</option>
            </select>
          </div>

          <div className="form-group" style={{ marginBottom: '1rem' }}>
            <label htmlFor="description" className="form-label">
              Description:
            </label>
            <textarea
              id="description"
              name="description"
              value={menuForm.description}
              onChange={handleMenuFormChange}
              rows="3"
              placeholder="Describe your item here..."
              className="form-textarea"
            />
          </div>

          

          <div className="button-group">
            <button
              onClick={saveMenuItem}
              disabled={loading.type === "saveMenu"}
              className="btn btn-primary"
            >
              {loading.type === "saveMenu" ? (
                <span>
                  <div className="spinner"></div>
                  Saving...
                </span>
              ) : (
                editingId ? "Update Menu Item" : "Add Menu Item"
              )}
            </button>
            
            {editingId && (
              <button
                onClick={cancelEdit}
                className="btn btn-secondary"
              >
                Cancel
              </button>
            )}
          </div>
        </div>

        <div className="menu-items">
          <h3 className="menu-items-title">Current Menu Items</h3>
          
          {menuItems.length === 0 ? (
            <p className="empty-state">No menu items added yet. Add your first item above!</p>
          ) : (
            <div className="table-container">
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
                  {menuItems.map((item) => (
                    <tr key={item._id}>
                      <td>{item.itemName}</td>
                      <td>Rs. {item.price}</td>
                      <td>{getCategoryDisplay(item.category)}</td>
                      <td>
                        <span className={`status-badge ${
                          item.availability ? 'status-available' : 'status-unavailable'
                        }`}>
                          {item.availability ? "Available" : "Not Available"}
                        </span>
                      </td>
                      <td>
                        <div className="action-buttons">
                          <button
                            onClick={() => editMenuItem(item)}
                            className="btn btn-primary btn-sm"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => deleteMenuItem(item._id, item.itemName)}
                            disabled={loading.type === "delete" && loading.id === item._id}
                            className="btn btn-danger btn-sm"
                          >
                            {loading.type === "delete" && loading.id === item._id ? (
                              <div className="spinner spinner-sm"></div>
                            ) : (
                              "Remove"
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Menu;