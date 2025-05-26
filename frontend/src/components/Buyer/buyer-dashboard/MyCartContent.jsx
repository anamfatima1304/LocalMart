import React from 'react';
import { Heart, Search, Filter, Star, MapPin } from 'lucide-react';
import { useState } from 'react';
import '@fortawesome/fontawesome-free/css/all.min.css'; // Import Font Awesome
import TimePicker from 'react-time-picker';
import 'react-time-picker/dist/TimePicker.css';
import 'react-clock/dist/Clock.css';

// Add this data array near the top of your file with other data arrays
const cartItems = [
    {
        id: 1,
        name: 'Chicken Biryani',
        seller: 'Campus Bites',
        category: 'Food',
        price: 180,
        originalPrice: 200,
        quantity: 2,
        image: '/api/placeholder/80/80',
        inStock: true,
        rating: 4.5,
        reviews: 23
    },
    {
        id: 2,
        name: 'Handmade Notebook',
        seller: 'Artistic Creations',
        category: 'Crafts',
        price: 120,
        originalPrice: 150,
        quantity: 1,
        image: '/api/placeholder/80/80',
        inStock: true,
        rating: 4.2,
        reviews: 15
    },
    {
        id: 3,
        name: 'Wireless Earbuds',
        seller: 'Tech Hub',
        category: 'Electronics',
        price: 1200,
        originalPrice: 1500,
        quantity: 1,
        image: '/api/placeholder/80/80',
        inStock: false,
        rating: 4.7,
        reviews: 34
    },
    {
        id: 4,
        name: 'Study Lamp',
        seller: 'Hostel Supplies',
        category: 'Essentials',
        price: 450,
        originalPrice: 500,
        quantity: 1,
        image: '/api/placeholder/80/80',
        inStock: true,
        rating: 4.3,
        reviews: 18
    },
    {
        id: 5,
        name: 'Campus T-Shirt',
        seller: 'Campus Fashion',
        category: 'Clothing',
        price: 350,
        originalPrice: 400,
        quantity: 2,
        image: '/api/placeholder/80/80',
        inStock: true,
        rating: 4.1,
        reviews: 27
    },
    {
        id: 6,
        name: 'Data Structures Book',
        seller: 'Book Corner',
        category: 'Books',
        price: 800,
        originalPrice: 900,
        quantity: 1,
        image: '/api/placeholder/80/80',
        inStock: true,
        rating: 4.6,
        reviews: 12
    }
];

// Order Summary Component
function OrderSummary({ items }) {
    const subtotal = items.filter(item => item.inStock).reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const deliveryFee = subtotal > 500 ? 0 : 30;
    const tax = Math.round(subtotal * 0.05); // 5% tax
    const discount = 50; // Promotional discount
    const total = subtotal + deliveryFee + tax - discount;
    const totalItems = items.filter(item => item.inStock).reduce((sum, item) => sum + item.quantity, 0);

    return (
        <div className="buyer-order-summary">
            <h3 className="buyer-summary-title">Order Summary</h3>
            
            <div className="buyer-summary-row">
                <span>Items ({totalItems})</span>
                <span>₹{subtotal}</span>
            </div>
            
            <div className="buyer-summary-row">
                <span>Delivery Fee</span>
                <span className={deliveryFee === 0 ? 'free-delivery' : ''}>
                    {deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}
                </span>
            </div>
            
            <div className="buyer-summary-row">
                <span>Tax (5%)</span>
                <span>₹{tax}</span>
            </div>
            
            <div className="buyer-summary-row buyer-discount-row">
                <span>Promotional Discount</span>
                <span>-₹{discount}</span>
            </div>
            
            {subtotal < 500 && (
                <div className="buyer-free-delivery-notice">
                    <i className="fa-solid fa-info-circle"></i>
                    <span>Add ₹{500 - subtotal} more for free delivery!</span>
                </div>
            )}
            
            <div className="buyer-summary-divider"></div>
            
            <div className="buyer-summary-total">
                <span>Total Amount</span>
                <span>₹{total}</span>
            </div>
            
            <div className="buyer-summary-savings">
                You're saving ₹{items.reduce((save, item) => save + ((item.originalPrice - item.price) * item.quantity), 0) + discount} on this order!
            </div>
        </div>
    );
}

