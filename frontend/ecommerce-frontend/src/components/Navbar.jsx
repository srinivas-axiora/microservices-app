import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { clearAuthData } from '../api';

const Navbar = ({ cartCount = 0, onLogout, onSearch }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const userFullName = localStorage.getItem('userFullName');
  const [searchTerm, setSearchTerm] = useState('');

  const handleLogout = () => {
    clearAuthData();
    if (onLogout) onLogout();
    navigate('/login');
  };

  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearchTerm(val);
    if (onSearch) onSearch(val);
  };

  return (
    <header className="fk-header">
      <div className="fk-header-container">
        {/* Flipkart-Style Brand Logo */}
        <Link to="/" className="fk-logo-box">
          <div className="fk-logo-text">Flipkart</div>
          <div className="fk-logo-sub">
            Explore <span className="fk-plus">Plus✦</span>
          </div>
        </Link>

        {/* Global Search Bar */}
        <div className="fk-search-box">
          <svg className="fk-search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input
            type="text"
            placeholder="Search For Products, Brands and More"
            value={searchTerm}
            onChange={handleSearchChange}
            className="fk-search-input"
          />
        </div>

        {/* Header Actions */}
        <div className="fk-header-actions">
          {token ? (
            <div className="fk-user-menu">
              <span className="fk-user-name">👤 {userFullName || 'Account'}</span>
              <button onClick={handleLogout} className="fk-btn-logout">
                Logout
              </button>
            </div>
          ) : (
            <Link to="/login" className="fk-login-btn">
              👤 Login
            </Link>
          )}

          <Link to="/cart" className="fk-cart-btn">
            <svg className="fk-cart-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="9" cy="21" r="1"></circle>
              <circle cx="20" cy="21" r="1"></circle>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
            </svg>
            <span>Cart</span>
            {cartCount > 0 && <span className="fk-cart-badge">{cartCount}</span>}
          </Link>

          <div className="fk-seller-btn">
            🏪 Become a Seller
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;

