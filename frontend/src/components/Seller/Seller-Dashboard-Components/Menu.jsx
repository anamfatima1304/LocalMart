import React, { useState, useEffect } from "react";

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
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Notification */}
      {notification.show && (
        <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg ${
          notification.isSuccess ? 'bg-green-500' : 'bg-red-500'
        } text-white`}>
          {notification.message}
        </div>
      )}

      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Menu Management</h1>
          <p className="text-gray-600">Add, edit, or remove items from your menu.</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h3 className="text-xl font-semibold mb-4">
            {editingId ? 'Edit Menu Item' : 'Add New Menu Item'}
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="itemName" className="block text-sm font-medium text-gray-700 mb-1">
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="mb-4">
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
              Category:
            </label>
            <select
              id="category"
              name="category"
              value={menuForm.category}
              onChange={handleMenuFormChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select a category</option>
              <option value="main">Main Course</option>
              <option value="appetizer">Appetizers</option>
              <option value="dessert">Desserts</option>
              <option value="drinks">Drinks</option>
            </select>
          </div>

          <div className="mb-4">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description:
            </label>
            <textarea
              id="description"
              name="description"
              value={menuForm.description}
              onChange={handleMenuFormChange}
              rows="3"
              placeholder="Describe your item here..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="mb-6">
            <label className="flex items-center">
              <input
                type="checkbox"
                name="availability"
                checked={menuForm.availability}
                onChange={handleMenuFormChange}
                className="mr-2"
              />
              <span className="text-sm font-medium text-gray-700">Item is available</span>
            </label>
          </div>

          <div className="flex gap-3">
            <button
              onClick={saveMenuItem}
              disabled={loading.type === "saveMenu"}
              className="bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white px-6 py-2 rounded-md font-medium transition-colors duration-200"
            >
              {loading.type === "saveMenu" ? (
                <span className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Saving...
                </span>
              ) : (
                editingId ? "Update Menu Item" : "Add Menu Item"
              )}
            </button>
            
            {editingId && (
              <button
                onClick={cancelEdit}
                className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-md font-medium transition-colors duration-200"
              >
                Cancel
              </button>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold mb-4">Current Menu Items</h3>
          
          {menuItems.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No menu items added yet. Add your first item above!</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Item Name</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Price</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Category</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Availability</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {menuItems.map((item) => (
                    <tr key={item._id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">{item.itemName}</td>
                      <td className="py-3 px-4">Rs. {item.price}</td>
                      <td className="py-3 px-4">{getCategoryDisplay(item.category)}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          item.availability 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {item.availability ? "Available" : "Not Available"}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => editMenuItem(item)}
                            className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm font-medium transition-colors duration-200"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => deleteMenuItem(item._id, item.itemName)}
                            disabled={loading.type === "delete" && loading.id === item._id}
                            className="bg-red-500 hover:bg-red-600 disabled:bg-red-300 text-white px-3 py-1 rounded text-sm font-medium transition-colors duration-200"
                          >
                            {loading.type === "delete" && loading.id === item._id ? (
                              <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
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