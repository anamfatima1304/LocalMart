import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Search, Filter, Star, MapPin, Clock, Trash2 } from 'lucide-react';
import '@fortawesome/fontawesome-free/css/all.min.css';

// Helper function to get current user ID (adjust based on your auth system)
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

// Helper function to get user-specific favorites
const getFavorites = () => {
    const userId = getCurrentUserId();
    if (!userId) return [];
    
    const favoritesKey = `favoriteShops_${userId}`;
    const favorites = localStorage.getItem(favoritesKey);
    return favorites ? JSON.parse(favorites) : [];
};

// Helper function to save user-specific favorites
const saveFavorites = (favorites) => {
    const userId = getCurrentUserId();
    if (!userId) return;
    
    const favoritesKey = `favoriteShops_${userId}`;
    localStorage.setItem(favoritesKey, JSON.stringify(favorites));
};

// Function to remove a shop from user-specific favorites
const removeFromFavorites = (shopId) => {
    const favorites = getFavorites();
    const updatedFavorites = favorites.filter(fav => fav.id !== shopId);
    saveFavorites(updatedFavorites);
};

// Function to add a shop to user-specific favorites (for use in other components)
export const addToFavorites = (shop) => {
    const userId = getCurrentUserId();
    if (!userId) {
        console.warn('No user logged in');
        return false;
    }
    
    const favorites = getFavorites();
    const isAlreadyFavorite = favorites.some(fav => fav.id === shop.id);
    
    if (!isAlreadyFavorite) {
        const updatedFavorites = [...favorites, shop];
        saveFavorites(updatedFavorites);
        return true;
    }
    
    return false;
};

// Function to check if a shop is in user's favorites (for use in other components)
export const isShopFavorite = (shopId) => {
    const favorites = getFavorites();
    return favorites.some(fav => fav.id === shopId);
};

// Function to toggle favorite status (for use in other components)
export const toggleFavorite = (shop) => {
    const favorites = getFavorites();
    const isFavorite = favorites.some(fav => fav.id === shop.id);
    
    if (isFavorite) {
        removeFromFavorites(shop.id);
        return false;
    } else {
        addToFavorites(shop);
        return true;
    }
};

function FavoriteShopCard({ shop, onRemove }) {
    const navigate = useNavigate();

    const handleRemove = () => {
        removeFromFavorites(shop.id);
        onRemove(shop.id);
    };

    const handleViewShop = () => {
        navigate('/explore-shops', {
            state: { scrollToShopId: shop.id }
        });
    };

    return (
        <div className="buyer-shop-card">
            <div className="buyer-shop-image-container">
                <img src={shop.image} alt={shop.name} className="buyer-shop-image" />
                <div className="buyer-shop-tags">
                    <span className="buyer-shop-tag">
                        {shop.totalItems} items
                    </span>
                    <span className="buyer-shop-tag">
                        {shop.category}
                    </span>
                </div>
                <div 
                    onClick={handleRemove}
                    className="buyer-shop-favorite"
                    title="Remove from favorites"
                >
                    <Heart 
                        className="buyer-favorite-icon" 
                        fill="#f44336" 
                        color="#f44336"
                        size={20}
                    />
                </div>
            </div>
            
            <div className="buyer-shop-content">
                <div className="buyer-shop-header">
                    <h3 className="buyer-shop-name">{shop.name}</h3>
                    <span className="buyer-shop-category">
                        {shop.category}
                    </span>
                </div>
                
                <div className="buyer-shop-rating">
                    <Star className="buyer-star-icon" fill="#fbbf24" color="#fbbf24" size={16} />
                    <span className="buyer-rating-value">{shop.rating}</span>
                    <span className="buyer-rating-reviews">(★★★★☆)</span>
                </div>
                
                <div className="buyer-shop-meta">
                    <div className="buyer-shop-location">
                        <MapPin size={14} className="buyer-location-icon" />
                        <span>{shop.description}</span>
                    </div>
                    <div className="shop-delivery">
                        <i className="fa-solid fa-clock buyer-delivery-icon"></i>
                        <span>{shop.deliveryTime}</span>
                    </div>
                </div>
                
                {/* <div className="buyer-shop-actions">
                    <button className="buyer-shop-visit-button" onClick={handleViewShop}>
                        View Shop
                    </button>
                </div> */}
            </div>
        </div>
    );
}

