import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api, { getUserId } from '../api';

const DEFAULT_CATEGORIES = [
  { id: 'grocery', name: 'Grocery', img: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=150' },
  { id: 'mobiles', name: 'Mobiles', img: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=150' },
  { id: 'fashion', name: 'Fashion', img: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=150' },
  { id: 'electronics', name: 'Electronics', img: 'https://images.unsplash.com/photo-1498049860654-af1a5c566876?w=150' },
  { id: 'home', name: 'Home & Furniture', img: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=150' },
  { id: 'appliances', name: 'Appliances', img: 'https://images.unsplash.com/photo-1584992236310-6edddc08acff?w=150' },
  { id: 'flights', name: 'Flight Booking', img: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=150' },
  { id: 'toys', name: 'Toys, Beauty & More', img: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=150' },
  { id: 'bikes', name: 'Two Wheelers', img: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=150' }
];

const BANNERS = [
  {
    id: 1,
    title: 'Shaadi Specials',
    subtitle: 'Wedding Collections of the Season!',
    tag: '10% Instant Discount* with DBS Bank Cards',
    bg: 'linear-gradient(135deg, #e91e63 0%, #9c27b0 50%, #673ab7 100%)',
    img: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=800'
  },
  {
    id: 2,
    title: 'Electronics Festival',
    subtitle: 'Up to 60% OFF on Laptops & Audio',
    tag: 'No Cost EMI Available',
    bg: 'linear-gradient(135deg, #1e88e5 0%, #1565c0 50%, #0d47a1 100%)',
    img: 'https://images.unsplash.com/photo-1498049860654-af1a5c566876?w=800'
  }
];

const HomePage = ({ onCartChange, searchQuery = '' }) => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeBanner, setActiveBanner] = useState(0);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      const [prodRes, catRes] = await Promise.all([
        api.get('/catalog/products').catch(() => ({ data: [] })),
        api.get('/catalog/categories').catch(() => ({ data: [] }))
      ]);

      setProducts(prodRes.data || []);
      setCategories(catRes.data && catRes.data.length > 0 ? catRes.data : DEFAULT_CATEGORIES);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (product) => {
    try {
      const userId = getUserId();
      await api.post(`/cart/${userId}/items`, {
        productId: String(product.id),
        quantity: 1,
        price: Number(product.price)
      });
      if (onCartChange) onCartChange();
      setMessage(`Added ${product.name} to cart!`);
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      console.error(err);
      alert('Failed to add item to cart');
    }
  };

  // Filter products by category & search query
  const filteredProducts = products.filter(p => {
    const matchesSearch = !searchQuery || 
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      (p.description && p.description.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!selectedCategory) return matchesSearch;

    // Match by category ID or category Name
    const matchesCat = String(p.categoryId) === String(selectedCategory.id) ||
                       (selectedCategory.name && p.categoryName && p.categoryName.toLowerCase() === selectedCategory.name.toLowerCase());

    return matchesSearch && matchesCat;
  });


  return (
    <div className="fk-page-wrapper">
      {/* 1. Flipkart Category Icons Bar */}
      <div className="fk-category-bar">
        <div className="fk-category-scroll">
          <div 
            className={`fk-cat-item ${selectedCategory === null ? 'active' : ''}`}
            onClick={() => setSelectedCategory(null)}
          >
            <div className="fk-cat-img-box">
              <span style={{ fontSize: '1.8rem' }}>🛍️</span>
            </div>
            <span className="fk-cat-label">All Items</span>
          </div>

          {categories.map((cat, idx) => (
            <div
              key={cat.id || idx}
              className={`fk-cat-item ${selectedCategory?.id === cat.id ? 'active' : ''}`}
              onClick={() => setSelectedCategory(selectedCategory?.id === cat.id ? null : cat)}
            >
              <div className="fk-cat-img-box">
                {cat.imageUrl || cat.img ? (
                  <img src={cat.imageUrl || cat.img} alt={cat.name} />
                ) : (
                  <span>📦</span>
                )}
              </div>
              <span className="fk-cat-label">{cat.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Notification Toast */}
      {message && (
        <div className="fk-toast">
          ✨ {message}
        </div>
      )}

      {/* 2. Hero Promotional Carousel Banner */}
      <div className="fk-banner-container" style={{ background: BANNERS[activeBanner].bg }}>
        <button 
          className="fk-banner-arrow prev" 
          onClick={() => setActiveBanner((activeBanner - 1 + BANNERS.length) % BANNERS.length)}
        >
          ‹
        </button>

        <div className="fk-banner-content">
          <div className="fk-banner-text">
            <span className="fk-banner-badge">{BANNERS[activeBanner].title}</span>
            <h2>{BANNERS[activeBanner].subtitle}</h2>
            <button className="fk-banner-cta">Shop Now →</button>
            <div className="fk-banner-tag">{BANNERS[activeBanner].tag}</div>
          </div>
          <div className="fk-banner-image">
            <img src={BANNERS[activeBanner].img} alt="Banner promotion" />
          </div>
        </div>

        <button 
          className="fk-banner-arrow next" 
          onClick={() => setActiveBanner((activeBanner + 1) % BANNERS.length)}
        >
          ›
        </button>

        <div className="fk-banner-dots">
          {BANNERS.map((b, i) => (
            <span 
              key={b.id} 
              className={`fk-dot ${activeBanner === i ? 'active' : ''}`} 
              onClick={() => setActiveBanner(i)}
            />
          ))}
        </div>
      </div>

      {/* 3. Catalog Section with Logged-in Profile Header */}
      <div className="fk-main-section">
        <div className="fk-section-left">
          <div className="fk-section-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
              <Link to="/profile" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: '#ebf3fe', padding: '0.5rem 1rem', borderRadius: '8px', border: '1px solid #cce3ff', textDecoration: 'none' }} title="Click to view Your Account Profile">
                <span style={{ fontSize: '1.2rem' }}>👤</span>
                <span style={{ fontWeight: '700', color: '#2874f0', fontSize: '1.05rem' }}>{localStorage.getItem('userFullName') || 'naga'}</span>
                <span style={{ fontSize: '0.8rem', color: '#565959' }}>(Your Account Profile)</span>
              </Link>

              <div>
                <h3>{selectedCategory ? selectedCategory.name : 'Explore All Catalog Products'}</h3>
                <p className="fk-section-sub">Top choices with unbelievable discounts</p>
              </div>
            </div>
            <button className="fk-view-all-btn">VIEW ALL ›</button>
          </div>

          {loading ? (
            <div className="fk-loading">Loading catalog products...</div>
          ) : (
            <div className="fk-product-grid">
              {filteredProducts.length === 0 ? (
                <div className="fk-no-products">
                  <p>No products found matching your search.</p>
                  <button onClick={() => { setSelectedCategory(null); }} className="btn btn-outline">
                    Reset Filters
                  </button>
                </div>
              ) : (
                filteredProducts.map((p) => (
                  <div key={p.id} className="fk-product-card">
                    <div className="fk-product-img-wrap">
                      <img src={p.imageUrl || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400'} alt={p.name} />
                      <span className="fk-heart-icon">♡</span>
                    </div>
                    
                    <div className="fk-product-details">
                      <h4 className="fk-product-title">{p.name}</h4>
                      <p className="fk-product-desc">{p.description || 'Premium quality guaranteed'}</p>
                      
                      <div className="fk-rating-row">
                        <span className="fk-rating-badge">4.5 ★</span>
                        <span className="fk-rating-count">(1,240)</span>
                      </div>

                      <div className="fk-price-row">
                        <span className="fk-price">${Number(p.price).toFixed(2)}</span>
                        <span className="fk-original-price">${(Number(p.price) * 1.3).toFixed(2)}</span>
                        <span className="fk-discount">30% off</span>
                      </div>

                      <div className="fk-card-actions">
                        <Link to={`/products/${p.id}`} className="fk-btn-secondary">
                          Details
                        </Link>
                        <button onClick={() => handleAddToCart(p)} className="fk-btn-primary">
                          Add to Cart
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* 4. User Profile Account Quick Access Card */}
        <div className="fk-sidebar-banner">
          <Link to="/profile" className="fk-promo-card" style={{ textDecoration: 'none', display: 'block', cursor: 'pointer' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '1.6rem' }}>👤</span>
              <h4 style={{ margin: 0, color: '#0f1111' }}>{localStorage.getItem('userFullName') || 'naga'}'s Account</h4>
            </div>
            <p style={{ fontSize: '0.85rem', color: '#565959', marginBottom: '0.75rem' }}>
              Manage Orders, Login Security, Addresses & Wallet
            </p>
            <div style={{ background: '#f0f7ff', border: '1px solid #cce3ff', borderRadius: '8px', padding: '1rem', textAlign: 'center', marginBottom: '0.75rem' }}>
              <span style={{ fontSize: '2.2rem' }}>📦</span>
              <div style={{ fontWeight: '700', color: '#2874f0', marginTop: '0.25rem' }}>View Your Orders</div>
            </div>
            <button className="fk-promo-btn" style={{ width: '100%' }}>View Your Account ›</button>
          </Link>
        </div>
      </div>

    </div>
  );
};

export default HomePage;
