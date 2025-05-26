// src/pages/HomePage.js
import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';


function HomePage() {
  return (
    <>
      <Navbar />
      <section className="hero">
        <h1>Bringing Local Shopping to Your Doorstep</h1>
        <p>Shop from local stores and get the best deals delivered to your doorstep.</p>
        <div className="hero-buttons">
          <a href="/login" className="buy-btn">Start Shopping</a>
          <a href="/login" className="sell-btn">Become a Seller</a>
        </div>
      </section>

      <section id="features" className="features">
        <div className="section-title">
          <h2>Features</h2>
          <p>Explore the amazing features of Local Mart.</p>
        </div>
        <div className="features-container">
          <div className="feature-card">
            <div className="feature-icon"><i className="fas fa-truck"></i></div>
            <h3>Fast Delivery</h3>
            <p>Get your products delivered in no time with our fast delivery system.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon"><i className="fas fa-credit-card"></i></div>
            <h3>Secure Payments</h3>
            <p>Pay securely using our trusted payment gateways.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon"><i className="fas fa-star"></i></div>
            <h3>Customer Ratings</h3>
            <p>Read reviews from fellow shoppers to make the right choices.</p>
          </div>
        </div>
      </section>

      <section id="audience" className="target-audience">
        <div className="section-title">
          <h2>For Who</h2>
          <p>Whether you're a shopper, seller, or business owner, LocalMart is for you.</p>
        </div>
        <div className="audience-container">
          <div className="audience-card">
            <div className="audience-icon"><i className="fas fa-users"></i></div>
            <h3>Shoppers</h3>
            <p>Discover local shops and buy products at the best prices.</p>
          </div>
          <div className="audience-card">
            <div className="audience-icon"><i className="fas fa-store"></i></div>
            <h3>Sellers</h3>
            <p>Expand your reach by selling products locally.</p>
          </div>
          <div className="audience-card">
            <div className="audience-icon"><i className="fas fa-business-time"></i></div>
            <h3>Businesses</h3>
            <p>Grow your local business and reach a wider audience.</p>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}

export default HomePage;
