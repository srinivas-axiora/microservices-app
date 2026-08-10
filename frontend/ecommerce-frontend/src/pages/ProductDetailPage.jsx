import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api, { getUserId } from '../api';

const ProductDetailPage = ({ onCartChange }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/catalog/products/${id}`);
      setProduct(res.data);
    } catch (err) {
      console.error(err);
      setError('Product not found');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    try {
      const userId = getUserId();
      await api.post(`/cart/${userId}/items`, {
        productId: String(product.id),
        quantity: Number(quantity),
        price: Number(product.price)
      });
      if (onCartChange) onCartChange();
      navigate('/cart');
    } catch (err) {
      console.error(err);
      alert('Failed to add item to cart');
    }
  };

  if (loading) return <div>Loading product details...</div>;
  if (error || !product) return <div style={{ color: 'red' }}>{error || 'Product unavailable'}</div>;

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <button onClick={() => navigate(-1)} className="btn btn-outline" style={{ marginBottom: '1.5rem' }}>
        &larr; Back to Products
      </button>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem', background: 'var(--surface)', padding: '2rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)' }}>
        <div style={{ height: '280px', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 'var(--radius)', color: 'var(--text-muted)' }}>
          {product.imageUrl ? <img src={product.imageUrl} alt={product.name} style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }} /> : '📦 Product Image'}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <h2 style={{ fontSize: '1.75rem', fontWeight: '700', marginBottom: '0.5rem' }}>{product.name}</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', lineHeight: '1.6' }}>{product.description || 'No description available for this item.'}</p>
          <div style={{ fontSize: '1.75rem', fontWeight: '700', color: 'var(--primary)', marginBottom: '1.5rem' }}>
            ${Number(product.price).toFixed(2)}
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
            <label htmlFor="quantity" style={{ fontWeight: '600' }}>Quantity:</label>
            <select
              id="quantity"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              style={{ padding: '0.5rem 1rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)', background: 'var(--background)' }}
            >
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                <option key={num} value={num}>{num}</option>
              ))}
            </select>
          </div>

          <button
            onClick={handleAddToCart}
            className="btn btn-primary"
            style={{ padding: '0.875rem 1.5rem', fontSize: '1rem', marginTop: 'auto' }}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
