// src/pages/HomePage.js
import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './home.css'

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

  // Data for the new attractive cards
  const benefitCards = [
    {
      title: "Shop Local, Save More",
      description: "Discover amazing deals from your neighborhood stores. Support local businesses while enjoying competitive prices and fresh products delivered straight to your door.",
      image: "https://media.istockphoto.com/id/2098517840/photo/grocery-shopping.webp?a=1&b=1&s=612x612&w=0&k=20&c=FTrThJd6_w0NkWZe0o6biF4aM4alef-lm7VVjpPk9Vo=",
      features: ["Best Local Prices", "Fresh Products", "Community Support"]
    },
    {
      title: "Lightning Fast Delivery",
      description: "Experience the fastest delivery in your area. Our network of local partners ensures your orders reach you within hours, not days. Track your delivery in real-time.",
      image: "https://media.istockphoto.com/id/2149058664/photo/hands-box-and-delivery-man-at-front-door-in-home-with-client-services-and-shipping-for.webp?a=1&b=1&s=612x612&w=0&k=20&c=6MkXJD-YjjBpdy1ejrVH-wRo7b8W0WUIuXToDCtJ7Wg=",
      features: ["Same-Day Delivery", "Real-Time Tracking", "Local Network"]
    },
    {
      title: "Trusted & Secure",
      description: "Shop with confidence using our secure payment system and verified sellers. Every transaction is protected, and customer satisfaction is our top priority.",
      image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0",
      features: ["Secure Payments", "Verified Sellers", "24/7 Support"]
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % images.length);
    }, 5000); // Change image every 5 seconds

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

      {/* Continuous Scrolling Food Cards */}
      <section className="food-showcase">
        <div className="food-scroll-container">
          <div className="food-scroll-track">
            {/* First set of cards */}
            <div className="food-card">
              <img src="https://images.unsplash.com/photo-1528556860752-2a6a19a285a3?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8anVpY2V8ZW58MHx8MHx8fDA%3D" alt="Pizza" />
              <div className="food-card-overlay">
                <h4>Fresh Pizza</h4>
              </div>
            </div>
            <div className="food-card">
              <img src="https://images.unsplash.com/photo-1546793665-c74683f339c1?w=300&auto=format&fit=crop&q=60" alt="Salad" />
              <div className="food-card-overlay">
                <h4>Garden Salad</h4>
                
              </div>
            </div>
            <div className="food-card">
              <img src="https://images.unsplash.com/photo-1551782450-a2132b4ba21d?w=300&auto=format&fit=crop&q=60" alt="Burger" />
              <div className="food-card-overlay">
                <h4>Juicy Burger</h4>
                
              </div>
            </div>
            <div className="food-card">
              <img src="https://images.unsplash.com/photo-1570197788417-0e82375c9371?w=300&auto=format&fit=crop&q=60" alt="Tacos" />
              <div className="food-card-overlay">
                <h4>Ice-Cream</h4>
        
              </div>
            </div>
            <div className="food-card">
              <img src="https://images.unsplash.com/photo-1613478223719-2ab802602423?w=300&auto=format&fit=crop&q=60" alt="Smoothie" />
              <div className="food-card-overlay">
                <h4>Orange Juice</h4>
             
              </div>
            </div>
            <div className="food-card">
              <img src="https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=300&auto=format&fit=crop&q=60" alt="Pancakes" />
              <div className="food-card-overlay">
                <h4>Fluffy Pancakes</h4>
            
              </div>
            </div>
            <div className="food-card">
              <img src="https://images.unsplash.com/photo-1608039829572-78524f79c4c7?w=300&auto=format&fit=crop&q=60" alt="Pasta" />
              <div className="food-card-overlay">
                <h4>Omellete</h4>
           
              </div>
            </div>
            <div className="food-card">
              <img src="https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=300&auto=format&fit=crop&q=60" alt="Ice Cream" />
              <div className="food-card-overlay">
                <h4>Juice</h4>
                
              </div>
            </div>
            <div className="food-card">
              <img src="https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=300&auto=format&fit=crop&q=60" alt="Sushi" />
              <div className="food-card-overlay">
                <h4>Tea</h4>
              </div>
            </div>
            <div className="food-card">
              <img src="https://images.unsplash.com/photo-1559181567-c3190ca9959b?w=300&auto=format&fit=crop&q=60" alt="Cake" />
              <div className="food-card-overlay">
                <h4>Cherry</h4>
              </div>
            </div>
            
            {/* Duplicate set for seamless loop */}
            <div className="food-card">
              <img src="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8cGl6emF8ZW58MHx8MHx8fDA%3D" alt="Pizza" />
              <div className="food-card-overlay">
                <h4>Fresh Pizza</h4>
              </div>
            </div>
            <div className="food-card">
              <img src="https://images.unsplash.com/photo-1546793665-c74683f339c1?w=300&auto=format&fit=crop&q=60" alt="Salad" />
              <div className="food-card-overlay">
                <h4>Garden Salad</h4>
              </div>
            </div>
            <div className="food-card">
              <img src="https://images.unsplash.com/photo-1551782450-a2132b4ba21d?w=300&auto=format&fit=crop&q=60" alt="Burger" />
              <div className="food-card-overlay">
                <h4>Juicy Burger</h4>
              </div>
            </div>
            <div className="food-card">
              <img src="https://images.unsplash.com/photo-1570197788417-0e82375c9371?w=300&auto=format&fit=crop&q=60" alt="Tacos" />
              <div className="food-card-overlay">
                <h4>Spicy Tacos</h4>
                <p>$11.99</p>
              </div>
            </div>
            <div className="food-card">
              <img src="https://images.unsplash.com/photo-1613478223719-2ab802602423?w=300&auto=format&fit=crop&q=60" alt="Smoothie" />
              <div className="food-card-overlay">
                <h4>Orange Juice</h4>
                <p>$6.99</p>
              </div>
            </div>
            <div className="food-card">
              <img src="https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=300&auto=format&fit=crop&q=60" alt="Pancakes" />
              <div className="food-card-overlay">
                <h4>Fluffy Pancakes</h4>
                <p>$9.99</p>
              </div>
            </div>
            <div className="food-card">
              <img src="https://images.unsplash.com/photo-1608039829572-78524f79c4c7?w=300&auto=format&fit=crop&q=60" alt="Pasta" />
              <div className="food-card-overlay">
                <h4>Omellete</h4>
                <p>$13.99</p>
              </div>
            </div>
            <div className="food-card">
              <img src="https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=300&auto=format&fit=crop&q=60" alt="Ice Cream" />
              <div className="food-card-overlay">
                <h4>Vanilla Ice Cream</h4>
                <p>$4.99</p>
              </div>
            </div>
            <div className="food-card">
              <img src="https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=300&auto=format&fit=crop&q=60" alt="Sushi" />
              <div className="food-card-overlay">
                <h4>Fresh Sushi</h4>
                <p>$18.99</p>
              </div>
            </div>
            <div className="food-card">
              <img src="https://images.unsplash.com/photo-1559181567-c3190ca9959b?w=300&auto=format&fit=crop&q=60" alt="Cake" />
              <div className="food-card-overlay">
                <h4>Chocolate Cake</h4>
                <p>$7.99</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* New Attractive Benefits Section */}
      <section className="benefits-section">
        <div className="container">
          {benefitCards.map((card, index) => (
            <div key={index} className={`benefit-card ${index % 2 === 1 ? 'reverse' : ''}`}>
              <div className="benefit-content">
                <div className="benefit-text">
                  <h2>{card.title}</h2>
                  <p>{card.description}</p>
                  <ul className="benefit-features">
                    {card.features.map((feature, featureIndex) => (
                      <li key={featureIndex}>
                        <i className="fas fa-check-circle"></i>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  
                </div>
                <div className="benefit-image">
                  <img src={card.image} alt={card.title} />
                  <div className="image-overlay"></div>
                </div>
              </div>
            </div>
          ))}
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