// Cart Item Component
function CartItem({ item, onQuantityChange, onRemove }) {
    const handleQuantityChange = (newQuantity) => {
        if (newQuantity >= 1) {
            onQuantityChange(item.id, newQuantity);
        }
    };

    const handleRemove = () => {
        onRemove(item.id);
    };

    return (
        <div className={`cart-item ${!item.inStock ? 'out-of-stock' : ''}`}>
            <div className="buyer-cart-item-image">
                <img src={item.image} alt={item.name} />
                {!item.inStock && <div className="buyer-out-of-stock-overlay">Out of Stock</div>}
            </div>
            
            <button className="buyer-cart-item-remove" onClick={handleRemove}>
                <i className="fa-solid fa-trash"></i>
            </button>
            
            <div className="buyer-cart-item-details">
                {/* Basic Info Section */}
                <div className="buyer-cart-item-basic-info">
                    <h3 className="buyer-cart-item-name">{item.name}</h3>
                    <p className="buyer-cart-item-seller">by {item.seller}</p>
                    <span className="buyer-cart-item-category">{item.category}</span>
                    <div className="buyer-cart-item-rating">
                        <Star className="buyer-star-icon" fill="#fbbf24" color="#fbbf24" size={14} />
                        <span className="buyer-rating-value">{item.rating}</span>
                        <span className="buyer-rating-reviews">({item.reviews})</span>
                    </div>
                </div>
                
                {/* Price Section */}
                <div className="buyer-cart-item-price-section">
                    <div className="buyer-cart-item-price">
                        <span className="buyer-current-price">₹{item.price}</span>
                        {item.originalPrice > item.price && (
                            <span className="buyer-original-price">₹{item.originalPrice}</span>
                        )}
                    </div>
                    {item.originalPrice > item.price && (
                        <span className="buyer-discount">
                            {Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100)}% OFF
                        </span>
                    )}
                </div>
                
                {/* Quantity Section */}
                <div className="buyer-cart-item-quantity-section">
                    <div className="buyer-quantity-controls">
                        <button 
                            className="buyer-quantity-btn"
                            onClick={() => handleQuantityChange(item.quantity - 1)}
                            disabled={!item.inStock}
                        >
                            <i className="fa-solid fa-minus"></i>
                        </button>
                        <span className="buyer-quantity-display">{item.quantity}</span>
                        <button 
                            className="buyer-quantity-btn"
                            onClick={() => handleQuantityChange(item.quantity + 1)}
                            disabled={!item.inStock}
                        >
                            <i className="fa-solid fa-plus"></i>
                        </button>
                    </div>
                    
                    {!item.inStock && (
                        <div className="buyer-stock-status">
                            <i className="fa-solid fa-exclamation-triangle"></i>
                            <span>Out of stock</span>
                        </div>
                    )}
                </div>
                
                {/* Total Section */}
                <div className="buyer-cart-item-total-section">
                    <div className="buyer-item-total">
                        <span className="buyer-total-label">Total</span>
                        <span className="buyer-total-price">₹{item.price * item.quantity}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

// My Cart Content Component
function MyCartContent() {
    const [cartItemsState, setCartItemsState] = useState(cartItems);
    
    const handleQuantityChange = (itemId, newQuantity) => {
        setCartItemsState(prevItems =>
            prevItems.map(item =>
                item.id === itemId ? { ...item, quantity: newQuantity } : item
            )
        );
    };
    
    const handleRemoveItem = (itemId) => {
        setCartItemsState(prevItems => prevItems.filter(item => item.id !== itemId));
    };
    
    const handleClearCart = () => {
        setCartItemsState([]);
    };
    
    const availableItems = cartItemsState.filter(item => item.inStock);
    const outOfStockItems = cartItemsState.filter(item => !item.inStock);
    
    if (cartItemsState.length === 0) {
        return (
            <div className="buyer-cart-content">
                <div className="buyer-cart-header">
                    <h1 className="buyer-cart-title">My Cart</h1>
                </div>
                <div className="buyer-empty-cart">
                    <i className="fa-solid fa-shopping-cart buyer.empty-cart-icon"></i>
                    <h3>Your cart is empty</h3>
                    <p>Add some items to get started!</p>
                    <button className="buyer-continue-shopping-btn">Continue Shopping</button>
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
                                        key={item.id}
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
                                        key={item.id}
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
                            <OrderSummary items={cartItemsState} />
                            
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