import React, { useState, useEffect } from 'react';
import { Heart, Search, Filter, Star, MapPin, ShoppingCart, Plus, Minus, X } from 'lucide-react';
import '@fortawesome/fontawesome-free/css/all.min.css';
import '../buyer.css';

const categories1 = [
    { name: 'Food', img: 'https://via.placeholder.com/64' },
    { name: 'Clothing', img: 'https://via.placeholder.com/64' },
    { name: 'Electronics', img: 'https://via.placeholder.com/64' },
    { name: 'Books', img: 'https://via.placeholder.com/64' },
    { name: 'Crafts', img: 'https://via.placeholder.com/64' },
    { name: 'Essentials', img: 'https://via.placeholder.com/64' },
];

// Random shop images
const shopImages = [
    'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1559329007-40df8a9345d8?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1537047902294-62a40c20a6ae?w=400&h=300&fit=crop'
];

function OrderReceipt({ cart, shopName, onClose, onConfirmOrder }) {
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    return (
        <div className="receipt-overlay">
            <div className="receipt-modal">
                <div className="receipt-header">
                    <h3>Order Summary - {shopName}</h3>
                    <button onClick={onClose} className="receipt-close-btn">
                        <X size={20} />
                    </button>
                </div>
                
                <div className="receipt-items">
                    {cart.map((item) => (
                        <div key={item._id} className="receipt-item">
                            <div className="receipt-item-info">
                                <span className="receipt-item-name">{item.itemName}</span>
                                <span className="receipt-item-quantity">× {item.quantity}</span>
                            </div>
                            <span className="receipt-item-price">₹{(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                    ))}
                </div>
                
                <div className="receipt-total">
                    <strong>Total: ₹{total.toFixed(2)}</strong>
                </div>
                
                <div className="receipt-actions">
                    <button onClick={onClose} className="receipt-cancel-btn">Cancel</button>
                    <button onClick={onConfirmOrder} className="receipt-confirm-btn">
                        <ShoppingCart size={16} />
                        Confirm Order
                    </button>
                </div>
            </div>
        </div>
    );
}

function MenuItem({ item, onUpdateCart, cartQuantity }) {
    const handleIncrement = () => {
        onUpdateCart(item, cartQuantity + 1);
    };

    const handleDecrement = () => {
        if (cartQuantity > 0) {
            onUpdateCart(item, cartQuantity - 1);
        }
    };

    return (
        <div className="menu-item">
            <div className="menu-item-info">
                <h4 className="menu-item-name">{item.itemName}</h4>
                <p className="menu-item-description">{item.description || 'No description available'}</p>
                <div className="menu-item-details">
                    <span className="menu-item-price">₹{item.price}</span>
                    <span className="menu-item-category">{item.category}</span>
                    {!item.availability && <span className="menu-item-unavailable">Unavailable</span>}
                </div>
            </div>
            
            {item.availability && (
                <div className="quantity-controls">
                    <button 
                        onClick={handleDecrement}
                        className="quantity-btn"
                        disabled={cartQuantity === 0}
                    >
                        <Minus size={16} />
                    </button>
                    <span className="quantity-display">{cartQuantity}</span>
                    <button 
                        onClick={handleIncrement}
                        className="quantity-btn"
                    >
                        <Plus size={16} />
                    </button>
                </div>
            )}
        </div>
    );
}

function ShopCard({ shop }) {
    const [isFavorite, setIsFavorite] = useState(false);
    const [showMenu, setShowMenu] = useState(false);
    const [cart, setCart] = useState([]);
    const [showReceipt, setShowReceipt] = useState(false);
    
    // Get random image for shop
    const shopImage = shopImages[Math.floor(Math.random() * shopImages.length)];
    
    const handleFavoriteClick = (e) => {
        e.stopPropagation();
        setIsFavorite(!isFavorite);
    };

    const handleUpdateCart = (item, quantity) => {
        if (quantity === 0) {
            setCart(cart.filter(cartItem => cartItem._id !== item._id));
        } else {
            const existingItem = cart.find(cartItem => cartItem._id === item._id);
            if (existingItem) {
                setCart(cart.map(cartItem => 
                    cartItem._id === item._id 
                        ? { ...cartItem, quantity }
                        : cartItem
                ));
            } else {
                setCart([...cart, { ...item, quantity }]);
            }
        }
    };

    const getCartQuantity = (itemId) => {
        const cartItem = cart.find(item => item._id === itemId);
        return cartItem ? cartItem.quantity : 0;
    };

    const toggleMenu = () => {
        setShowMenu(!showMenu);
        if (!showMenu) {
            setCart([]); // Reset cart when opening menu
        }
    };

    const handleOrderClick = () => {
        if (cart.length > 0) {
            setShowReceipt(true);
        }
    };

    const handleConfirmOrder = () => {
        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        alert(`Order confirmed for ${shop.name}!\nTotal: ₹${total.toFixed(2)}\nItems: ${cart.length}`);
        setCart([]);
        setShowReceipt(false);
        setShowMenu(false);
    };

    const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    return (
        <>
            <div className="buyer-shop-card">
                <div className="buyer-shop-image-container">
                    <img src={shopImage} alt={shop.name} className="buyer-shop-image" />
                    <div className="buyer-shop-tags">
                        <span className="buyer-shop-tag">
                            {shop.totalItems} items
                        </span>
                        {Object.keys(shop.mainCategory).length > 0 && (
                            <span className="buyer-shop-tag">
                                {Object.keys(shop.mainCategory)[0]}
                            </span>
                        )}
                    </div>
                    <div 
                        onClick={handleFavoriteClick}
                        className="buyer-shop-favorite"
                    >
                        <Heart 
                            className="buyer-favorite-icon" 
                            fill={isFavorite ? "#f44336" : "none"} 
                            color={isFavorite ? "#f44336" : "white"}
                            size={20}
                        />
                    </div>
                </div>
                
                <div className="buyer-shop-content">
                    <div className="buyer-shop-header">
                        <h3 className="buyer-shop-name">{shop.name}</h3>
                        <span className="buyer-shop-category">
                            {Object.keys(shop.mainCategory).join(', ')}
                        </span>
                    </div>
                    
                    <div className="buyer-shop-rating">
                        <Star className="buyer-star-icon" fill="#fbbf24" color="#fbbf24" size={16} />
                        <span className="buyer-rating-value">{shop.rating}</span>
                        <span className="buyer-rating-reviews">({shop.reviews} reviews)</span>
                    </div>
                    
                    <div className="buyer-shop-meta">
                        <div className="buyer-shop-location">
                            <MapPin size={14} className="buyer-location-icon" />
                            <span>{shop.businessAddress}</span>
                        </div>
                        <div className="shop-delivery">
                            <i className="fa-solid fa-clock buyer-delivery-icon"></i>
                            <span>{shop.deliveryTime}</span>
                        </div>
                    </div>
                    
                    <div className="buyer-shop-actions">
                        <button 
                            className="buyer-shop-visit-button"
                            onClick={toggleMenu}
                        >
                            {showMenu ? 'Hide Menu' : 'View Menu'}
                        </button>
                    </div>

                    {showMenu && (
                        <div className="shop-menu">
                            <div className="menu-header">
                                <h4 className="menu-title">Menu Items</h4>
                                {cartItemCount > 0 && (
                                    <div className="cart-summary">
                                        <span className="cart-count">{cartItemCount} items in cart</span>
                                    </div>
                                )}
                            </div>
                            
                            {shop.menuItems && shop.menuItems.length > 0 ? (
                                <>
                                    <div className="menu-items-list">
                                        {shop.menuItems.map((item) => (
                                            <MenuItem 
                                                key={item._id} 
                                                item={item} 
                                                onUpdateCart={handleUpdateCart}
                                                cartQuantity={getCartQuantity(item._id)}
                                            />
                                        ))}
                                    </div>
                                    
                                    {cart.length > 0 && (
                                        <div className="menu-footer">
                                            <button 
                                                onClick={handleOrderClick}
                                                className="order-summary-btn"
                                            >
                                                <ShoppingCart size={16} />
                                                View Order ({cartItemCount} items)
                                            </button>
                                        </div>
                                    )}
                                </>
                            ) : (
                                <p className="no-menu-items">No menu items available</p>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {showReceipt && (
                <OrderReceipt 
                    cart={cart}
                    shopName={shop.name}
                    onClose={() => setShowReceipt(false)}
                    onConfirmOrder={handleConfirmOrder}
                />
            )}
        </>
    );
}

function FilterSearch({ searchTerm, setSearchTerm, selectedCategory, setSelectedCategory, categories }) {
    return (
        <div className="buyer-filter-search-container">
            <div className="buyer-search-container">
                <div className="buyer-search-input-wrapper">
                    <Search className="buyer-search-icon" size={20} />
                    <input
                        type="text"
                        placeholder="Search shops..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="buyer-search-input"
                    />
                </div>
                <button className="buyer-filter-button">
                    <Filter size={18} />
                    <span>Filter</span>
                </button>
            </div>
            
            <div className="buyer-category-filters">
                {categories.map((category, index) => (
                    <button
                        key={index}
                        className={`category-filter ${selectedCategory === category.name ? 'active' : ''}`}
                        onClick={() => setSelectedCategory(category.name)}
                    >
                        {category.name} ({category.count})
                    </button>
                ))}
            </div>
        </div>
    );
}

function ExploreShopsContent() {
    const [shops, setShops] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [categories, setCategories] = useState([{ name: 'All', count: 0 }]);

    useEffect(() => {
        fetchShops();
    }, []);

    const fetchShops = async () => {
        try {
            setLoading(true);
            const response = await fetch('http://localhost:5000/api/shops');
            
            if (!response.ok) {
                throw new Error('Failed to fetch shops');
            }
            
            const result = await response.json();
            
            if (result.success) {
                setShops(result.data);
                generateCategories(result.data);
            } else {
                throw new Error('API returned error');
            }
        } catch (err) {
            setError(err.message);
            console.error('Error fetching shops:', err);
        } finally {
            setLoading(false);
        }
    };

    const generateCategories = (shopsData) => {
        const categoryCount = {};
        let totalCount = 0;

        shopsData.forEach(shop => {
            totalCount++;
            if (shop.mainCategory && typeof shop.mainCategory === 'object') {
                Object.keys(shop.mainCategory).forEach(category => {
                    const categoryName = category.charAt(0).toUpperCase() + category.slice(1);
                    categoryCount[categoryName] = (categoryCount[categoryName] || 0) + 1;
                });
            }
        });

        const categoryList = [
            { name: 'All', count: totalCount },
            ...Object.entries(categoryCount).map(([name, count]) => ({ name, count }))
        ];

        setCategories(categoryList);
    };

    // Filter shops based on search and category
    const filteredShops = shops.filter(shop => {
        const matchesSearch = shop.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            shop.businessAddress.toLowerCase().includes(searchTerm.toLowerCase());
        
        if (selectedCategory === 'All') {
            return matchesSearch;
        }
        
        const matchesCategory = shop.mainCategory && 
                              Object.keys(shop.mainCategory).some(cat => 
                                  cat.toLowerCase() === selectedCategory.toLowerCase()
                              );
        
        return matchesSearch && matchesCategory;
    });

    if (loading) {
        return (
            <div className="buyer-explore-content">
                <div className="loading-container">
                    <div className="loading-spinner"></div>
                    <p>Loading shops...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="buyer-explore-content">
                <div className="error-container">
                    <h3>Error loading shops</h3>
                    <p>{error}</p>
                    <button onClick={fetchShops} className="retry-button">
                        Try Again
                    </button>
                </div>
            </div>
        );
    }
    
    return (
        <div className="buyer-explore-content">
            <div className="buyer-explore-header">
                <div>
                    <h1 className="buyer-explore-title">Explore Shops</h1>
                    <p className="buyer-explore-subtitle">Discover amazing local shops in your campus</p>
                </div>
                <div className="buyer-explore-stats">
                    <span className="buyer-shops-count">{filteredShops.length} shops found</span>
                </div>
            </div>
            
            <FilterSearch 
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                categories={categories}
            />
            
            <div className="buyer-shops-grid">
                {filteredShops.map((shop) => (
                    <ShopCard key={shop.id} shop={shop} />
                ))}
            </div>
            
            {filteredShops.length === 0 && !loading && (
                <div className="buyer-no-results">
                    <i className="fa-solid fa-search buyer-no-results-icon"></i>
                    <h3>No shops found</h3>
                    <p>Try adjusting your search terms or category filter</p>
                </div>
            )}
        </div>
    );
}

export default ExploreShopsContent;