import React, { useState } from 'react';
import { Star } from 'lucide-react';
import '@fortawesome/fontawesome-free/css/all.min.css';
import TimePicker from 'react-time-picker';
import 'react-time-picker/dist/TimePicker.css';
import 'react-clock/dist/Clock.css';

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
// const getUserCartItems = () => {
//     const userId = getCurrentUserId();
//     if (!userId) return [];
//     const storedCart = localStorage.getItem(`cart_${userId}`);
//     return storedCart ? JSON.parse(storedCart) : [];
// };

const getUserCartItems = () => {
    const userId = getCurrentUserId();
    const storedCart = localStorage.getItem(`cart_${userId}`);
    try {
      const parsed = storedCart ? JSON.parse(storedCart) : [];
      console.log('📦 Loaded Cart Items:', parsed); // 👈 Add this
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
function CartItem({ item, onQuantityChange, onRemove }) {
    const handleQuantityChange = (newQuantity) => {
        if (newQuantity >= 1) {
            onQuantityChange(item._id, newQuantity);
        }
    };

    const handleRemove = () => {
        onRemove(item._id);
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
        <div className={`cart-item ${item.availability === false ? 'out-of-stock' : ''}`}>
            {/* <div className="buyer-cart-item-image">
                <img src={item.image || getRandomImage()} alt={item.itemName} />
                {item.availability === false && (
                    <div className="buyer-out-of-stock-overlay">Out of Stock</div>
                )}
            </div> */}

            <button className="buyer-cart-item-remove" onClick={handleRemove}>
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

                <div className="buyer-cart-item-price-section">
                    <div className="buyer-cart-item-price">
                        <span className="buyer-current-price">Rs {item.price}</span>
                    </div>
                </div>

                <div className="buyer-cart-item-quantity-section">
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

                <div className="buyer-cart-item-total-section">
                    <div className="buyer-item-total">
                        <span className="buyer-total-label">Total</span>
                        <span className="buyer-total-price">Rs {item.price * item.quantity}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}


function MyCartContent() {
    const [cartItemsState, setCartItemsState] = useState(getUserCartItems());

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
                    <button className="buyer-continue-shopping-btn" onClick={() => window.history.back()}>Continue Shopping</button>
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
                    <button className="buyer-continue-shopping-btn-outline" onClick={() => window.history.back()}>
                        <i className="fa-solid fa-arrow-left"></i>
                        Continue Shopping
                    </button>
                    {cartItemsState.length > 0 && (
                        <button className="buyer-clear-cart-btn" onClick={handleClearCart}>
                            <i className="fa-solid fa-trash"></i>
                            Clear Cart
                        </button>
                    )}
                </div>
            </div>

            <div className="buyer-cart-layout">
                <div className="buyer-cart-items-section">
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
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {availableItems.length > 0 && (
                    <div className="buyer-cart-summary-section">
                        <div className="buyer-summary-container">
                            <OrderSummary items={availableItems} />
                            <div className="buyer-checkout-section">
                                <button className="buyer-checkout-btn">
                                    <i className="fa-solid fa-lock"></i>
                                    Proceed to Checkout
                                </button>
                                <div className="buyer-security-info">
                                    <i className="fa-solid fa-shield-alt"></i>
                                    <span>Your payment information is secure and encrypted</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default MyCartContent;
