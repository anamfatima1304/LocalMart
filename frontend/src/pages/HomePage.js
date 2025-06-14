// src/pages/HomePage.js
import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

function HomePage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const images = [
    'https://plus.unsplash.com/premium_photo-1670601440146-3b33dfcd7e17?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8Zm9vZHxlbnwwfHwwfHx8MA%3D%3D',
    'https://plus.unsplash.com/premium_photo-1673580742890-4af144293960?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTN8fGZvb2R8ZW58MHx8MHx8fDA%3D',
    'https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fGZvb2R8ZW58MHx8MHx8fDA%3D',
    'https://plus.unsplash.com/premium_photo-1673108852141-e8c3c22a4a22?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8Zm9vZHxlbnwwfHwwfHx8MA%3D%3D',
    'https://images.unsplash.com/photo-1496318447583-f524534e9ce1?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGp1aWNlc3xlbnwwfHwwfHx8MA%3D%3D',
    'https://images.unsplash.com/photo-1519693962737-35393d39dbfc?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fGp1aWNlc3xlbnwwfHwwfHx8MA%3D%3D'
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % images.length);
    }, 5000); // Change image every 3 seconds

    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <>
      <Navbar />
      <section className="hero">
        <div className="hero-carousel">
          {images.map((image, index) => (
            <div 
              key={index}
              className={`hero-slide ${index === currentSlide ? 'active' : ''}`}
            >
              <img src={image} alt={`Slide ${index + 1}`} />
            </div>
          ))}
        </div>
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <h1>Bringing Local Shopping to Your Doorstep</h1>
          <p>Shop from local stores and get the best deals delivered to your doorstep.</p>
          <div className="hero-buttons">
            <a href="/login" className="buy-btn">Start Shopping</a>
            <a href="/login" className="sell-btn">Become a Seller</a>
          </div>
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
            <div className="audience-icon"><i class="fas fa-business-time"></i></div>
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