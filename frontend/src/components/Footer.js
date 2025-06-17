import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

function Footer() {
  const location = useLocation();
  const navigate = useNavigate();

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleScrollLink = (id) => {
    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => scrollToSection(id), 100);
    } else {
      scrollToSection(id);
    }
  };

  return (
    <footer id="contact">
      <div className="footer-content">
        <div className="footer-section">
          <h3>About LocalMart</h3>
          <p>
            LocalMart connects buyers with local sellers, making shopping convenient
            while supporting small businesses.
          </p>
        </div>

        <div className="footer-section">
          <h3>Quick Links</h3>
          <ul>
            <li>
              <a
                href="#features"
                onClick={(e) => {
                  e.preventDefault();
                  handleScrollLink('features');
                }}
              >
                Features
              </a>
            </li>
            <li>
              <a
                href="#audience"
                onClick={(e) => {
                  e.preventDefault();
                  handleScrollLink('audience');
                }}
              >
                For Who
              </a>
            </li>
            <li><a href="/login">Login</a></li>
            <li><a href="/signup">Sign Up</a></li>
          </ul>
        </div>

        <div className="footer-section">
          <h3>Contact Us</h3>
          <ul>
            <li><i className="fas fa-map-marker-alt"></i> Namal University, Mianwali</li>
            {/* <li><i className="fas fa-phone"></i> +92 123 456 7890</li> */}
            <li><i className="fas fa-envelope"></i> info@localmart.com</li>
          </ul>

          <div className="social-links">
            <a href="#"><i className="fab fa-facebook-f"></i></a>
            <a href="#"><i className="fab fa-twitter"></i></a>
            <a href="#"><i className="fab fa-instagram"></i></a>
            <a href="#"><i className="fab fa-linkedin-in"></i></a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; 2025 LocalMart. All Rights Reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;
