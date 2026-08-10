import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api, { getUserId } from '../api';

const CartPage = ({ onCartChange }) => {
  const navigate = useNavigate();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const userId = getUserId();
      const res = await api.get(`/cart/${userId}`);
      setCart(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateQuantity = async (productId, currentQty, delta) => {
    const newQty = currentQty + delta;
    if (newQty <= 0) {
      handleRemoveItem(productId);
      return;
    }
    const item = cart.items.find(i => i.productId === productId);
    if (!item) return;

    try {
      const userId = getUserId();
      const res = await api.post(`/cart/${userId}/items`, {
        productId,
        quantity: newQty,
        price: item.price
      });
      setCart(res.data);
      if (onCartChange) onCartChange();
    } catch (err) {
      console.error(err);
      alert('Failed to update quantity');
    }
  };

  const handleRemoveItem = async (productId) => {
    try {
      const userId = getUserId();
      const res = await api.delete(`/cart/${userId}/items/${productId}`);
      setCart(res.data);
      if (onCartChange) onCartChange();
    } catch (err) {
      console.error(err);
      alert('Failed to remove item');
    }
  };

  const calculateTotal = () => {
    if (!cart || !cart.items) return 0;
    return cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  if (loading) return <div>Loading cart...</div>;

  const items = cart?.items || [];
  const total = calculateTotal();

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <h2 style={{ fontSize: '1.75rem', fontWeight: '700', marginBottom: '1.5rem' }}>Shopping Cart</h2>
      {items.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem', background: 'var(--surface)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)' }}>
          <p style={{ fontSize: '1.25rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Your cart is currently empty.</p>
          <Link to="/" className="btn btn-primary">Continue Shopping</Link>
        </div>
      ) : (
        <div>
          <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', overflow: 'hidden', marginBottom: '1.5rem' }}>
            {items.map((item) => (
              <div key={item.productId} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.25rem', borderBottom: '1px solid var(--border)' }}>
                <div>
                  <h4 style={{ fontSize: '1.1rem', fontWeight: '600' }}>Product #{item.productId}</h4>
                  <p style={{ color: 'var(--text-muted)' }}>Price: ${Number(item.price).toFixed(2)}</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--border)', borderRadius: 'var(--radius)', background: 'var(--background)' }}>
                    <button onClick={() => handleUpdateQuantity(item.productId, item.quantity, -1)} style={{ padding: '0.25rem 0.75rem', background: 'transparent', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>-</button>
                    <span style={{ padding: '0 0.5rem', fontWeight: '600' }}>{item.quantity}</span>
                    <button onClick={() => handleUpdateQuantity(item.productId, item.quantity, 1)} style={{ padding: '0.25rem 0.75rem', background: 'transparent', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>+</button>
                  </div>
                  <span style={{ fontWeight: '700', fontSize: '1.1rem', width: '90px', textAlign: 'right' }}>
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>
                  <button onClick={() => handleRemoveItem(item.productId)} className="btn" style={{ background: '#fee2e2', color: '#dc2626' }}>
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--surface)', padding: '1.5rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)' }}>
            <h3 style={{ fontSize: '1.5rem', fontWeight: '700' }}>Total: ${total.toFixed(2)}</h3>
            <button
              onClick={() => navigate('/checkout')}
              className="btn btn-primary"
              style={{ fontSize: '1rem', padding: '0.75rem 2rem' }}
            >
              Proceed to Checkout &rarr;
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
