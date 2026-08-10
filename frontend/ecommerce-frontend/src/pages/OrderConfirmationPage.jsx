import React, { useEffect, useState } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import api from '../api';

const OrderConfirmationPage = () => {
  const { id } = useParams();
  const location = useLocation();
  const [order, setOrder] = useState(location.state?.order || null);
  const [loading, setLoading] = useState(!location.state?.order);

  useEffect(() => {
    if (!order && id) {
      fetchOrder();
    }
  }, [id]);

  const fetchOrder = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/shipping/orders/${id}`);
      setOrder(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div style={{ padding: '2rem' }}>Fetching order status...</div>;

  return (
    <div style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
      <div style={{ background: '#c6f6d5', color: '#22543d', padding: '1.5rem', borderRadius: '8px', marginBottom: '2rem' }}>
        <h2>Order Confirmed! 🎉</h2>
        <p>Thank you for your purchase.</p>
      </div>

      <div style={{ border: '1px solid #eee', borderRadius: '8px', padding: '1.5rem', textAlign: 'left', marginBottom: '2rem' }}>
        <p style={{ marginBottom: '0.5rem' }}><strong>Order ID:</strong> {id || order?.id}</p>
        <p style={{ marginBottom: '0.5rem' }}><strong>Status:</strong> <span style={{ color: '#3182ce', fontWeight: 'bold' }}>{order?.status || 'PENDING'}</span></p>
        {order?.totalAmount && (
          <p style={{ marginBottom: '0.5rem' }}><strong>Total Amount:</strong> ${Number(order.totalAmount).toFixed(2)}</p>
        )}
      </div>

      <Link to="/" style={{ padding: '0.75rem 1.5rem', background: '#3182ce', color: '#fff', textDecoration: 'none', borderRadius: '4px' }}>
        Back to Home
      </Link>
    </div>
  );
};

export default OrderConfirmationPage;
