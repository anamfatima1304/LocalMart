import React from 'react';
import { Heart, Search, Filter, Star, MapPin } from 'lucide-react';
import { useState } from 'react';
import '@fortawesome/fontawesome-free/css/all.min.css'; // Import Font Awesome
import TimePicker from 'react-time-picker';
import 'react-time-picker/dist/TimePicker.css';
import 'react-clock/dist/Clock.css';
import '../buyer.css'
const categories1= [
    { name: 'Food', img: 'https://via.placeholder.com/64' },
    { name: 'Clothing', img: 'https://via.placeholder.com/64' },
    { name: 'Electronics', img: 'https://via.placeholder.com/64' },
    { name: 'Books', img: 'https://via.placeholder.com/64' },
    { name: 'Crafts', img: 'https://via.placeholder.com/64' },
    { name: 'Essentials', img: 'https://via.placeholder.com/64' },
];

const categories = [
    { name: 'All', count: 45 },
    { name: 'Food', count: 18 },
    { name: 'Clothing', count: 8 },
    { name: 'Electronics', count: 6 },
    { name: 'Books', count: 5 },
    { name: 'Crafts', count: 4 },
    { name: 'Essentials', count: 4 },
];

function ShopCard({ shop }) {
    const [isFavorite, setIsFavorite] = useState(false);
    
    const handleFavoriteClick = (e) => {
        e.stopPropagation();
        setIsFavorite(!isFavorite);
    };
    
    return (
        <div className="buyer-shop-card">
            <div className="buyer-shop-image-container">
                <img src={shop.img} alt={shop.name} className="buyer-shop-image" />
                <div className="buyer-shop-tags">
                    {shop.tags.slice(0, 2).map((tag, index) => (
                        <span key={index} className="buyer-shop-tag">{tag}</span>
                    ))}
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
                    <span className="buyer-shop-category">{shop.category}</span>
                </div>
                
                <div className="buyer-shop-rating">
                    <Star className="buyer-star-icon" fill="#fbbf24" color="#fbbf24" size={16} />
                    <span className="buyer-rating-value">{shop.rating}</span>
                    <span className="buyer-rating-reviews">({shop.reviews} reviews)</span>
                </div>
                
                <p className="buyer-shop-description">{shop.description}</p>
                
                <div className="buyer-shop-meta">
                    <div className="buyer-shop-location">
                        <MapPin size={14} className="buyer-location-icon" />
                        <span>{shop.location}</span>
                    </div>
                    <div className="shop-delivery">
                        <i className="fa-solid fa-clock buyer.delivery-icon"></i>

                        <span>{shop.deliveryTime}</span>
                    </div>
                </div>
                
                <button className="buyer-shop-visit-button">
                    Visit Shop
                </button>
            </div>
        </div>
    );
}

function FilterSearch({ searchTerm, setSearchTerm, selectedCategory, setSelectedCategory }) {
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
    const allShops = [
        {
            id: 1,
            category: 'Food',
            name: 'Campus Bites',
            img: '/api/placeholder/200/150',
            rating: 4.5,
            reviews: 46,
            description: 'Homemade meals and snacks for students. Daily specials and customizable menu options.',
            location: 'Block A, Room 101',
            deliveryTime: '15-25 min',
            tags: ['Fast Delivery', 'Popular']
        },
        {
            id: 2,
            category: 'Food',
            name: 'Midnight Munchies',
            img: '/api/placeholder/200/150',
            rating: 4.2,
            reviews: 32,
            description: 'Late night food delivery. Perfect for those study sessions and midnight cravings.',
            location: 'Block B, Room 205',
            deliveryTime: '20-30 min',
            tags: ['24/7', 'Late Night']
        },
        {
            id: 3,
            category: 'Food',
            name: 'Healthy Bites',
            img: '/api/placeholder/200/150',
            rating: 4.7,
            reviews: 28,
            description: 'Nutritious and delicious meals. Salads, smoothies, and healthy snacks.',
            location: 'Block C, Room 103',
            deliveryTime: '10-20 min',
            tags: ['Healthy', 'Organic']
        },
        {
            id: 4,
            category: 'Crafts',
            name: 'Artistic Creations',
            img: '/api/placeholder/200/150',
            rating: 4.3,
            reviews: 28,
            description: 'Handmade crafts, calligraphy, and art pieces. Custom orders available.',
            location: 'Block A, Room 304',
            deliveryTime: '1-2 days',
            tags: ['Handmade', 'Custom']
        },
        {
            id: 5,
            category: 'Crafts',
            name: 'Creative Corner',
            img: '/api/placeholder/200/150',
            rating: 4.1,
            reviews: 19,
            description: 'DIY craft supplies and handmade decorations. Perfect for room decoration.',
            location: 'Block B, Room 401',
            deliveryTime: 'Same day',
            tags: ['DIY', 'Decorative']
        },
        {
            id: 6,
            category: 'Essentials',
            name: 'Hostel Supplies',
            img: '/api/placeholder/200/150',
            rating: 4.8,
            reviews: 52,
            description: 'All essential items for hostel life. Stationery, toiletries, and daily necessities.',
            location: 'Block A, Room 102',
            deliveryTime: '5-15 min',
            tags: ['Quick', 'Essential']
        },
        {
            id: 7,
            category: 'Essentials',
            name: 'Study Essentials',
            img: '/api/placeholder/200/150',
            rating: 4.4,
            reviews: 35,
            description: 'Everything you need for studies. Books, stationery, and study accessories.',
            location: 'Block C, Room 201',
            deliveryTime: '10-20 min',
            tags: ['Study', 'Books']
        },
        {
            id: 8,
            category: 'Clothing',
            name: 'Campus Fashion',
            img: '/api/placeholder/200/150',
            rating: 4.0,
            reviews: 24,
            description: 'Trendy and affordable clothing for students. Casual wear and accessories.',
            location: 'Block B, Room 303',
            deliveryTime: 'Same day',
            tags: ['Fashion', 'Affordable']
        },
        {
            id: 9,
            category: 'Electronics',
            name: 'Tech Hub',
            img: '/api/placeholder/200/150',
            rating: 4.6,
            reviews: 41,
            description: 'Electronics and gadgets for students. Repairs and accessories available.',
            location: 'Block A, Room 405',
            deliveryTime: '30 min - 1 hr',
            tags: ['Electronics', 'Repair']
        },
        {
            id: 10,
            category: 'Books',
            name: 'Book Corner',
            img: '/api/placeholder/200/150',
            rating: 4.5,
            reviews: 29,
            description: 'New and used books. Textbooks, novels, and reference materials.',
            location: 'Block C, Room 105',
            deliveryTime: 'Same day',
            tags: ['Books', 'Used Books']
        }
    ];

    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    
    // Filter shops based on search and category
    const filteredShops = allShops.filter(shop => {
        const matchesSearch = shop.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            shop.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === 'All' || shop.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });
    
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
            />
            
            <div className="buyer-shops-grid">
                {filteredShops.map((shop) => (
                    <ShopCard key={shop.id} shop={shop} />
                ))}
            </div>
            
            {filteredShops.length === 0 && (
                <div className="buyer-no-results">
                    <i className="fa-solid fa-search buyer.no-results-icon"></i>
                    <h3>No shops found</h3>
                    <p>Try adjusting your search terms or category filter</p>
                </div>
            )}
        </div>
    );
}

export default ExploreShopsContent;