import React, { useState, useEffect } from 'react';
import { Star } from 'lucide-react';
import '@fortawesome/fontawesome-free/css/all.min.css';

// Helper: Get current user ID
const getCurrentUserId = () => {
    const user = localStorage.getItem('user');
    if (user) {
        const userData = JSON.parse(user);
        return userData.id || userData._id || userData.userId;
    }
    return localStorage.getItem('userId');
};

// Helper: Get cart for current user
const getUserCartItems = () => {
    const userId = getCurrentUserId();
    const storedCart = localStorage.getItem(`cart_${userId}`);
    try {
      const parsed = storedCart ? JSON.parse(storedCart) : [];
      console.log('📦 Loaded Cart Items:', parsed);
      return parsed;
    } catch (e) {
      console.error('❌ Failed to parse cart:', e);
      return [];
    }
  };

// Order Summary Component
function OrderSummary({ items }) {
    const subtotal = items.filter(item => item.availability !== false).reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const deliveryFee = 50;
    const total = subtotal + deliveryFee;
    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

    return (
        <div className="buyer-order-summary">
            <h3 className="buyer-summary-title">Order Summary</h3>
            <div className="buyer-summary-row">
                <span>Items ({totalItems})</span>
                <span>Rs {subtotal}</span>
            </div>
            <div className="buyer-summary-row">
                <span>Delivery Fee</span>
                <span>Rs {deliveryFee}</span>
            </div>
            <div className="buyer-summary-divider"></div>
            <div className="buyer-summary-total">
                <span>Total Amount</span>
                <span>Rs {total}</span>
            </div>
        </div>
    );
}

// Cart Item Component
function CartItem({ item, onQuantityChange, onRemove, onPlaceOrder }) {
    const handleQuantityChange = (newQuantity) => {
        if (newQuantity >= 1) {
            onQuantityChange(item._id, newQuantity);
        }
    };

    const handleRemove = () => {
        onRemove(item._id);
    };

    const handlePlaceOrder = () => {
        onPlaceOrder(item);
    };

    const getRandomImage = () => {
        const images = [
            'https://source.unsplash.com/80x80/?food',
            'https://source.unsplash.com/80x80/?meal',
            'https://source.unsplash.com/80x80/?snack',
            'https://source.unsplash.com/80x80/?lunch',
            'https://source.unsplash.com/80x80/?grocery',
            'https://source.unsplash.com/80x80/?cuisine'
        ];
        return images[Math.floor(Math.random() * images.length)];
    };

    return (
        <div className={`cart-item ${item.availability === false ? 'out-of-stock' : ''}`} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ flex: 1, marginRight: '1rem' }}>
                <button className="buyer-cart-item-remove" onClick={handleRemove} style={{ float: 'right', marginBottom: '0.5rem' }}>
                    <i className="fa-solid fa-trash"></i>
                </button>

                <div className="buyer-cart-item-details">
                    <div className="buyer-cart-item-basic-info">
                        <h3 className="buyer-cart-item-name">{item.itemName}</h3>
                        <p className="buyer-cart-item-seller">From: {item.shopName || 'Shop'}</p>
                        <span className="buyer-cart-item-category">{item.category}</span>
                        <div className="buyer-cart-item-rating">
                            <Star className="buyer-star-icon" fill="#fbbf24" color="#fbbf24" size={14} />
                            <span className="buyer-rating-value">{item.rating || 4.0}</span>
                            <span className="buyer-rating-reviews">({item.reviews || 10})</span>
                        </div>
                    </div>

                    <div className="buyer-cart-item-price-section" style={{ marginTop: '0.5rem' }}>
                        <div className="buyer-cart-item-price">
                            <span className="buyer-current-price">Rs {item.price}</span>
                        </div>
                    </div>

                    <div className="buyer-cart-item-quantity-section" style={{ marginTop: '0.5rem' }}>
                        <div className="buyer-quantity-controls">
                            <button 
                                className="buyer-quantity-btn"
                                onClick={() => handleQuantityChange(item.quantity - 1)}
                                disabled={item.availability === false}
                            >
                                <i className="fa-solid fa-minus"></i>
                            </button>
                            <span className="buyer-quantity-display">{item.quantity}</span>
                            <button 
                                className="buyer-quantity-btn"
                                onClick={() => handleQuantityChange(item.quantity + 1)}
                                disabled={item.availability === false}
                            >
                                <i className="fa-solid fa-plus"></i>
                            </button>
                        </div>
                        {item.availability === false && (
                            <div className="buyer-stock-status">
                                <i className="fa-solid fa-exclamation-triangle"></i>
                                <span>Out of stock</span>
                            </div>
                        )}
                    </div>

                    <div className="buyer-cart-item-total-section" style={{ marginTop: '0.5rem' }}>
                        <div className="buyer-item-total">
                            <span className="buyer-total-label">Total</span>
                            <span className="buyer-total-price">Rs {item.price * item.quantity}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div>
                <button 
                    className="buyer-place-order-btn"
                    onClick={handlePlaceOrder}
                    disabled={item.availability === false}
                    style={{
                        padding: '8px 16px',
                        backgroundColor: '#3b82f6',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: item.availability === false ? 'not-allowed' : 'pointer',
                        whiteSpace: 'nowrap'
                    }}
                >
                    Place Order
                </button>
            </div>
        </div>
    );
}

