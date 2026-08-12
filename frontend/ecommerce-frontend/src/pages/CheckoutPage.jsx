import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api, { getUserId } from '../api';

const CheckoutPage = ({ onCartChange }) => {
  const navigate = useNavigate();
  const [cart, setCart] = useState(null);
  const [productsMap, setProductsMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [isEditingAddress, setIsEditingAddress] = useState(false);

  const [address, setAddress] = useState({
    fullName: 'Nelapatla Srinivas',
    street: '2-1-316, Chandrannakunta bazar',
    city: 'SURYAPET',
    state: 'TELANGANA',
    zipCode: '508213',
    country: 'India'
  });

  useEffect(() => {
    fetchCartAndProducts();
  }, []);

  const fetchCartAndProducts = async () => {
    try {
      setLoading(true);
      const userId = getUserId();

      const [cartRes, productsRes] = await Promise.allSettled([
        api.get(`/cart/${userId}`),
        api.get('/catalog/products')
      ]);

      const fetchedCart = cartRes.status === 'fulfilled' ? cartRes.value.data : null;
      setCart(fetchedCart);

      if (productsRes.status === 'fulfilled' && Array.isArray(productsRes.value.data)) {
        const map = {};
        productsRes.value.data.forEach(p => {
          map[String(p.id)] = p;
        });
        setProductsMap(map);
      }
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

  const calculateSubtotal = () => {
    if (!cart || !cart.items) return 0;
    return cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  const handleSubmit = async () => {
    if (!cart || !cart.items || cart.items.length === 0) {
      alert('Your cart is empty!');
      return;
    }

    try {
      setSubmitting(true);
      const userId = getUserId();
      const totalAmount = calculateSubtotal();

      const orderRes = await api.post('/shipping/orders', {
        userId,
        items: cart.items,
        totalAmount,
        shippingAddress: address,
        paymentMethod
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

  if (loading) return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading Checkout...</div>;

  const items = cart?.items || [];
  const subtotal = calculateSubtotal();

  return (
    <div style={{ background: '#eaeded', minHeight: '100vh', padding: '1.5rem 0.5rem', fontFamily: 'Arial, sans-serif' }}>
      <div style={{ maxWidth: '1300px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 340px', gap: '1.5rem' }}>
        
        {/* LEFT COLUMN: Shipping & Payment Form */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          {/* Section 1: Delivery Address */}
          <div style={{ background: '#fff', padding: '1.25rem 1.5rem', borderRadius: '4px', border: '1px solid #ddd' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#0F1111', marginBottom: '0.25rem' }}>
                  Delivering to {address.fullName}
                </h3>
                <p style={{ fontSize: '0.9rem', color: '#565959', margin: '0.25rem 0' }}>
                  {address.street}, {address.city}, {address.state}, {address.zipCode}, {address.country}
                </p>
                <a href="#instructions" style={{ fontSize: '0.85rem', color: '#007185', textDecoration: 'none' }}>
                  Add delivery instructions
                </a>
              </div>
              <button
                onClick={() => setIsEditingAddress(!isEditingAddress)}
                style={{ background: 'none', border: 'none', color: '#007185', cursor: 'pointer', fontSize: '0.9rem' }}
              >
                {isEditingAddress ? 'Close' : 'Change'}
              </button>
            </div>

            {/* Editable Address Form */}
            {isEditingAddress && (
              <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #ddd', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: '600' }}>Full Name</label>
                  <input type="text" name="fullName" value={address.fullName} onChange={handleInputChange} style={{ width: '100%', padding: '0.4rem', borderRadius: '4px', border: '1px solid #ccc' }} />
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: '600' }}>Street Address</label>
                  <input type="text" name="street" value={address.street} onChange={handleInputChange} style={{ width: '100%', padding: '0.4rem', borderRadius: '4px', border: '1px solid #ccc' }} />
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: '600' }}>City</label>
                  <input type="text" name="city" value={address.city} onChange={handleInputChange} style={{ width: '100%', padding: '0.4rem', borderRadius: '4px', border: '1px solid #ccc' }} />
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: '600' }}>State</label>
                  <input type="text" name="state" value={address.state} onChange={handleInputChange} style={{ width: '100%', padding: '0.4rem', borderRadius: '4px', border: '1px solid #ccc' }} />
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: '600' }}>Zip Code</label>
                  <input type="text" name="zipCode" value={address.zipCode} onChange={handleInputChange} style={{ width: '100%', padding: '0.4rem', borderRadius: '4px', border: '1px solid #ccc' }} />
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: '600' }}>Country</label>
                  <input type="text" name="country" value={address.country} onChange={handleInputChange} style={{ width: '100%', padding: '0.4rem', borderRadius: '4px', border: '1px solid #ccc' }} />
                </div>
              </div>
            )}
          </div>

          {/* Section 2: Payment Method */}
          <div style={{ background: '#fff', padding: '1.25rem 1.5rem', borderRadius: '4px', border: '1px solid #ddd' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#0F1111', marginBottom: '1rem' }}>Payment method</h2>

            <div style={{ border: '1px solid #d5d9d9', borderRadius: '8px', padding: '1.25rem' }}>
              
              {/* Available Balance Option */}
              <div style={{ paddingBottom: '1rem', borderBottom: '1px solid #ddd' }}>
                <h4 style={{ fontSize: '0.9rem', fontWeight: '700', color: '#0F1111', marginBottom: '0.5rem' }}>Your available balance</h4>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: '#565959', cursor: 'not-allowed' }}>
                  <input type="radio" name="payment" disabled /> Amazon Pay Balance ₹0.00 Unavailable
                </label>
                <p style={{ fontSize: '0.8rem', color: '#007185', marginLeft: '1.5rem', marginTop: '0.2rem' }}>
                  ℹ️ Insufficient balance. Add money & get rewarded
                </p>
                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem', marginLeft: '1.5rem' }}>
                  <input type="text" placeholder="Enter Code" style={{ padding: '0.3rem 0.6rem', border: '1px solid #ccc', borderRadius: '4px', width: '140px', fontSize: '0.85rem' }} />
                  <button style={{ padding: '0.3rem 1rem', background: '#FFF', border: '1px solid #D5D9D9', borderRadius: '15px', cursor: 'pointer', fontSize: '0.85rem' }}>Apply</button>
                </div>
              </div>

              {/* Another Payment Methods */}
              <div style={{ paddingTop: '1rem' }}>
                <h4 style={{ fontSize: '0.9rem', fontWeight: '700', color: '#0F1111', marginBottom: '0.75rem' }}>Another payment method</h4>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  
                  {/* Credit / Debit Card */}
                  <label style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem', cursor: 'pointer' }}>
                    <input
                      type="radio"
                      name="payment"
                      value="card"
                      checked={paymentMethod === 'card'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      style={{ marginTop: '0.2rem' }}
                    />
                    <div>
                      <span style={{ fontSize: '0.9rem', fontWeight: '600', color: '#0F1111' }}>Credit or debit card</span>
                      <div style={{ display: 'flex', gap: '0.4rem', marginTop: '0.3rem' }}>
                        <span style={{ background: '#0a2540', color: '#fff', padding: '0.1rem 0.4rem', borderRadius: '3px', fontSize: '0.7rem', fontWeight: 'bold' }}>VISA</span>
                        <span style={{ background: '#eb001b', color: '#fff', padding: '0.1rem 0.4rem', borderRadius: '3px', fontSize: '0.7rem', fontWeight: 'bold' }}>MasterCard</span>
                        <span style={{ background: '#006fcf', color: '#fff', padding: '0.1rem 0.4rem', borderRadius: '3px', fontSize: '0.7rem', fontWeight: 'bold' }}>AMEX</span>
                        <span style={{ background: '#00457c', color: '#fff', padding: '0.1rem 0.4rem', borderRadius: '3px', fontSize: '0.7rem', fontWeight: 'bold' }}>RuPay</span>
                      </div>
                    </div>
                  </label>

                  {/* Net Banking */}
                  <label style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem', cursor: 'pointer' }}>
                    <input
                      type="radio"
                      name="payment"
                      value="netbanking"
                      checked={paymentMethod === 'netbanking'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      style={{ marginTop: '0.2rem' }}
                    />
                    <div>
                      <span style={{ fontSize: '0.9rem', fontWeight: '600', color: '#0F1111' }}>Net Banking</span>
                      <div style={{ marginTop: '0.3rem' }}>
                        <select style={{ padding: '0.3rem 0.6rem', border: '1px solid #ccc', borderRadius: '4px', fontSize: '0.85rem' }}>
                          <option>Choose an Option</option>
                          <option>SBI</option>
                          <option>HDFC Bank</option>
                          <option>ICICI Bank</option>
                          <option>Axis Bank</option>
                        </select>
                      </div>
                    </div>
                  </label>

                  {/* UPI */}
                  <label style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem', cursor: 'pointer' }}>
                    <input
                      type="radio"
                      name="payment"
                      value="upi"
                      checked={paymentMethod === 'upi'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      style={{ marginTop: '0.2rem' }}
                    />
                    <div>
                      <span style={{ fontSize: '0.9rem', fontWeight: '600', color: '#0F1111' }}>Scan and Pay with UPI 📱</span>
                      <p style={{ fontSize: '0.8rem', color: '#565959', margin: '0.1rem 0' }}>
                        ℹ️ You will need to Scan the QR code on the payment page to complete the payment.
                      </p>
                    </div>
                  </label>

                  {/* Cash on Delivery */}
                  <label style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem', cursor: 'pointer' }}>
                    <input
                      type="radio"
                      name="payment"
                      value="cod"
                      checked={paymentMethod === 'cod'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      style={{ marginTop: '0.2rem' }}
                    />
                    <div>
                      <span style={{ fontSize: '0.9rem', fontWeight: '600', color: '#0F1111' }}>Cash on Delivery / Pay on Delivery</span>
                      <p style={{ fontSize: '0.8rem', color: '#565959', margin: '0.1rem 0' }}>
                        Cash, UPI and Cards accepted. <a href="#knowmore" style={{ color: '#007185' }}>Know more.</a>
                      </p>
                    </div>
                  </label>

                </div>
              </div>

            </div>

            <button
              onClick={handleSubmit}
              disabled={submitting}
              style={{
                marginTop: '1.25rem',
                background: '#FFD814',
                border: '1px solid #FCD200',
                padding: '0.6rem 1.5rem',
                borderRadius: '20px',
                fontSize: '0.9rem',
                fontWeight: '500',
                cursor: 'pointer'
              }}
            >
              Use this payment method
            </button>
          </div>

          {/* Section 3: Review Items and Shipping */}
          <div style={{ background: '#fff', padding: '1.25rem 1.5rem', borderRadius: '4px', border: '1px solid #ddd' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#0F1111', marginBottom: '1rem' }}>Review items and shipping</h3>

            {items.map((item) => {
              const details = productsMap[String(item.productId)] || {};
              return (
                <div key={item.productId} style={{ display: 'flex', gap: '1rem', padding: '0.75rem 0', borderBottom: '1px solid #eee' }}>
                  <img src={details.imageUrl || 'https://via.placeholder.com/80'} alt="" style={{ width: '60px', height: '60px', objectFit: 'contain' }} />
                  <div>
                    <h4 style={{ fontSize: '0.9rem', fontWeight: '500', color: '#0F1111' }}>{details.name || `Product #${item.productId}`}</h4>
                    <p style={{ fontSize: '0.85rem', color: '#565959' }}>Qty: {item.quantity}</p>
                    <p style={{ fontSize: '0.85rem', fontWeight: '700', color: '#B12704' }}>${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Footer Terms */}
          <div style={{ fontSize: '0.75rem', color: '#565959', lineHeight: '1.4' }}>
            Need help? Check our <a href="#help" style={{ color: '#007185' }}>help pages</a> or <a href="#contact" style={{ color: '#007185' }}>contact us 24x7</a>.<br/>
            When your order is placed, we'll send you an e-mail message acknowledging receipt of your order.<br/>
            See Amazon's <a href="#returns" style={{ color: '#007185' }}>Return Policy</a>.<br/>
            <Link to="/cart" style={{ color: '#007185' }}>Back to cart</Link>
          </div>

        </div>

        {/* RIGHT COLUMN: Order Summary Box */}
        <div>
          <div style={{ background: '#fff', padding: '1.25rem', borderRadius: '4px', border: '1px solid #ddd', position: 'sticky', top: '1rem' }}>
            <button
              onClick={handleSubmit}
              disabled={submitting}
              style={{
                width: '100%',
                background: '#FFD814',
                border: '1px solid #FCD200',
                padding: '0.6rem',
                borderRadius: '20px',
                fontSize: '0.9rem',
                fontWeight: '500',
                cursor: 'pointer',
                marginBottom: '1rem'
              }}
            >
              {submitting ? 'Placing Order...' : 'Use this payment method'}
            </button>

            <div style={{ borderTop: '1px solid #ddd', paddingTop: '0.75rem', fontSize: '0.85rem', display: 'flex', flexDirection: 'column', gap: '0.4rem', color: '#565959' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Items:</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Delivery:</span>
                <span>$0.00</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Marketplace Fee:</span>
                <span>$0.00</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#007600' }}>
                <span>Free Delivery</span>
                <span>-$0.00</span>
              </div>

              <div style={{ borderTop: '1px solid #ddd', paddingTop: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', color: '#0F1111' }}>
                <span style={{ fontSize: '1.1rem', fontWeight: '700' }}>Order Total:</span>
                <span style={{ fontSize: '1.3rem', fontWeight: '700', color: '#B12704' }}>
                  ${subtotal.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default CheckoutPage;

