import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api, { getUserId } from '../api';

const HomePage = ({ onCartChange }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await api.get('/catalog/products');
      setProducts(res.data || []);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch products');
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

  if (loading) return <div className="main-content">Loading products...</div>;
  if (error) return <div className="main-content" style={{ color: 'red' }}>{error}</div>;

  return (
    <div>
      <h2 style={{ fontSize: '1.75rem', fontWeight: '700', marginBottom: '0.5rem' }}>Catalog Products</h2>
      <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Explore our microservices-powered catalog</p>
      
      {message && (
        <div style={{ background: '#d1fae5', color: '#065f46', padding: '0.75rem 1rem', borderRadius: 'var(--radius)', marginBottom: '1rem', fontWeight: '500' }}>
          {message}
        </div>
      )}

      <div className="product-grid">
        {products.length === 0 ? (
          <p>No products found.</p>
        ) : (
          products.map((product) => (
            <div key={product.id} className="product-card">
              <div className="product-image-container">
                {product.imageUrl ? (
                  <img src={product.imageUrl} alt={product.name} style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }} />
                ) : (
                  <span>📦 Product Image</span>
                )}
              </div>
              <div className="product-info">
                <h3 className="product-title">{product.name}</h3>
                <div className="product-price">${Number(product.price).toFixed(2)}</div>
                <div style={{ display: 'flex', gap: '0.5rem', marginTop: 'auto' }}>
                  <Link to={`/products/${product.id}`} className="btn btn-outline" style={{ flex: 1 }}>
                    Details
                  </Link>
                  <button onClick={() => handleAddToCart(product)} className="btn btn-primary" style={{ flex: 1 }}>
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default HomePage;
