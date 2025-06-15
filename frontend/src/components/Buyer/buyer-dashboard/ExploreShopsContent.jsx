import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
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
    'https://images.unsplash.com/photo-1559329007-40df8a9345d8?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1537047902294-62a40c20a6ae?w=400&h=300&fit=crop'
];

const getAuthToken = () => {
    return localStorage.getItem('token') || sessionStorage.getItem('token');
};

const getUserData = () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
};

// USER-SPECIFIC FAVORITES MANAGEMENT FUNCTIONS
const getCurrentUserId = () => {
    // Option 1: If you store user info in localStorage
    const user = localStorage.getItem('user');
    if (user) {
        const userData = JSON.parse(user);
        return userData.id || userData._id || userData.userId;
    }
    
    // Option 2: If you store just the user ID
    return localStorage.getItem('userId');
    
    // Option 3: If you use a different auth system, adjust accordingly
    // return sessionStorage.getItem('userId');
    // return getCurrentUser()?.id; // if using a context or auth hook
};

const getFavorites = () => {
    const userId = getCurrentUserId();
    if (!userId) return [];
    
    const favoritesKey = `favoriteShops_${userId}`;
    const favorites = localStorage.getItem(favoritesKey);
    return favorites ? JSON.parse(favorites) : [];
};

const saveFavorites = (favorites) => {
    const userId = getCurrentUserId();
    if (!userId) return;
    
    const favoritesKey = `favoriteShops_${userId}`;
    localStorage.setItem(favoritesKey, JSON.stringify(favorites));
};

const addToFavorites = (shop) => {
    const userId = getCurrentUserId();
    if (!userId) {
        console.warn('No user logged in');
        return false;
    }
    
    const favorites = getFavorites();
    const isAlreadyFavorite = favorites.some(fav => fav.id === shop.id);
    
    if (!isAlreadyFavorite) {
        const favoriteShop = {
            id: shop.id,
            name: shop.name,
            description: shop.businessAddress,
            image: shopImages[Math.floor(Math.random() * shopImages.length)],
            rating: shop.rating,
            category: Object.keys(shop.mainCategory)[0] || 'General',
            totalItems: shop.totalItems,
            deliveryTime: shop.deliveryTime
        };
        const updatedFavorites = [...favorites, favoriteShop];
        saveFavorites(updatedFavorites);
        return true;
    }
    return false;
};

const removeFromFavorites = (shopId) => {
    const favorites = getFavorites();
    const updatedFavorites = favorites.filter(fav => fav.id !== shopId);
    saveFavorites(updatedFavorites);
};

const isShopFavorite = (shopId) => {
    const favorites = getFavorites();
    return favorites.some(fav => fav.id === shopId);
};

function OrderReceipt({ cart, shopName, onClose, onConfirmOrder }) {
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const [isPlacingOrder, setIsPlacingOrder] = useState(false);

    const handleConfirmOrder = async () => {
        setIsPlacingOrder(true);
        await onConfirmOrder();
        setIsPlacingOrder(false);
    };

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
                            <span className="receipt-item-price">Rs {(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                    ))}
                </div>
                
                <div className="receipt-total">
                    <strong>Total: Rs {total.toFixed(2)}</strong>
                </div>
                
                <div className="receipt-actions">
                    <button onClick={onClose} className="receipt-cancel-btn" disabled={isPlacingOrder}>
                        Cancel
                    </button>
                    <button 
                        onClick={handleConfirmOrder} 
                        className="receipt-confirm-btn"
                        disabled={isPlacingOrder}
                    >
                        {isPlacingOrder ? (
                            <>
                                <div className="spinner"></div>
                                Placing Order...
                            </>
                        ) : (
                            <>
                                <ShoppingCart size={16} />
                                Confirm Order
                            </>
                        )}
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
                    <span className="menu-item-price">Rs {item.price}</span>
                    <span className="menu-item-category">{item.category}</span>
                    {!item.availability && <span className="menu-item-unavailable">Unavailable</span>}
                </div>
            </div>
            
            {item.availability && (
    <div className="buyer-cart-item-quantity-section">
        <div className="buyer-quantity-controls">
            <button 
                onClick={handleDecrement}
                className="buyer-quantity-btn"
                disabled={cartQuantity === 0}
            >
                <i className="fa-solid fa-minus"></i>
            </button>
            <span className="buyer-quantity-display">{cartQuantity}</span>
            <button 
                onClick={handleIncrement}
                className="buyer-quantity-btn"
            >
                <i className="fa-solid fa-plus"></i>
            </button>
        </div>
    </div>
)}

        </div>
    );
}

