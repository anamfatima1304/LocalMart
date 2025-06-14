import React from 'react';
import { Heart, Search, Filter, Star, MapPin } from 'lucide-react';
import { useState } from 'react';
import '@fortawesome/fontawesome-free/css/all.min.css'; // Import Font Awesome
import TimePicker from 'react-time-picker';
import 'react-time-picker/dist/TimePicker.css';
import 'react-clock/dist/Clock.css';
import MyCartContent from "./MyCartContent";
import '../buyer.css'


// Data for categories and sellers
const categories1= [
    { name: 'Food', img: 'https://via.placeholder.com/64' },
    { name: 'Clothing', img: 'https://via.placeholder.com/64' },
    { name: 'Electronics', img: 'https://via.placeholder.com/64' },
    { name: 'Books', img: 'https://via.placeholder.com/64' },
    { name: 'Crafts', img: 'https://via.placeholder.com/64' },
    { name: 'Essentials', img: 'https://via.placeholder.com/64' },
];

const sellers = [
    {
        category: 'Food',
        name: 'Campus Bites',
        img: 'https://via.placeholder.com/150',
        rating: 4,
        reviews: 46,
        description: 'Homemade meals and snacks for students. Daily specials and customizable menu options.',
    },
    {
        category: 'Crafts',
        name: 'Artistic Creations',
        img: 'https://via.placeholder.com/150',
        rating: 4,
        reviews: 28,
        description: 'Handmade crafts, calligraphy, and art pieces. Custom orders available.',
    },
    {
        category: 'Essentials',
        name: 'Hostel Supplies',
        img: 'https://via.placeholder.com/150',
        rating: 5,
        reviews: 52,
        description: 'All essential items for hostel life. Stationery, toiletries, and daily necessities.',
    },
];

const recentOrders = [
    {
        orderId: '#ORD-2025-1234',
        seller: 'Campus Bites',
        date: 'April 27, 2025',
        amount: 'Rs. 450',
        status: 'Delivered',
        statusClass: 'delivered'
    },
    {
        orderId: '#ORD-2025-1233',
        seller: 'Artistic Creations',
        date: 'April 25, 2025',
        amount: 'Rs. 850',
        status: 'Pending',
        statusClass: 'pending'
    },
    {
        orderId: '#ORD-2025-1232',
        seller: 'Hostel Supplies',
        date: 'April 24, 2025',
        amount: 'Rs. 350',
        status: 'Delivered',
        statusClass: 'delivered'
    },
    {
        orderId: '#ORD-2025-1231',
        seller: 'Campus Bites',
        date: 'April 23, 2025',
        amount: 'Rs. 575',
        status: 'Cancelled',
        statusClass: 'cancelled'
    },
];

