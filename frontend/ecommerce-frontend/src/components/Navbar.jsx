import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { clearAuthData } from '../api';

const Navbar = ({ cartCount = 0, onLogout }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const userFullName = localStorage.getItem('userFullName');

  const handleLogout = () => {
    clearAuthData();
    if (onLogout) onLogout();
    navigate('/login');
  };

  return (
    <header className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          🛒 MicroStore
        </Link>
        
        <nav className="navbar-links">
          <Link 
            to="/" 
            className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
          >
            Home
          </Link>

          {token && (
            <Link 
              to="/account" 
              className={`nav-link ${location.pathname === '/account' ? 'active' : ''}`}
            >
              My Orders
            </Link>
          )}
          
          <Link to="/cart" className="cart-icon-btn">
            <span>🛒 Cart</span>
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </Link>

          {token ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <Link to="/account" style={{ fontSize: '0.9rem', fontWeight: '500', color: 'var(--text-main)', textDecoration: 'none' }}>
                👤 {userFullName || 'Account'}
              </Link>
              <button 
                onClick={handleLogout} 
                className="btn btn-outline"
                style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}
              >
                Logout
              </button>
            </div>
          ) : (
            <Link to="/login" className="btn btn-primary" style={{ padding: '0.4rem 1rem', fontSize: '0.875rem' }}>
              Login / Sign Up
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