function MyCartContent() {
    const [cartItemsState, setCartItemsState] = useState(getUserCartItems());
    const [shops, setShops] = useState([]);
    const [loadingShops, setLoadingShops] = useState(false);
    const [error, setError] = useState(null);

    // Fetch shops on mount
    useEffect(() => {
        const fetchShops = async () => {
            setLoadingShops(true);
            try {
                const response = await fetch('http://localhost:5000/api/shops');
                if (!response.ok) throw new Error('Failed to fetch shops');
                const result = await response.json();
                if (result.success) {
                    setShops(result.data);
                } else {
                    throw new Error('API returned error');
                }
            } catch (err) {
                setError(err.message);
                console.error('Error fetching shops:', err);
            } finally {
                setLoadingShops(false);
            }
        };
        fetchShops();
    }, []);

    const updateUserCartStorage = (updatedItems) => {
        const userId = getCurrentUserId();
        if (userId) {
            localStorage.setItem(`cart_${userId}`, JSON.stringify(updatedItems));
        }
    };

    const handleQuantityChange = (itemId, newQuantity) => {
        const updatedItems = cartItemsState.map(item =>
            item._id === itemId ? { ...item, quantity: newQuantity } : item
        );
        setCartItemsState(updatedItems);
        updateUserCartStorage(updatedItems);
    };

    const handleRemoveItem = (itemId) => {
        const updatedItems = cartItemsState.filter(item => item._id !== itemId);
        setCartItemsState(updatedItems);
        updateUserCartStorage(updatedItems);
    };

    const handleClearCart = () => {
        const userId = getCurrentUserId();
        setCartItemsState([]);
        if (userId) {
            localStorage.removeItem(`cart_${userId}`);
        }
    };

    // Place order for single item, dynamically set sellerId based on shopId in item
    const handlePlaceOrder = async (item) => {
        const token = localStorage.getItem('token'); // JWT token
        if (!token) {
          alert("Please log in first.");
          return;
        }

        // Find the shop from shops list matching item's shopId or shop._id
        // Assuming item.shopId exists and matches shop._id
        const shop = shops.find(s => s._id === item.shopId);

        if (!shop) {
          alert('Shop information not found for this item.');
          return;
        }

        const orderData = {
            sellerId: item.sellerId,
            items: [{
                menuItemId: item._id,
                quantity: item.quantity
            }],
            deliveryAddress: "Chagda Hostel",  // Replace with real input if needed
            phoneNumber: "N/A",
            orderNotes: ""
        };

        try {
          const res = await fetch("http://localhost:5000/api/orders", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(orderData)
          });

          const data = await res.json();
          if (data.success) {
            alert("Order placed successfully!");
            console.log("Order:", data.data);
          } else {
            alert("Failed: " + data.message);
            console.log(data);
          }
        } catch (err) {
          console.error("Order error:", err);
          alert("Something went wrong.");
        }
    };

    const availableItems = cartItemsState.filter(item => item.availability !== false);
    const outOfStockItems = cartItemsState.filter(item => item.availability === false);

    if (cartItemsState.length === 0) {
        return (
            <div className="buyer-cart-content">
                <div className="buyer-cart-header">
                    <h1 className="buyer-cart-title">My Cart</h1>
                </div>
                <div className="buyer-empty-cart">
                    <i className="fa-solid fa-shopping-cart buyer-empty-cart-icon"></i>
                    <h3>Your cart is empty</h3>
                    <p>Add some items to get started!</p>
                    {/* <button className="buyer-continue-shopping-btn" onClick={() => window.history.back()}>Continue Shopping</button> */}
                </div>
            </div>
        );
    }

    return (
        <div className="buyer-cart-content">
            <div className="buyer-cart-header">
                <div>
                    <h1 className="buyer-cart-title">My Cart</h1>
                    <p className="buyer-cart-subtitle">{cartItemsState.length} items in your cart</p>
                </div>
                <div className="buyer-cart-actions">
                    {/* <button className="buyer-continue-shopping-btn-outline" onClick={() => window.history.back()}>
                        <i className="fa-solid fa-arrow-left"></i>
                        Continue Shopping
                    </button> */}
                    {cartItemsState.length > 0 && (
                        <button className="buyer-clear-cart-btn" onClick={handleClearCart}>
                            <i className="fa-solid fa-trash"></i>
                            Clear Cart
                        </button>
                    )}
                </div>
            </div>

            <div className="buyer-cart-layout" style={{ display: 'flex', gap: '2rem' }}>
                <div className="buyer-cart-items-section" style={{ flex: 2 }}>
                    {availableItems.length > 0 && (
                        <div className="buyer-available-items">
                            <h3 className="buyer-section-title">Available Items ({availableItems.length})</h3>
                            <div className="buyer-cart-items-list">
                                {availableItems.map(item => (
                                    <CartItem
                                        key={item._id}
                                        item={item}
                                        onQuantityChange={handleQuantityChange}
                                        onRemove={handleRemoveItem}
                                        onPlaceOrder={handlePlaceOrder}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                    {outOfStockItems.length > 0 && (
                        <div className="buyer-out-of-stock-section">
                            <h3 className="buyer-section-title">Out of Stock Items ({outOfStockItems.length})</h3>
                            <div className="buyer-cart-items-list">
                                {outOfStockItems.map(item => (
                                    <CartItem
                                        key={item._id}
                                        item={item}
                                        onQuantityChange={handleQuantityChange}
                                        onRemove={handleRemoveItem}
                                        onPlaceOrder={handlePlaceOrder}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {availableItems.length > 0 && (
                    <div className="buyer-cart-summary-section" style={{ flex: 1 }}>
                        <div className="buyer-summary-container">
                            <OrderSummary items={availableItems} />
                            <div className="buyer-checkout-section">
                                {/* You can add global checkout button here if needed */}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {loadingShops && <p>Loading shops...</p>}
            {error && <p style={{ color: 'red' }}>Error: {error}</p>}
        </div>
    );
}

export default MyCartContent;
