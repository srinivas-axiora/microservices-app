import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api, { getUserId } from '../api';

const AccountPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedOrderId, setExpandedOrderId] = useState(null);

  const userId = getUserId();
  const userEmail = localStorage.getItem('userEmail');
  const userFullName = localStorage.getItem('userFullName');

  useEffect(() => {
    fetchUserOrders();
  }, []);

  const fetchUserOrders = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/shipping/orders/user/${userId}`);
      setOrders(res.data || []);
    } catch (err) {
      console.error(err);
      setError('Failed to load past orders');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadgeStyle = (status) => {
    const s = (status || '').toUpperCase();
    if (s === 'DELIVERED' || s === 'COMPLETED') {
      return { background: '#d1fae5', color: '#065f46', border: '1px solid #a7f3d0' };
    }
    if (s === 'SHIPPED' || s === 'PROCESSING') {
      return { background: '#dbeafe', color: '#1e40af', border: '1px solid #bfdbfe' };
    }
    if (s === 'CANCELLED') {
      return { background: '#fee2e2', color: '#991b1b', border: '1px solid #fca5a5' };
    }
    // PENDING or default
    return { background: '#fef3c7', color: '#92400e', border: '1px solid #fde68a' };
  };

  const toggleOrderExpand = (orderId) => {
    setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
  };

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
      {/* Account Info Header */}
      <div style={{ background: 'var(--surface)', padding: '1.75rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)', marginBottom: '2rem', boxShadow: 'var(--shadow-sm)' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '0.75rem' }}>Account Profile</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          <div>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block' }}>Name</span>
            <strong style={{ fontSize: '1.05rem' }}>{userFullName || 'Guest User'}</strong>
          </div>
          <div>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block' }}>Email</span>
            <strong style={{ fontSize: '1.05rem' }}>{userEmail || 'N/A'}</strong>
          </div>
          <div>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block' }}>User ID</span>
            <code style={{ fontSize: '0.9rem' }}>{userId}</code>
          </div>
        </div>
      </div>

      {/* Orders Section */}
      <h3 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '1rem' }}>My Orders</h3>

      {loading ? (
        <div style={{ padding: '2rem', textAlign: 'center' }}>Loading your orders...</div>
      ) : error ? (
        <div style={{ color: 'red', padding: '1rem', background: '#fee2e2', borderRadius: 'var(--radius)' }}>{error}</div>
      ) : orders.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem', background: 'var(--surface)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)' }}>
          <p style={{ fontSize: '1.25rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
            You haven't placed any orders yet.
          </p>
          <Link to="/" className="btn btn-primary">
            Start Shopping
          </Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {orders.map((order) => {
            const isExpanded = expandedOrderId === order.id;
            const itemCount = Array.isArray(order.items) ? order.items.reduce((sum, item) => sum + (item.quantity || 1), 0) : 0;
            const formattedDate = new Date(order.createdAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            });

            return (
              <div 
                key={order.id} 
                style={{ 
                  background: 'var(--surface)', 
                  border: '1px solid var(--border)', 
                  borderRadius: 'var(--radius-lg)', 
                  overflow: 'hidden',
                  boxShadow: 'var(--shadow-sm)',
                  transition: 'all 0.2s'
                }}
              >
                {/* Card Header Summary */}
                <div 
                  onClick={() => toggleOrderExpand(order.id)}
                  style={{ 
                    padding: '1.25rem 1.5rem', 
                    display: 'flex', 
                    flexWrap: 'wrap',
                    justify: 'space-between', 
                    alignItems: 'center', 
                    cursor: 'pointer',
                    background: isExpanded ? 'var(--background)' : 'var(--surface)'
                  }}
                >
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                    <span style={{ fontWeight: '700', fontSize: '1.1rem' }}>Order #{order.id}</span>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Placed on {formattedDate}</span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginTop: '0.5rem' }}>
                    <span 
                      style={{ 
                        padding: '0.25rem 0.75rem', 
                        borderRadius: '9999px', 
                        fontSize: '0.8rem', 
                        fontWeight: '700',
                        textTransform: 'uppercase',
                        ...getStatusBadgeStyle(order.status)
                      }}
                    >
                      {order.status || 'PENDING'}
                    </span>

                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontWeight: '700', fontSize: '1.1rem', color: 'var(--primary)' }}>
                        ${Number(order.totalAmount).toFixed(2)}
                      </div>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{itemCount} item{itemCount !== 1 ? 's' : ''}</span>
                    </div>

                    <span style={{ fontSize: '1.2rem', color: 'var(--text-muted)' }}>
                      {isExpanded ? '▲' : '▼'}
                    </span>
                  </div>
                </div>

                {/* Expanded Details Section */}
                {isExpanded && (
                  <div style={{ padding: '1.5rem', borderTop: '1px solid var(--border)', background: 'var(--surface)' }}>
                    <h4 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.75rem' }}>Items Breakdown</h4>
                    <div style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius)', overflow: 'hidden', marginBottom: '1.25rem' }}>
                      {Array.isArray(order.items) && order.items.map((item, idx) => (
                        <div 
                          key={idx} 
                          style={{ 
                            display: 'flex', 
                            justify: 'space-between', 
                            padding: '0.75rem 1rem', 
                            borderBottom: idx < order.items.length - 1 ? '1px solid var(--border)' : 'none',
                            fontSize: '0.925rem'
                          }}
                        >
                          <div>
                            <span>Product #{item.productId}</span>
                            <span style={{ color: 'var(--text-muted)', marginLeft: '0.5rem' }}>x {item.quantity}</span>
                          </div>
                          <span style={{ fontWeight: '600' }}>
                            ${(Number(item.price) * Number(item.quantity)).toFixed(2)}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Shipment Info if available */}
                    {order.shipment && (
                      <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', padding: '1rem', borderRadius: 'var(--radius)' }}>
                        <h4 style={{ fontSize: '0.95rem', fontWeight: '600', color: '#166534', marginBottom: '0.5rem' }}>📦 Shipment Details</h4>
                        <p style={{ fontSize: '0.875rem', color: '#14532d', margin: '0.25rem 0' }}>
                          <strong>Carrier:</strong> {order.shipment.carrier || 'Standard Shipping'}
                        </p>
                        <p style={{ fontSize: '0.875rem', color: '#14532d', margin: '0.25rem 0' }}>
                          <strong>Tracking Number:</strong> <code style={{ background: '#dcfce7', padding: '0.15rem 0.4rem' }}>{order.shipment.trackingNumber || 'N/A'}</code>
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AccountPage;