function ShopCard({ shop, onFavoriteUpdate }) {
    const [isFavorite, setIsFavorite] = useState(false);
    const [showMenu, setShowMenu] = useState(false);
    const [cart, setCart] = useState([]);
    const [showReceipt, setShowReceipt] = useState(false);
    
    // Get random image for shop
    const shopImage = shopImages[Math.floor(Math.random() * shopImages.length)];
    
    // Check if shop is favorite on component mount
    useEffect(() => {
        setIsFavorite(isShopFavorite(shop.id));
    }, [shop.id]);

    const handleFavoriteClick = (e) => {
        e.stopPropagation();
        
        const userId = getCurrentUserId();
        if (!userId) {
            // Show login required message
            const notification = document.createElement('div');
            notification.className = 'favorite-notification';
            notification.textContent = 'Please log in to add favorites!';
            notification.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background: #ef4444;
                color: white;
                padding: 12px 20px;
                border-radius: 8px;
                z-index: 1000;
                animation: slideIn 0.3s ease-out;
            `;
            document.body.appendChild(notification);
            setTimeout(() => {
                notification.remove();
            }, 3000);
            return;
        }
        
        if (isFavorite) {
            // Remove from favorites
            removeFromFavorites(shop.id);
            setIsFavorite(false);
            if (onFavoriteUpdate) onFavoriteUpdate();
            
            // Show removed message
            const notification = document.createElement('div');
            notification.className = 'favorite-notification';
            notification.textContent = `${shop.name} removed from favorites!`;
            notification.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background: #ef4444;
                color: white;
                padding: 12px 20px;
                border-radius: 8px;
                z-index: 1000;
                animation: slideIn 0.3s ease-out;
            `;
            document.body.appendChild(notification);
            setTimeout(() => {
                notification.remove();
            }, 3000);
        } else {
            // Add to favorites
            const success = addToFavorites(shop);
            if (success) {
                setIsFavorite(true);
                if (onFavoriteUpdate) onFavoriteUpdate();
                // Show success message
                const notification = document.createElement('div');
                notification.className = 'favorite-notification';
                notification.textContent = `${shop.name} added to favorites!`;
                notification.style.cssText = `
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    background: #10b981;
                    color: white;
                    padding: 12px 20px;
                    border-radius: 8px;
                    z-index: 1000;
                    animation: slideIn 0.3s ease-out;
                `;
                document.body.appendChild(notification);
                setTimeout(() => {
                    notification.remove();
                }, 3000);
            }
        }
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

    const handleAddToCart = () => {
        const userId = getCurrentUserId();
        console.log(shop.id);
        if (!userId) {
            alert("Please log in to add to cart.");
            return;
        }
    
        const cartKey = `cart_${userId}`;
        const existingCart = JSON.parse(localStorage.getItem(cartKey)) || [];
    
        const updatedCart = [...existingCart];
    
        cart.forEach(item => {
            const index = updatedCart.findIndex(ci => ci._id === item._id);
            if (index > -1) {
                updatedCart[index].quantity += item.quantity;
            } else {
                // Add shop.id to each item when adding to cart
                updatedCart.push({ 
                    ...item, 
                    shopId: shop.id 
                });
            }
        });
    
        localStorage.setItem(cartKey, JSON.stringify(updatedCart));
        alert("Items added to your cart!");
    };

    const handleConfirmOrder = async () => {
        const token = localStorage.getItem('token'); // Your JWT token
        console.log(token);
        if (!token) {
          alert("Please log in first.");
          return;
        }

        const orderData = {
                sellerId: shop.id,   // note: changed key from sellerId to seller
                items: cart.map(item => ({
                  menuItemId: item._id,
                  quantity: item.quantity
                })),
                deliveryAddress: "Chagda Hostel",
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
                        title={isFavorite ? "Remove from favorites" : "Add to favorites"}
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
    <>
        <div className="menu-footer">
            <button onClick={handleOrderClick} className="order-summary-btn">
                <ShoppingCart size={16} />
                View Order ({cartItemCount} items)
            </button>
        </div>

        <div className="menu-footer">
            <button onClick={handleAddToCart} className="order-summary-btn" style={{ backgroundColor: '#faa500' }}>
                <i className="fa-solid fa-cart-plus"></i> Add to Cart
            </button>
        </div>
    </>
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
    const [favoriteUpdateTrigger, setFavoriteUpdateTrigger] = useState(0);

    const location = useLocation();
    const shopRefs = useRef({});

    useEffect(() => {
        fetchShops();
    }, []);

    useEffect(() => {
        const scrollToShopId = location.state?.scrollToShopId;
        if (scrollToShopId && shopRefs.current[scrollToShopId]) {
            shopRefs.current[scrollToShopId].scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }, [location.state, shops]);

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

    const handleFavoriteUpdate = () => {
        setFavoriteUpdateTrigger(prev => prev + 1);
    };

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
                    <div
                        key={shop.id}
                        ref={el => shopRefs.current[shop.id] = el}
                    >
                        <ShopCard
                            shop={shop}
                            onFavoriteUpdate={handleFavoriteUpdate}
                        />
                    </div>
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