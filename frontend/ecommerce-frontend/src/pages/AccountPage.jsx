import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api, { getUserId } from '../api';

const AccountPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const [activeTab, setActiveTab] = useState('orders'); // 'orders', 'security', 'addresses', 'payments'
  const [toastMessage, setToastMessage] = useState('');

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

  const showNotification = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
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
    return { background: '#fef3c7', color: '#92400e', border: '1px solid #fde68a' };
  };

  const toggleOrderExpand = (orderId) => {
    setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
  };

  const ACCOUNT_CARDS = [
    {
      id: 'orders',
      title: 'Your Orders',
      desc: 'Track, return, or buy things again',
      icon: '📦',
      action: () => {
        setActiveTab('orders');
        showNotification('Viewing your orders history');
      }
    },
    {
      id: 'security',
      title: 'Login & security',
      desc: 'Edit login, name, and mobile number',
      icon: '🔒',
      action: () => {
        setActiveTab('security');
        showNotification('Login & security settings active');
      }
    },
    {
      id: 'prime',
      title: 'MicroStore Plus',
      desc: 'View benefits and payment settings',
      icon: '🎁',
      action: () => {
        showNotification('You are a MicroStore Plus member!');
      }
    },
    {
      id: 'addresses',
      title: 'Your Addresses',
      desc: 'Edit addresses for orders and gifts',
      icon: '📍',
      action: () => {
        setActiveTab('addresses');
        showNotification('Addresses manager active');
      }
    },
    {
      id: 'business',
      title: 'Your business account',
      desc: 'Sign up for free to save up to 18% with GST invoice and bulk discounts',
      icon: '🏢',
      action: () => {
        showNotification('MicroStore Business program enabled!');
      }
    },
    {
      id: 'payments',
      title: 'Payment options',
      desc: 'Edit or add payment methods',
      icon: '💳',
      action: () => {
        setActiveTab('payments');
        showNotification('Payment options manager active');
      }
    },
    {
      id: 'balance',
      title: 'MicroStore Pay balance',
      desc: 'Add money to your balance',
      icon: '👛',
      action: () => {
        showNotification('MicroStore Pay Balance: $250.00');
      }
    },
    {
      id: 'contact',
      title: 'Contact Us',
      desc: 'Contact our customer service via phone or chat',
      icon: '🎧',
      action: () => {
        showNotification('Support Helpline: 1800-MICRO-STORE');
      }
    }
  ];

  return (
    <div className="account-container">
      {/* Page Heading */}
      <h1 className="account-heading">Your Account</h1>

      {toastMessage && (
        <div className="fk-toast">
          ✨ {toastMessage}
        </div>
      )}

      {/* Grid of 8 Cards (exact match to Amazon/Flipkart reference image) */}
      <div className="account-grid">
        {ACCOUNT_CARDS.map((card) => (
          <div key={card.id} className="account-card" onClick={card.action}>
            <div className="account-card-icon">{card.icon}</div>
            <div className="account-card-content">
              <div className="account-card-title">{card.title}</div>
              <div className="account-card-desc">{card.desc}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Section Content based on selected card */}
      <div style={{ background: '#ffffff', border: '1px solid #D5D9D9', borderRadius: '8px', padding: '1.75rem', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
        {activeTab === 'orders' && (
          <div>
            <h3 style={{ fontSize: '1.4rem', fontWeight: '700', marginBottom: '1.25rem', color: '#0f1111' }}>
              Your Orders
            </h3>

            {loading ? (
              <div style={{ padding: '2rem', textAlign: 'center', color: '#565959' }}>Loading your orders...</div>
            ) : error ? (
              <div style={{ color: '#c0392b', padding: '1rem', background: '#fdf2e9', borderRadius: '6px' }}>{error}</div>
            ) : orders.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3rem', background: '#fafafa', borderRadius: '8px', border: '1px dashed #ccc' }}>
                <p style={{ fontSize: '1.1rem', color: '#565959', marginBottom: '1.25rem' }}>
                  You haven't placed any orders yet.
                </p>
                <Link to="/" className="fk-banner-cta" style={{ display: 'inline-block' }}>
                  Start Shopping Now →
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
                    <div key={order.id} style={{ border: '1px solid #D5D9D9', borderRadius: '8px', overflow: 'hidden' }}>
                      <div 
                        onClick={() => toggleOrderExpand(order.id)}
                        style={{ 
                          padding: '1.25rem', 
                          display: 'flex', 
                          justifyContent: 'space-between', 
                          alignItems: 'center', 
                          cursor: 'pointer',
                          background: isExpanded ? '#f7fafa' : '#ffffff'
                        }}
                      >
                        <div>
                          <span style={{ fontWeight: '700', fontSize: '1.05rem', color: '#0f1111' }}>Order #{order.id}</span>
                          <span style={{ fontSize: '0.85rem', color: '#565959', marginLeft: '1rem' }}>Placed on {formattedDate}</span>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                          <span style={{ padding: '0.25rem 0.75rem', borderRadius: '12px', fontSize: '0.8rem', fontWeight: '700', ...getStatusBadgeStyle(order.status) }}>
                            {order.status || 'PENDING'}
                          </span>
                          <div style={{ fontWeight: '700', fontSize: '1.1rem', color: '#2874f0' }}>
                            ${Number(order.totalAmount).toFixed(2)}
                          </div>
                          <span style={{ color: '#565959' }}>{isExpanded ? '▲' : '▼'}</span>
                        </div>
                      </div>

                      {isExpanded && (
                        <div style={{ padding: '1.25rem', borderTop: '1px solid #D5D9D9', background: '#fafafa' }}>
                          <h4 style={{ fontSize: '0.95rem', fontWeight: '700', marginBottom: '0.75rem' }}>Items Purchased ({itemCount})</h4>
                          <div style={{ background: '#ffffff', border: '1px solid #e0e0e0', borderRadius: '6px' }}>
                            {Array.isArray(order.items) && order.items.map((item, idx) => (
                              <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem 1rem', borderBottom: idx < order.items.length - 1 ? '1px solid #eee' : 'none' }}>
                                <span>Product ID #{item.productId} <span style={{ color: '#878787' }}>(x{item.quantity})</span></span>
                                <strong style={{ color: '#212121' }}>${(Number(item.price) * Number(item.quantity)).toFixed(2)}</strong>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {activeTab === 'security' && (
          <div>
            <h3 style={{ fontSize: '1.4rem', fontWeight: '700', marginBottom: '1rem' }}>Login & Security</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '500px' }}>
              <div>
                <label style={{ fontSize: '0.85rem', color: '#565959', display: 'block', marginBottom: '0.25rem' }}>Name</label>
                <input type="text" defaultValue={userFullName || 'Guest User'} className="fk-search-input" style={{ paddingLeft: '1rem' }} />
              </div>
              <div>
                <label style={{ fontSize: '0.85rem', color: '#565959', display: 'block', marginBottom: '0.25rem' }}>Email</label>
                <input type="email" defaultValue={userEmail || 'user@example.com'} className="fk-search-input" style={{ paddingLeft: '1rem' }} />
              </div>
              <div>
                <label style={{ fontSize: '0.85rem', color: '#565959', display: 'block', marginBottom: '0.25rem' }}>Mobile Phone Number</label>
                <input type="tel" defaultValue="+1 (555) 019-2834" className="fk-search-input" style={{ paddingLeft: '1rem' }} />
              </div>
              <button className="fk-banner-cta" style={{ width: 'fit-content', marginTop: '0.5rem' }}>Save Changes</button>
            </div>
          </div>
        )}

        {activeTab === 'addresses' && (
          <div>
            <h3 style={{ fontSize: '1.4rem', fontWeight: '700', marginBottom: '1rem' }}>Your Addresses</h3>
            <div style={{ border: '2px dashed #007185', borderRadius: '8px', padding: '1.5rem', textAlign: 'center', cursor: 'pointer', background: '#f7fafa' }}>
              <span style={{ fontSize: '2rem' }}>➕</span>
              <h4 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#007185', marginTop: '0.5rem' }}>Add Address</h4>
            </div>
          </div>
        )}

        {activeTab === 'payments' && (
          <div>
            <h3 style={{ fontSize: '1.4rem', fontWeight: '700', marginBottom: '1rem' }}>Payment Options</h3>
            <div style={{ padding: '1rem', background: '#f7fafa', border: '1px solid #D5D9D9', borderRadius: '6px', marginBottom: '1rem' }}>
              <strong>💳 Saved Credit Card</strong>
              <p style={{ fontSize: '0.85rem', color: '#565959', marginTop: '0.25rem' }}>Visa ending in 4242 (Expires 12/28)</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AccountPage;