function RecentOrders() {
    return (
        <div className="buyer-recent-orders">
            <div className="buyer-recent-orders-header">
                <h2 className="buyer-recent-orders-title">Recent Orders</h2>
                <a href="#" className="buyer-recent-orders-view-all">View All</a>
            </div>
            
            <div className="buyer-orders-table-container">
                <table className="buyer-orders-table">
                    <thead>
                        <tr>
                            <th>Order ID</th>
                            <th>Seller</th>
                            <th>Date</th>
                            <th>Amount</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {recentOrders.map((order, index) => (
                            <tr key={index}>
                                <td>
                                    <a href="#" className="buyer-order-id">{order.orderId}</a>
                                </td>
                                <td>
                                    <span className="buyer-order-seller">{order.seller}</span>
                                </td>
                                <td>
                                    <span className="buyer-order-date">{order.date}</span>
                                </td>
                                <td>
                                    <span className="buyer-order-amount">{order.amount}</span>
                                </td>
                                <td>
                                    <span className={`buyer-order-status status-${order.statusClass}`}>
                                        {order.status}
                                    </span>
                                </td>
                                <td>
                                    <button className="buyer-order-action-button">
                                        <i className="fa-solid fa-ellipsis-vertical"></i>
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


// Category Card Component
function CategoryCard({ category }) {
    return (
        <div className="buyer-category-card">
            <img src={category.img} alt={category.name} className="buyer-category-image" />
            <span className="buyer-category-name">{category.name}</span>
        </div>
    );
}

// Seller Card Component
function SellerCard({ seller, heartSize = 32 }) {
    const [isFavorite, setIsFavorite] = useState(false);
    
    const handleFavoriteClick = (e) => {
        // Prevent the click from affecting parent elements
        e.stopPropagation();
        setIsFavorite(!isFavorite);
    };
    
    return (
        <div className="buyer-seller-card">
            <div className="buyer-seller-header">
                <span className="buyer-seller-category">{seller.category}</span>
                {/* Heart icon with toggle functionality */}
                <div 
                    onClick={handleFavoriteClick}
                    className="buyer-cursor-pointer buyer-flex buyer-items-center buyer-justify-center"
                >
                    <Heart 
                        className="buyer-favorite-icon buyer-transition-colors buyer-duration-200" 
                        fill={isFavorite ? "#f44336" : "none"} 
                        color={isFavorite ? "#f44336" : "currentColor"}
                        size={heartSize}
                    />
                </div>
            </div>
            <h3 className="buyer-seller-name">{seller.name}</h3>
            <div className="buyer-seller-rating">
                {[...Array(seller.rating)].map((_, i) => (
                    <i key={i} className="fa-solid fa-star buyer-star-icon"></i>
                ))}
                <span className="buyer-seller-reviews">({seller.reviews} reviews)</span>
            </div>
            <p className="buyer-seller-description">{seller.description}</p>
            <button className="buyer-seller-button">
                View {seller.category === 'Food' ? 'Menu' : 'Products'}
            </button>
        </div>
    );
}


// Dashboard Content Component
function DashboardContent() {
    return (
        <div className="buyer-dashboard-content">
            <div className="buyer-welcome-section">
                <div>
                    <h1 className="buyer-dashboard-title">Welcome back, John!</h1>
                    <p className="buyer-dashboard-subtitle">Here's what's happening with your orders today.</p>
                </div>
                <div className="buyer-action-buttons">
                    <button className="buyer-view-cart-button">View Cart</button>
                    <button className="buyer-new-order-button">+ New Order</button>
                </div>
            </div>
            <div className="buyer-stats-grid">
                <div className="buyer-stat-card total-orders">
                    <i className="fa-solid fa-shopping-bag buyer-stat-icon"></i>
                    <div>
                        <h3 className="buyer-stat-value">24</h3>
                        <p className="buyer-stat-label">Total Orders</p>
                    </div>
                </div>
                <div className="buyer-stat-card cart-items">
                    <i className="fa-solid fa-shopping-cart buyer-stat-icon"></i>
                    <div>
                        <h3 className="buyer-stat-value">5</h3>
                        <p className="buyer-stat-label">Cart Items</p>
                    </div>
                </div>
                <div className="buyer-stat-card buyer-favorite-sellers">
                    <i className="fa-solid fa-heart buyer-stat-icon"></i>
                    <div>
                        <h3 className="buyer-stat-value">12</h3>
                        <p className="buyer-stat-label">Favorite Sellers</p>
                    </div>
                </div>
                <div className="buyer-stat-card buyer-reviews-given">
                    <i className="fa-solid fa-star buyer-stat-icon"></i>
                    <div>
                        <h3 className="buyer-stat-value">18</h3>
                        <p className="buyer-stat-label">Reviews Given</p>
                    </div>
                </div>
            </div>
            {/* <div className="buyer-category-section">
                <div className="buyer-section-header">
                    <h2 className="buyer-section-title">Shop by Category</h2>
                    <a href="#" className="buyer-view-all">View All</a>
                </div>
                <div className="buyer-category-grid">
                    {categories1.map((category, index) => (
                        <CategoryCard key={index} category={category} />
                    ))}
                </div>
            </div> */}
            <div className="buyer-seller-section">
                <div className="buyer-section-header">
                    <h2 className="buyer-section-title">Featured Sellers</h2>
                    <a href="#" className="buyer-view-all">View All</a>
                </div>
                <div className="buyer-seller-grid">
                    {sellers.map((seller, index) => (
                        <SellerCard key={index} seller={seller} />
                    ))}
                </div>
            </div>
           {/* <div><RecentOrders /></div> */}
        </div>
    );
}


export default DashboardContent;