function FavoriteSection() {
    const [favoriteShops, setFavoriteShops] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        checkAuthAndLoadFavorites();
    }, []);

    const checkAuthAndLoadFavorites = () => {
        const userId = getCurrentUserId();
        if (userId) {
            setIsLoggedIn(true);
            loadFavorites();
        } else {
            setIsLoggedIn(false);
            setFavoriteShops([]);
        }
    };

    const loadFavorites = () => {
        const favorites = getFavorites();
        setFavoriteShops(favorites);
    };

    const handleRemoveShop = (shopId) => {
        setFavoriteShops(prev => prev.filter(shop => shop.id !== shopId));
    };

    const handleClearAllFavorites = () => {
        if (window.confirm('Are you sure you want to remove all favorite shops?')) {
            const userId = getCurrentUserId();
            if (userId) {
                const favoritesKey = `favoriteShops_${userId}`;
                localStorage.removeItem(favoritesKey);
                setFavoriteShops([]);
            }
        }
    };

    const filteredShops = favoriteShops.filter(shop =>
        shop.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        shop.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        shop.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Show login prompt if user is not authenticated
    if (!isLoggedIn) {
        return (
            <div className="buyer-explore-content">
                <div className="buyer-no-results">
                    <div style={{ fontSize: '64px', color: '#ccc', marginBottom: '16px' }}>
                        <Heart size={64} color="#ccc" />
                    </div>
                    <h3>Please log in to view favorites</h3>
                    <p>You need to be logged in to access your favorite shops.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="buyer-explore-content">
            <div className="buyer-favorite-header">
                <div>
                    <h1 className="buyer-explore-title">Favorite Shops</h1>
                    <p className="buyer-explore-subtitle">Your saved shops for quick access</p>
                </div>
                <div className="buyer-explore-stats">
                    <span className="buyer-shops-count2">{favoriteShops.length} favorite shops</span>
                    {favoriteShops.length > 0 && (
                        <button 
                            onClick={handleClearAllFavorites}
                            className="buyer-clear-all-btn"
                            style={{
                                marginLeft: '900px',
                                marginTop: '-30px',
                                marginBottom: '10px',
                                padding: '8px 16px',
                                backgroundColor: '#ef4444',
                                color: 'white',
                                border: 'none',
                                borderRadius: '8px',
                                fontSize: '14px',
                                fontWeight: '500',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px',
                                transition: 'background-color 0.2s',
                                }}
                        >
                            <Trash2 size={16} />
                            Clear All
                        </button>
                    )}
                </div>
            </div>

            {favoriteShops.length > 0 && (
                <div className="buyer-filter-search-container">
                    <div className="buyer-search-container">
                        <div className="buyer-search-input-wrapper">
                            <Search className="buyer-search-icon" size={20} />
                            <input
                                type="text"
                                placeholder="Search favorite shops..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="buyer-search-input"
                            />
                        </div>
                    </div>
                </div>
            )}

            <div className="buyer-favorite-content">
                {favoriteShops.length === 0 ? (
                    <div className="buyer-no-results">
                        <div style={{ fontSize: '64px', color: '#ccc', marginBottom: '16px' }}>
                            <Heart size={64} color="#ccc" />
                        </div>
                        <h3>No favorite shops yet</h3>
                        <p>Start exploring shops and add them to your favorites by clicking the heart icon!</p>
                    </div>
                ) : filteredShops.length === 0 ? (
                    <div className="buyer-no-results">
                        <i className="fa-solid fa-search buyer-no-results-icon"></i>
                        <h3>No shops found</h3>
                        <p>Try adjusting your search terms</p>
                    </div>
                ) : (
                    <div className="buyer-shops-grid">
                        {filteredShops.map((shop) => (
                            <FavoriteShopCard 
                                key={shop.id} 
                                shop={shop} 
                                onRemove={handleRemoveShop}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default FavoriteSection;