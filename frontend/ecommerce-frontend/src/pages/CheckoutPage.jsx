import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api, { getUserId } from '../api';

const CheckoutPage = ({ onCartChange }) => {
  const navigate = useNavigate();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [address, setAddress] = useState({
    fullName: '',
    street: '',
    city: '',
    zipCode: '',
    country: ''
  });

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAddress((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!cart || !cart.items || cart.items.length === 0) {
      alert('Your cart is empty!');
      return;
    }

    try {
      setSubmitting(true);
      const userId = getUserId();
      const totalAmount = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

      const orderRes = await api.post('/shipping/orders', {
        userId,
        items: cart.items,
        totalAmount,
        shippingAddress: address
      });

      const orderData = orderRes.data;

      // Clear cart
      await api.delete(`/cart/${userId}`);
      if (onCartChange) onCartChange();

      navigate(`/order-confirmation/${orderData.id || orderData._id || 'SUCCESS'}`, {
        state: { order: orderData }
      });
    } catch (err) {
      console.error(err);
      alert('Failed to place order. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div>Loading checkout...</div>;

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', background: 'var(--surface)', padding: '2rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)' }}>
      <h2 style={{ fontSize: '1.75rem', fontWeight: '700', marginBottom: '1.5rem' }}>Shipping & Checkout</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Full Name</label>
          <input
            type="text"
            name="fullName"
            required
            value={address.fullName}
            onChange={handleInputChange}
            style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)', background: 'var(--background)' }}
          />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Street Address</label>
          <input
            type="text"
            name="street"
            required
            value={address.street}
            onChange={handleInputChange}
            style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)', background: 'var(--background)' }}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>City</label>
            <input
              type="text"
              name="city"
              required
              value={address.city}
              onChange={handleInputChange}
              style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)', background: 'var(--background)' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Zip Code</label>
            <input
              type="text"
              name="zipCode"
              required
              value={address.zipCode}
              onChange={handleInputChange}
              style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)', background: 'var(--background)' }}
            />
          </div>
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Country</label>
          <input
            type="text"
            name="country"
            required
            value={address.country}
            onChange={handleInputChange}
            style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)', background: 'var(--background)' }}
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="btn btn-primary"
          style={{ marginTop: '1rem', padding: '0.875rem 1.5rem', fontSize: '1rem' }}
        >
          {submitting ? 'Placing Order...' : 'Place Order Now'}
        </button>
      </form>
    </div>
  );
};

export default CheckoutPage;
